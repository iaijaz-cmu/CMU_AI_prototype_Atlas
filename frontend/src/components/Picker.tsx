import { useEffect, useState } from 'react';
import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import type { AgentId } from '../lib/types';
import { fetchSlackMessages, type SlackMessage } from '../lib/api';
import { AgentIllustrationCard } from './icons/AgentIllustration';
import { IntegrationLogo } from './IntegrationLogo';
import { FloatingChat } from './FloatingChat';
import { ChatMessageList } from './ChatMessageList';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { useChatScroll } from './useChatScroll';
import { HomeSideNav } from './HomeSideNav';
import { HeaderAskDropdown } from './HeaderAskDropdown';
import { theme } from '../lib/theme';

const NAV_COLLAPSED_KEY = 'atlas-home-nav-collapsed';

const STAT_STRIP = [
  { label: '38 KB documents', sub: 'indexed' },
  { label: '100% eval score', sub: 'Sprint 2' },
  { label: '$0.27/user/mo', sub: 'avg inference cost' },
  { label: '4 agents', sub: 'one workspace' },
];

export function Picker() {
  const [navCollapsed, setNavCollapsed] = useState(() => {
    try {
      return localStorage.getItem(NAV_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(NAV_COLLAPSED_KEY, navCollapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [navCollapsed]);

  return (
    <div className="h-full flex overflow-hidden">
      <HomeSideNav collapsed={navCollapsed} onToggleCollapse={() => setNavCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col overflow-y-auto relative min-w-0">
      <div className="flex items-center justify-end px-8 py-5">
        <div className="flex items-center gap-2 text-[12.5px] text-n-text-2">
          <span
            className="w-[7px] h-[7px] rounded-full bg-emerald-500 inline-block"
            style={{ animation: 'atlas-pulse 2s ease-in-out infinite' }}
          />
          v0.3 · Sprint 2
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-16">
        <div className="text-center mb-8 max-w-[560px]">
          <div className="atlas-ai-badge mb-4.5">
            RAG-powered · Evidence-grounded · Human-approved
          </div>
          <h1 className="font-inherit text-[44px] leading-tight font-semibold m-0 mb-3 tracking-[-0.02em] text-n-text">
            Hello, Ifra<span style={{ color: theme.ai }}>.</span>
          </h1>
          <p className="text-n-text-2 text-[17px] leading-normal m-0">
            Your workspace, your agents. Ask anything, or pick who you want working with you.
          </p>
        </div>

        <AskCard />

        <div className="grid gap-4 w-full max-w-[1040px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {AGENT_DEFS.map((ag) => (
            <AgentCard key={ag.id} agentId={ag.id} />
          ))}
        </div>

        <div className="flex items-center gap-0 mt-11 text-[13px] text-n-text-muted">
          {STAT_STRIP.map((st, i) => (
            <div
              key={st.label}
              className="px-5.5 text-center"
              style={{ borderLeft: i === 0 ? 'none' : `1px solid ${theme.border}`, paddingLeft: i === 0 ? 0 : undefined }}
            >
              <p className="font-semibold text-n-text m-0 mb-0.5 text-[13.5px]">{st.label}</p>
              <p className="m-0 text-[11.5px]">{st.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <FloatingChat />
      </div>
    </div>
  );
}

function AskCard() {
  const {
    state,
    onHeaderDraftChange,
    sendHeaderChat,
    activeHeaderMessages,
  } = useAtlas();
  const headerMessages = activeHeaderMessages();
  const connected = state.integrations.filter((i) => i.status === 'connected');
  const shown = connected.slice(0, 2);
  const overflow = Math.max(0, connected.length - 2);
  const slackScoped = state.headerScopeApp === 'Slack';
  const gmailScoped = state.headerScopeApp === 'Gmail';
  const inputPlaceholder = gmailScoped
    ? 'Ask Atlas — then use Open in Gmail to draft an email with the answer…'
    : slackScoped
    ? 'Ask about your last Slack channel thread — follow-ups stay in this chat…'
    : 'Ask or find anything from your workspace…';

  const hasThread = headerMessages.length > 0 || state.headerChatLoading;
  const { bottomRef, containerRef } = useChatScroll([
    headerMessages.length,
    state.headerChatLoading,
    headerMessages[headerMessages.length - 1]?.text,
  ]);

  return (
    <div className="w-full max-w-[720px] mb-10 relative z-20">
      <div className="atlas-card-elevated rounded-2xl flex flex-col">
        {hasThread && (
          <div
            ref={containerRef}
            className="max-h-[min(52vh,440px)] overflow-y-auto px-4 sm:px-5 py-4 flex flex-col gap-4 bg-gradient-to-b from-n-inset to-white border-b border-n-border rounded-t-2xl"
          >
            <ChatMessageList
              messages={headerMessages}
              gmailCompact={!gmailScoped}
              showGmail
            />
            {state.headerChatLoading && <ChatTypingIndicator />}
            <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
          </div>
        )}

        {hasThread && (
          <p className="text-[10px] text-n-text-muted text-center mt-2 mb-0 px-4">
            Conversation saved in this browser · pick up below or open an agent workspace to continue there
          </p>
        )}
        <div className="px-5.5 py-5 relative z-10 overflow-visible rounded-b-[22px]">
        <textarea
          value={state.headerDraft}
          onChange={(e) => onHeaderDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendHeaderChat();
            }
          }}
          rows={hasThread ? 2 : 1}
          placeholder={inputPlaceholder}
          className="w-full box-border border-none outline-none text-[16px] text-n-text font-inherit mb-4 resize-none leading-relaxed min-h-[28px] bg-transparent"
        />
        {slackScoped && <SlackScopePreview />}
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <HeaderAskDropdown align="left" />
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="flex items-center">
              {shown.map((ic) => (
                <IntegrationLogo key={ic.name} icon={ic.icon} bg={ic.bg} overlap />
              ))}
              {overflow > 0 && <span className="text-[11px] text-n-text-muted ml-1">+{overflow}</span>}
            </div>
            <button
              type="button"
              onClick={sendHeaderChat}
              disabled={!state.headerDraft.trim() || state.headerChatLoading}
              className="w-8 h-8 rounded-lg text-white border border-transparent cursor-pointer flex items-center justify-center text-sm font-medium"
              style={{
                background: theme.ai,
                opacity: state.headerDraft.trim() && !state.headerChatLoading ? 1 : 0.45,
              }}
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function SlackScopePreview() {
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [channel, setChannel] = useState('product-payments');
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchSlackMessages(4).then((data) => {
      if (cancelled) return;
      setMessages(data.messages.slice(-3));
      setChannel(data.channel?.name ?? 'product-payments');
      setDemoMode(data.demoMode ?? false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mb-4 rounded-xl border border-[#4A154B]/20 bg-[#FAFAF8] px-3 py-2.5 text-left">
      <p className="text-[11px] font-bold text-[#4A154B] m-0 mb-1.5">
        Last messages · #{channel}
        {demoMode && <span className="font-normal text-n-text-2"> (demo until Slack token is set)</span>}
      </p>
      <div className="space-y-1">
        {messages.map((m) => (
          <p key={m.ts} className="text-[12px] text-n-text-2 m-0 leading-snug truncate">
            {m.text}
          </p>
        ))}
      </div>
    </div>
  );
}

function AgentCard({ agentId }: { agentId: AgentId }) {
  const { goAgent } = useAtlas();
  const [hover, setHover] = useState(false);
  const def = AGENT_DEFS.find((a) => a.id === agentId)!;

  return (
    <div
      onClick={() => goAgent(agentId)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="atlas-card rounded-2xl overflow-hidden cursor-pointer"
      style={{
        borderColor: hover ? def.accent : theme.border,
        transform: hover ? 'translateY(-3px)' : 'none',
        boxShadow: hover ? `0 10px 30px ${def.shadowColor}` : 'none',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
        animation: 'atlas-fadein 0.4s ease-out',
      }}
    >
      <div className="h-[160px] bg-n-inset flex items-center justify-center p-4 box-border border-b border-n-border">
        <AgentIllustrationCard agentId={agentId} />
      </div>
      <div className="p-4.5">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[11px] font-bold tracking-[0.8px] uppercase"
            style={{ color: def.accent }}
          >
            {def.name}
          </span>
          <span style={{ color: def.accent }} className="text-sm">
            →
          </span>
        </div>
        <p className="font-semibold text-sm m-0 mb-1.5 leading-snug text-n-text">{def.tagline}</p>
        <p className="text-xs text-n-text-2 leading-normal m-0">{def.description}</p>
      </div>
      <div className="px-4.5 pb-4.5 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(2,max-content)' }}>
        {def.tools.slice(1).map((t) => (
          <span
            key={t.id}
            className="text-[11.5px] font-medium px-3 py-1 rounded-full text-center"
            style={{ border: `1px solid ${def.accent}35`, color: def.accent, background: def.accentBg }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
