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
import { headerDisplayThreadKey, headerEffectiveAgent, headerSendThreadKey } from './headerChat';

interface AtlasState {
  currentAgentId: AgentId | null;
  tool: string;
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
        chatMode: 'ask',
        chatOpen: false,
      }),
    [patch],
  );
  const goAgent = useCallback(
    (id: AgentId) => patch({ currentAgentId: id, tool: 'dashboard', headerTargetAgent: id }),
    [patch],
  );
  const goTool = useCallback(
    (id: string) => patch({ tool: id, inlineChatOpen: false }),
    [patch],
  );

  const toggleChat = useCallback(() => patch((s) => ({ chatOpen: !s.chatOpen })), [patch]);
  const onChatDraftChange = useCallback((v: string) => patch({ chatDraft: v }), [patch]);
  const setChatTag = useCallback(
    (id: AgentId) => patch((s) => ({ chatTag: s.chatTag === id ? null : id })),
    [patch],
  );

  const sendChat = useCallback(() => {
    if (stateRef.current.chatLoading) return;
    const text = stateRef.current.chatDraft.trim();
    if (!text) return;
    const tag = stateRef.current.chatTag;
    const userMsg: ChatMessage = { role: 'user', text, tag };
    patch((cur) => ({ chatMessages: [...cur.chatMessages, userMsg], chatDraft: '', chatLoading: true }));

    generate({
      message: text,
      agent: tag,
      history: stateRef.current.chatMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text })),
    })
      .then((result) => {
        patch((cur) => ({
          chatLoading: false,
          chatMessages: [
            ...cur.chatMessages,
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
          chatMessages: [...cur.chatMessages, { role: 'assistant', text: `⚠️ ${errorMessage(err)}`, tag }],
        }));
      });
  }, [patch]);

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
    (id: AgentId | null) => patch({ headerTargetAgent: id, headerOpenMenu: null }),
    [patch],
  );

  const setHeaderScope = useCallback(
    (name: string) =>
      patch((s) => {
        const next = s.headerScopeApp === name ? null : name;
        const threadKey = headerSendThreadKey(s.currentAgentId, s.headerTargetAgent);
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
        const threadKey = headerSendThreadKey(s.currentAgentId, s.headerTargetAgent);
        return {
          headerScopeApp: null,
          headerOpenMenu: null,
          headerThreads: { ...s.headerThreads, [threadKey]: [] },
        };
      }),
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
    const threadKey = headerSendThreadKey(s0.currentAgentId, s0.headerTargetAgent);
    const prior = s0.headerThreads[threadKey] ?? [];
    const userMsg: HeaderMessage = { role: 'user', text, scope, agent };

    patch((cur) => ({
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
            [threadKey]: [...thread, { role: 'assistant', text: `⚠️ ${errorMessage(err)}`, scope, agent }],
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
    setChatMode,
    toggleHeaderAgentMenu,
    toggleHeaderScopeMenu,
    closeHeaderMenus,
    onHeaderDraftChange,
    setHeaderScope,
    clearHeaderScope,
    setHeaderTargetAgent,
    activeHeaderMessages,
    sendHeaderChat,
    toggleIntegration,
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
