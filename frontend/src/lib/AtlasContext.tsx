import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { APPROVALS_SEED, INTEGRATIONS, PRD_STEP_LABELS } from './data';
import { generate, AtlasApiError, slackRespond, type GenerateResult } from './api';
import { loadPersistedHeaderThreads, persistHeaderThreads } from './chatPersistence';
import type {
  AgentId,
  Approval,
  ApprovalStatus,
  ChatMessage,
  ChatMode,
  HeaderMessage,
  HeaderThreadKey,
  Integration,
} from './types';
import {
  headerDisplayThreadKey,
  headerEffectiveAgent,
  headerHomeSendThreadKey,
  headerHomeThreadFromTag,
  headerSendThreadKey,
} from './headerChat';

export type HomeNav = 'home' | 'integrations';

interface AtlasState {
  currentAgentId: AgentId | null;
  tool: string;
  /** Homepage side nav: overview vs integrations (only when currentAgentId is null) */
  homeNav: HomeNav;
  integrations: Integration[];
  chatOpen: boolean;
  chatDraft: string;
  chatTag: AgentId | null;
  chatLoading: boolean;
  headerBarOpen: boolean;
  inlineChatOpen: boolean;
  headerDraft: string;
  headerScopeApp: string | null;
  headerTargetAgent: AgentId | null;
  headerOpenMenu: 'agent' | 'apps' | null;
  headerChatLoading: boolean;
  chatMode: ChatMode;
  headerThreads: Record<HeaderThreadKey, HeaderMessage[]>;
  /** Homepage: which saved thread is expanded in the ask card; null = compact bar only */
  homeActiveThreadKey: HeaderThreadKey | null;
  chatMessages: ChatMessage[];
  prdPrompt: string;
  prdGenerating: boolean;
  prdStep: number;
  prdResult: GenerateResult | null;
  prdError: string | null;
  techSpecPrompt: string;
  techSpecGenerating: boolean;
  techSpecResult: GenerateResult | null;
  techSpecError: string | null;
  battleSelected: string;
  approvals: Approval[];
}

function initialState(): AtlasState {
  return {
    currentAgentId: null,
    tool: 'dashboard',
    homeNav: 'home',
    integrations: INTEGRATIONS.map((i) => ({ ...i })),
    chatOpen: false,
    chatDraft: '',
    chatTag: null,
    chatLoading: false,
    headerBarOpen: false,
    inlineChatOpen: false,
    headerDraft: '',
    headerScopeApp: null,
    headerTargetAgent: null,
    headerOpenMenu: null,
    headerChatLoading: false,
    chatMode: 'ask',
    headerThreads: loadPersistedHeaderThreads(),
    homeActiveThreadKey: null,
    chatMessages: [
      {
        role: 'assistant',
        text: "Hi! I'm the Atlas assistant. Ask me anything, or tag a message to a specific agent (Product, Engineering, Market, Sales) and I'll route you there.",
        tag: null,
      },
    ],
    prdPrompt: '',
    prdGenerating: false,
    prdStep: 0,
    prdResult: null,
    prdError: null,
    techSpecPrompt: 'Notification settings API — granular per-channel toggles',
    techSpecGenerating: false,
    techSpecResult: null,
    techSpecError: null,
    battleSelected: 'Productboard',
    approvals: APPROVALS_SEED.map((a) => ({ ...a })),
  };
}

function errorMessage(err: unknown): string {
  if (err instanceof AtlasApiError) return err.message;
  if (err instanceof Error) return err.message;
  return String(err);
}

function resolveHeaderThreadKey(s: AtlasState): HeaderThreadKey {
  if (s.currentAgentId) {
    return headerSendThreadKey(s.currentAgentId, s.headerTargetAgent);
  }
  return headerHomeSendThreadKey(s.homeActiveThreadKey, s.headerTargetAgent);
}

