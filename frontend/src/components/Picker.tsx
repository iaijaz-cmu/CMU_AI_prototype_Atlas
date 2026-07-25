import { useEffect, useState } from 'react';
import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS, ATLAS_HOME_COPY } from '../lib/data';
import type { AgentId } from '../lib/types';
import { fetchSlackMessages, type SlackMessage } from '../lib/api';
import { AgentIllustrationCard } from './icons/AgentIllustration';
import { FloatingChat } from './FloatingChat';
import { ChatMessageList } from './ChatMessageList';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { useChatScroll } from './useChatScroll';
import { HomeSideNav } from './HomeSideNav';
import { HomeHeader } from './HomeHeader';
import { HomePortfolioWidget } from './HomePortfolioWidget';
import { HomeCompetitorSnapshotWidget } from './HomeCompetitorSnapshotWidget';
import { HeaderAskDropdown } from './HeaderAskDropdown';
import { HomeRecentConversationsWidget } from './HomeRecentConversationsWidget';
import { theme } from '../lib/theme';
import { conversationLabel } from '../lib/headerChat';

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
      <HomeHeader />

      <div className="flex-1 flex flex-col px-6 sm:px-10 pt-2 pb-16 max-w-[1120px] w-full mx-auto">
        <div className="mb-8 max-w-[640px]">
          <h1 className="text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.1] m-0 mb-2 text-n-text tracking-tight">
            {ATLAS_HOME_COPY.greeting.replace(/\.$/, '')}
            <span className="text-n-accent">.</span>
          </h1>
          <p className="text-n-text-2 text-[17px] leading-relaxed m-0 max-w-[520px]">
            {ATLAS_HOME_COPY.welcomeSubline}
          </p>
        </div>

        <AskCard />

        <HomeRecentConversationsWidget />

        <div
          className="grid gap-5 w-full mb-12"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' }}
        >
          <HomePortfolioWidget />
          <HomeCompetitorSnapshotWidget />
        </div>

        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-n-text-muted m-0 mb-4">Agents</h2>
        <div className="grid gap-5 w-full" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
          {AGENT_DEFS.map((ag) => (
            <AgentCard key={ag.id} agentId={ag.id} />
          ))}
        </div>

        <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-n-border/80">
          {STAT_STRIP.map((st) => (
            <div key={st.label}>
              <p className="text-[20px] font-semibold text-n-text m-0 leading-none tabular-nums">{st.label.split(' ')[0]}</p>
              <p className="text-[11px] text-n-text-muted m-0 mt-1">{st.sub}</p>
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
    homeAskMessages,
    clearHomeConversation,
  } = useAtlas();
  const headerMessages = homeAskMessages();
  const expanded = state.homeActiveThreadKey !== null;
  const slackScoped = state.headerScopeApp === 'Slack';
  const gmailScoped = state.headerScopeApp === 'Gmail';
  const inputPlaceholder = gmailScoped
    ? 'Ask Atlas — then use Open in Gmail to draft an email with the answer…'
    : slackScoped
    ? 'Ask about your last Slack channel thread — follow-ups stay in this chat…'
    : expanded
      ? 'Continue the conversation…'
      : 'Ask or find anything from your workspace…';

  const hasThread = expanded && (headerMessages.length > 0 || state.headerChatLoading);
  const { bottomRef, containerRef } = useChatScroll([
    headerMessages.length,
    state.headerChatLoading,
    headerMessages[headerMessages.length - 1]?.text,
    state.homeActiveThreadKey,
  ]);

  return (
    <div className="w-full mb-6 relative z-30">
      <div className="atlas-card-elevated flex flex-col overflow-visible">
        {expanded && (
          <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-n-border bg-white/80 rounded-t-2xl shrink-0">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wide text-n-accent m-0 truncate">
                {conversationLabel(state.homeActiveThreadKey!)}
              </p>
              <p className="text-[12px] font-medium text-n-text-2 m-0 truncate">Resume conversation</p>
            </div>
            <button
              type="button"
              onClick={clearHomeConversation}
              className="shrink-0 w-9 h-9 rounded-lg border border-n-border bg-n-inset text-n-text-2 cursor-pointer flex items-center justify-center hover:bg-n-surface-2 transition-colors"
              aria-label="Close conversation and start new chat"
              title="Close and start new chat"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 3l8 8M11 3L3 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
        {expanded && !hasThread && (
          <div className="px-4 sm:px-5 py-4 border-b border-n-border bg-n-accent-soft/40">
            <p className="text-[13px] font-semibold text-n-text m-0">Pick up where you left off</p>
            <p className="text-[12px] text-n-text-2 m-0 mt-1 leading-relaxed">
              Send a message below to continue this thread, or use the close button above to start fresh.
            </p>
          </div>
        )}
        {hasThread && (
          <div
            ref={containerRef}
            className="max-h-[min(52vh,440px)] overflow-y-auto px-4 sm:px-5 py-4 flex flex-col gap-4 bg-gradient-to-b from-n-inset to-white border-b border-n-border"
          >
            <div className="pb-1 border-b border-n-border/50">
              <p className="text-[13px] font-semibold text-n-text m-0">Pick up where you left off</p>
              <p className="text-[11px] text-n-text-muted m-0 mt-1">
                {headerMessages.length} message{headerMessages.length === 1 ? '' : 's'} · reply below to continue
              </p>
            </div>
            <ChatMessageList
              messages={headerMessages}
              gmailCompact={!gmailScoped}
              showGmail
            />
            {state.headerChatLoading && <ChatTypingIndicator />}
            <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
          </div>
        )}

        <div className="px-5.5 py-5 relative z-10 overflow-visible">
        <textarea
          value={state.headerDraft}
          onChange={(e) => onHeaderDraftChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendHeaderChat();
            }
          }}
          rows={expanded ? 2 : 1}
          placeholder={inputPlaceholder}
          className="w-full box-border border-none outline-none text-[16px] text-n-text font-inherit mb-4 resize-none leading-relaxed min-h-[28px] bg-transparent"
        />
        {slackScoped && <SlackScopePreview />}
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <HeaderAskDropdown align="left" />
          <button
            type="button"
            onClick={sendHeaderChat}
            disabled={!state.headerDraft.trim() || state.headerChatLoading}
            className="w-9 h-9 rounded-full text-white border-none cursor-pointer flex items-center justify-center text-sm font-semibold shadow-md hover:opacity-90 transition-opacity ml-auto"
            style={{
              background: theme.accent,
              opacity: state.headerDraft.trim() && !state.headerChatLoading ? 1 : 0.4,
            }}
            aria-label="Send message"
          >
            ↑
          </button>
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
      className="atlas-widget overflow-hidden cursor-pointer group"
      style={{
        transform: hover ? 'translateY(-4px)' : 'none',
        boxShadow: hover ? theme.shadowLg : undefined,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        animation: 'atlas-fadein 0.4s ease-out',
      }}
    >
      <div
        className="h-[140px] flex items-center justify-center p-4 box-border relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${def.accentBg} 0%, #fff 70%)` }}
      >
        <AgentIllustrationCard agentId={agentId} />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-n-text-muted">{def.name}</span>
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: theme.accent }}
          >
            →
          </span>
        </div>
        <p className="text-[16px] font-semibold m-0 mb-2 leading-snug text-n-text">{def.tagline}</p>
        <p className="text-[12px] text-n-text-2 leading-relaxed m-0 mb-4">{def.description}</p>
      </div>
      <div className="px-5 pb-5 flex flex-wrap gap-2">
        {def.tools.slice(1, 4).map((t) => (
          <span
            key={t.id}
            className="text-[10px] font-semibold px-3 py-1.5 rounded-full bg-n-bg text-n-text-2"
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