function useAtlasController() {
  const [state, setState] = useState<AtlasState>(initialState);
  const prdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Always mirrors the latest state during render, so event handlers can read
  // fresh values without going stale (their useCallback deps never change).
  const stateRef = useRef(state);
  stateRef.current = state;

  const patch = useCallback((p: Partial<AtlasState> | ((s: AtlasState) => Partial<AtlasState>)) => {
    setState((s) => {
      const next = { ...s, ...(typeof p === 'function' ? p(s) : p) };
      if (next.headerThreads !== s.headerThreads) {
        persistHeaderThreads(next.headerThreads);
      }
      return next;
    });
  }, []);

  const goPicker = useCallback(
    () =>
      patch({
        currentAgentId: null,
        inlineChatOpen: false,
        headerTargetAgent: null,
        headerScopeApp: null,
        headerDraft: '',
        headerOpenMenu: null,
        headerBarOpen: false,
        headerChatLoading: false,
        homeActiveThreadKey: null,
        chatTag: null,
        chatMode: 'ask',
        chatOpen: false,
        homeNav: 'home',
      }),
    [patch],
  );
  const openHomeIntegrations = useCallback(
    () =>
      patch({
        currentAgentId: null,
        homeNav: 'integrations',
        inlineChatOpen: false,
        headerOpenMenu: null,
        headerBarOpen: false,
      }),
    [patch],
  );
  const goAgent = useCallback(
    (id: AgentId) => patch({ currentAgentId: id, tool: 'dashboard', headerTargetAgent: id, homeNav: 'home' }),
    [patch],
  );
  const goTool = useCallback(
    (id: string) => patch({ tool: id, inlineChatOpen: false }),
    [patch],
  );

  const toggleChat = useCallback(() => patch((s) => ({ chatOpen: !s.chatOpen })), [patch]);
  const onChatDraftChange = useCallback((v: string) => patch({ chatDraft: v }), [patch]);
  const setChatTag = useCallback(
    (id: AgentId) =>
      patch((s) => {
        const nextTag = s.chatTag === id ? null : id;
        if (s.currentAgentId) {
          return { chatTag: nextTag };
        }
        return {
          chatTag: nextTag,
          headerTargetAgent: nextTag,
          homeActiveThreadKey: nextTag,
        };
      }),
    [patch],
  );

  const appendHomeHeaderMessages = useCallback(
    (threadKey: HeaderThreadKey, msgs: HeaderMessage[]) => {
      if (msgs.length === 0) return;
      patch((cur) => ({
        headerThreads: {
          ...cur.headerThreads,
          [threadKey]: [...(cur.headerThreads[threadKey] ?? []), ...msgs],
        },
      }));
    },
    [patch],
  );

  const sendChat = useCallback(() => {
    if (stateRef.current.chatLoading) return;
    const text = stateRef.current.chatDraft.trim();
    if (!text) return;
    const s0 = stateRef.current;
    const tag = s0.chatTag;
    const onHome = !s0.currentAgentId;
    const homeThreadKey = headerHomeThreadFromTag(tag);
    const now = Date.now();
    const userMsg: ChatMessage = { role: 'user', text, tag };
    patch((cur) => ({ chatMessages: [...cur.chatMessages, userMsg], chatDraft: '', chatLoading: true }));
    if (onHome) {
      appendHomeHeaderMessages(homeThreadKey, [
        { role: 'user', text, agent: tag, at: now },
      ]);
    }

    generate({
      message: text,
      agent: tag,
      history: s0.chatMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text })),
    })
      .then((result) => {
        const assistantText = result.body;
        patch((cur) => ({
          chatLoading: false,
          chatMessages: [
            ...cur.chatMessages,
            {
              role: 'assistant',
              text: assistantText,
              title: result.title,
              tag,
              citations: result.citations,
              confidence: result.confidence,
              uncertaintyFlags: result.uncertaintyFlags,
            },
          ],
        }));
        if (onHome) {
          appendHomeHeaderMessages(homeThreadKey, [
            {
              role: 'assistant',
              text: assistantText,
              title: result.title,
              agent: tag,
              citations: result.citations,
              confidence: result.confidence,
              uncertaintyFlags: result.uncertaintyFlags,
              at: Date.now(),
            },
          ]);
        }
      })
      .catch((err: unknown) => {
        const errText = `⚠️ ${errorMessage(err)}`;
        patch((cur) => ({
          chatLoading: false,
          chatMessages: [...cur.chatMessages, { role: 'assistant', text: errText, tag }],
        }));
        if (onHome) {
          appendHomeHeaderMessages(homeThreadKey, [
            { role: 'assistant', text: errText, agent: tag, at: Date.now() },
          ]);
        }
      });
  }, [patch, appendHomeHeaderMessages]);

  const openAgentFromChat = useCallback(
    (id: AgentId) => patch({ chatOpen: false, currentAgentId: id, tool: 'dashboard', headerTargetAgent: id }),
    [patch],
  );

  const toggleHeaderBar = useCallback(
    () => patch((s) => ({ headerBarOpen: !s.headerBarOpen, headerOpenMenu: null })),
    [patch],
  );
  const openInlineChat = useCallback(
    () => patch({ inlineChatOpen: true, headerOpenMenu: null, headerBarOpen: false }),
    [patch],
  );
  const closeInlineChat = useCallback(() => patch({ inlineChatOpen: false }), [patch]);
  const setChatMode = useCallback((m: ChatMode) => patch({ chatMode: m }), [patch]);
  const toggleHeaderAgentMenu = useCallback(
    () => patch((s) => ({ headerOpenMenu: s.headerOpenMenu === 'agent' ? null : 'agent' })),
    [patch],
  );
  const toggleHeaderScopeMenu = useCallback(
    () => patch((s) => ({ headerOpenMenu: s.headerOpenMenu === 'apps' ? null : 'apps' })),
    [patch],
  );
  const closeHeaderMenus = useCallback(() => patch({ headerOpenMenu: null }), [patch]);
  const onHeaderDraftChange = useCallback((v: string) => patch({ headerDraft: v }), [patch]);
  const setHeaderTargetAgent = useCallback(
    (id: AgentId | null) =>
      patch((s) => {
        if (s.currentAgentId) {
          return { headerTargetAgent: id, headerOpenMenu: null };
        }
        return {
          headerTargetAgent: id,
          homeActiveThreadKey: id,
          chatTag: id,
          headerOpenMenu: null,
        };
      }),
    [patch],
  );

  const setHeaderScope = useCallback(
    (name: string) =>
      patch((s) => {
        const next = s.headerScopeApp === name ? null : name;
        const threadKey = s.currentAgentId
          ? headerSendThreadKey(s.currentAgentId, s.headerTargetAgent)
          : headerHomeSendThreadKey(s.homeActiveThreadKey, s.headerTargetAgent);
        const scopeChanged = next !== s.headerScopeApp;
        return {
          headerScopeApp: next,
          headerOpenMenu: null,
          headerThreads: scopeChanged
            ? { ...s.headerThreads, [threadKey]: [] }
            : s.headerThreads,
        };
      }),
    [patch],
  );

  const clearHeaderScope = useCallback(
    () =>
      patch((s) => {
        const threadKey = s.currentAgentId
          ? headerSendThreadKey(s.currentAgentId, s.headerTargetAgent)
          : headerHomeSendThreadKey(s.homeActiveThreadKey, s.headerTargetAgent);
        return {
          headerScopeApp: null,
          headerOpenMenu: null,
          headerThreads: { ...s.headerThreads, [threadKey]: [] },
        };
      }),
    [patch],
  );

  const homeAskMessages = useCallback(() => {
    const s = stateRef.current;
    if (s.currentAgentId) return [];
    const key = s.homeActiveThreadKey;
    if (!key) return [];
    return s.headerThreads[key] ?? [];
  }, []);

  const selectHomeConversation = useCallback(
    (key: HeaderThreadKey) =>
      patch({
        homeActiveThreadKey: key,
        headerDraft: '',
        headerTargetAgent: key === 'home' ? null : key,
        chatTag: key === 'home' ? null : key,
        headerOpenMenu: null,
      }),
    [patch],
  );

  const clearHomeConversation = useCallback(
    () =>
      patch({
        homeActiveThreadKey: null,
        headerDraft: '',
        headerTargetAgent: null,
        headerScopeApp: null,
        chatTag: null,
        headerOpenMenu: null,
      }),
    [patch],
  );

  const deleteHomeConversationThread = useCallback(
    (key: HeaderThreadKey) =>
      patch((s) => {
        const clearingActive = s.homeActiveThreadKey === key;
        return {
          headerThreads: { ...s.headerThreads, [key]: [] },
          ...(clearingActive
            ? {
                homeActiveThreadKey: null,
                headerDraft: '',
                headerTargetAgent: null,
                headerScopeApp: null,
                chatTag: null,
                headerOpenMenu: null,
              }
            : {}),
        };
      }),
    [patch],
  );

  const startNewAgentChat = useCallback(
    (agentId: AgentId) =>
      patch((s) => ({
        headerThreads: { ...s.headerThreads, [agentId]: [] },
        headerDraft: '',
        headerChatLoading: false,
        headerOpenMenu: null,
        inlineChatOpen: true,
        headerBarOpen: false,
        headerTargetAgent: agentId,
        chatTag: agentId,
        homeActiveThreadKey:
          s.currentAgentId === null && (s.homeActiveThreadKey === agentId || s.headerTargetAgent === agentId)
            ? null
            : s.homeActiveThreadKey,
      })),
    [patch],
  );

  const activeHeaderMessages = useCallback(() => {
    const s = stateRef.current;
    const key = headerDisplayThreadKey(s.currentAgentId, s.headerTargetAgent);
    return s.headerThreads[key] ?? [];
  }, []);

  const sendHeaderChat = useCallback(() => {
    if (stateRef.current.headerChatLoading) return;
    const text = stateRef.current.headerDraft.trim();
    if (!text) return;
    const s0 = stateRef.current;
    const scope = s0.headerScopeApp;
    const agent = headerEffectiveAgent(s0.currentAgentId, s0.headerTargetAgent);
    const onHome = !s0.currentAgentId;
    const threadKey = resolveHeaderThreadKey(s0);
    const prior = s0.headerThreads[threadKey] ?? [];
    const now = Date.now();
    const userMsg: HeaderMessage = { role: 'user', text, scope, agent, at: now };

    patch((cur) => ({
      ...(onHome
        ? {
            homeActiveThreadKey: threadKey,
            headerTargetAgent: threadKey === 'home' ? null : threadKey,
            chatTag: threadKey === 'home' ? null : threadKey,
          }
        : {}),
      headerThreads: { ...cur.headerThreads, [threadKey]: [...(cur.headerThreads[threadKey] ?? []), userMsg] },
      headerDraft: '',
      headerChatLoading: true,
    }));

    const history = prior.map((m) => ({ role: m.role, text: m.text }));

    const finish = (result: GenerateResult) => {
      patch((cur) => {
        const thread = cur.headerThreads[threadKey] ?? [];
        return {
          headerChatLoading: false,
          headerThreads: {
            ...cur.headerThreads,
            [threadKey]: [
              ...thread,
              {
                role: 'assistant',
                text: result.body,
                title: result.title,
                scope,
                agent,
                citations: result.citations,
                confidence: result.confidence,
                uncertaintyFlags: result.uncertaintyFlags,
                at: Date.now(),
              },
            ],
          },
        };
      });
    };
    const fail = (err: unknown) => {
      patch((cur) => {
        const thread = cur.headerThreads[threadKey] ?? [];
        return {
          headerChatLoading: false,
          headerThreads: {
            ...cur.headerThreads,
            [threadKey]: [
              ...thread,
              { role: 'assistant', text: `⚠️ ${errorMessage(err)}`, scope, agent, at: Date.now() },
            ],
          },
        };
      });
    };

    if (scope === 'Slack') {
      slackRespond(text, false, history).then(finish).catch(fail);
      return;
    }

    generate({ message: text, agent, scope, history }).then(finish).catch(fail);
  }, [patch]);

  const editHeaderUserMessage = useCallback(
    (messageIndex: number, newText: string, threadKeyOverride?: HeaderThreadKey) => {
      const trimmed = newText.trim();
      if (!trimmed || stateRef.current.headerChatLoading) return;
      const s0 = stateRef.current;
      const threadKey = threadKeyOverride ?? resolveHeaderThreadKey(s0);
      const thread = s0.headerThreads[threadKey] ?? [];
      const existing = thread[messageIndex];
      if (!existing || existing.role !== 'user') return;

      const scope = existing.scope ?? s0.headerScopeApp;
      const agent = existing.agent ?? headerEffectiveAgent(s0.currentAgentId, s0.headerTargetAgent);
      const truncated = thread.slice(0, messageIndex);
      const userMsg: HeaderMessage = { role: 'user', text: trimmed, scope, agent, at: Date.now() };

      patch((cur) => ({
        headerThreads: {
          ...cur.headerThreads,
          [threadKey]: [...truncated, userMsg],
        },
        headerChatLoading: true,
      }));

      const history = truncated.map((m) => ({ role: m.role, text: m.text }));

      const finish = (result: GenerateResult) => {
        patch((cur) => {
          const base = (cur.headerThreads[threadKey] ?? []).slice(0, messageIndex + 1);
          return {
            headerChatLoading: false,
            headerThreads: {
              ...cur.headerThreads,
              [threadKey]: [
                ...base,
                {
                  role: 'assistant',
                  text: result.body,
                  title: result.title,
                  scope,
                  agent,
                  citations: result.citations,
                  confidence: result.confidence,
                  uncertaintyFlags: result.uncertaintyFlags,
                  at: Date.now(),
                },
              ],
            },
          };
        });
      };
      const fail = (err: unknown) => {
        patch((cur) => {
          const base = (cur.headerThreads[threadKey] ?? []).slice(0, messageIndex + 1);
          return {
            headerChatLoading: false,
            headerThreads: {
              ...cur.headerThreads,
              [threadKey]: [
                ...base,
                { role: 'assistant', text: `⚠️ ${errorMessage(err)}`, scope, agent, at: Date.now() },
              ],
            },
          };
        });
      };

      if (scope === 'Slack') {
        slackRespond(trimmed, false, history).then(finish).catch(fail);
        return;
      }
      generate({ message: trimmed, agent, scope, history }).then(finish).catch(fail);
    },
    [patch],
  );

  const editFloatingChatUserMessage = useCallback(
    (messageIndex: number, newText: string) => {
      const trimmed = newText.trim();
      if (!trimmed || stateRef.current.chatLoading) return;
      const s0 = stateRef.current;
      const messages = s0.chatMessages;
      const existing = messages[messageIndex];
      if (!existing || existing.role !== 'user') return;

      const tag = existing.tag ?? s0.chatTag;
      const truncated = messages.slice(0, messageIndex);
      const userMsg: ChatMessage = { role: 'user', text: trimmed, tag };

      patch({ chatMessages: [...truncated, userMsg], chatLoading: true });

      const history = truncated
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text }));

      generate({ message: trimmed, agent: tag, history })
        .then((result) => {
          patch((cur) => ({
            chatLoading: false,
            chatMessages: [
              ...cur.chatMessages.slice(0, messageIndex + 1),
              {
                role: 'assistant',
                text: result.body,
                title: result.title,
                tag,
                citations: result.citations,
                confidence: result.confidence,
                uncertaintyFlags: result.uncertaintyFlags,
              },
            ],
          }));
        })
        .catch((err: unknown) => {
          patch((cur) => ({
            chatLoading: false,
            chatMessages: [
              ...cur.chatMessages.slice(0, messageIndex + 1),
              { role: 'assistant', text: `⚠️ ${errorMessage(err)}`, tag },
            ],
          }));
        });
    },
    [patch],
  );

  const toggleIntegration = useCallback(
    (name: string) =>
      patch((s) => ({
        integrations: s.integrations.map((i) =>
          i.name === name
            ? { ...i, status: i.status === 'connected' ? 'not_connected' : 'connected', lastSync: i.status === 'connected' ? null : 'Just now' }
            : i,
        ),
      })),
    [patch],
  );

  const addCustomIntegration = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return false;
      const s = stateRef.current;
      if (s.integrations.some((i) => i.name.toLowerCase() === trimmed.toLowerCase())) return false;
      patch({
        integrations: [
          ...s.integrations,
          {
            name: trimmed,
            icon: 'drive',
            desc: 'Custom connector — configure credentials in workspace settings',
            color: '#5C6472',
            bg: '#F4F4F6',
            status: 'not_connected',
            lastSync: null,
          },
        ],
      });
      return true;
    },
    [patch],
  );

  const onPrdPromptChange = useCallback((v: string) => patch({ prdPrompt: v }), [patch]);
  const quickFillPrd = useCallback((ex: string) => patch({ prdPrompt: ex }), [patch]);

  const runPrd = useCallback(() => {
    const prompt = stateRef.current.prdPrompt.trim();
    if (!prompt || stateRef.current.prdGenerating) return;
    if (prdIntervalRef.current) clearInterval(prdIntervalRef.current);
    const agent = stateRef.current.currentAgentId;
    patch({ prdGenerating: true, prdResult: null, prdError: null, prdStep: 0 });

    const lastStep = PRD_STEP_LABELS.length - 1;
    prdIntervalRef.current = setInterval(() => {
      patch((cur) => (cur.prdStep >= lastStep ? cur : { prdStep: cur.prdStep + 1 }));
    }, 700);

    generate({ message: prompt, agent })
      .then((result) => {
        if (prdIntervalRef.current) clearInterval(prdIntervalRef.current);
        patch({ prdGenerating: false, prdResult: result, prdStep: PRD_STEP_LABELS.length });
      })
      .catch((err: unknown) => {
        if (prdIntervalRef.current) clearInterval(prdIntervalRef.current);
        patch({ prdGenerating: false, prdError: errorMessage(err) });
      });
  }, [patch]);

  const onTechSpecPromptChange = useCallback((v: string) => patch({ techSpecPrompt: v }), [patch]);
  const quickFillTechSpec = useCallback((ex: string) => patch({ techSpecPrompt: ex }), [patch]);

  const runTechSpec = useCallback(() => {
    const prompt = stateRef.current.techSpecPrompt.trim();
    if (!prompt || stateRef.current.techSpecGenerating) return;
    const agent = stateRef.current.currentAgentId;
    patch({ techSpecGenerating: true, techSpecResult: null, techSpecError: null });

    generate({ message: `Write a technical spec for: ${prompt}`, agent })
      .then((result) => patch({ techSpecGenerating: false, techSpecResult: result }))
      .catch((err: unknown) => patch({ techSpecGenerating: false, techSpecError: errorMessage(err) }));
  }, [patch]);

  const selectBattle = useCallback((name: string) => patch({ battleSelected: name }), [patch]);

  const resolveApproval = useCallback(
    (id: string, status: ApprovalStatus) =>
      patch((s) => ({ approvals: s.approvals.map((a) => (a.id === id ? { ...a, status } : a)) })),
    [patch],
  );

  return {
    state,
    goPicker,
    openHomeIntegrations,
    goAgent,
    goTool,
    toggleChat,
    onChatDraftChange,
    setChatTag,
    sendChat,
    openAgentFromChat,
    toggleHeaderBar,
    openInlineChat,
    closeInlineChat,
    startNewAgentChat,
    setChatMode,
    toggleHeaderAgentMenu,
    toggleHeaderScopeMenu,
    closeHeaderMenus,
    onHeaderDraftChange,
    setHeaderScope,
    clearHeaderScope,
    setHeaderTargetAgent,
    activeHeaderMessages,
    homeAskMessages,
    selectHomeConversation,
    clearHomeConversation,
    deleteHomeConversationThread,
    sendHeaderChat,
    editHeaderUserMessage,
    editFloatingChatUserMessage,
    toggleIntegration,
    addCustomIntegration,
    onPrdPromptChange,
    quickFillPrd,
    runPrd,
    onTechSpecPromptChange,
    quickFillTechSpec,
    runTechSpec,
    selectBattle,
    resolveApproval,
  };
}

type AtlasController = ReturnType<typeof useAtlasController>;

const AtlasContext = createContext<AtlasController | null>(null);

export function AtlasProvider({ children }: { children: ReactNode }) {
  const controller = useAtlasController();
  return <AtlasContext.Provider value={controller}>{children}</AtlasContext.Provider>;
}

export function useAtlas() {
  const ctx = useContext(AtlasContext);
  if (!ctx) throw new Error('useAtlas must be used within AtlasProvider');
  return ctx;
}
