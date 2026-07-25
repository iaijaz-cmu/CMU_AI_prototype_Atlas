import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import { listRecentConversations } from '../lib/headerChat';
import type { HeaderThreadKey } from '../lib/types';
import { theme } from '../lib/theme';

function threadAccent(key: HeaderThreadKey): string {
  if (key === 'home') return theme.accent;
  return AGENT_DEFS.find((a) => a.id === key)?.accent ?? theme.accent;
}

export function HomeRecentConversationsWidget() {
  const { state, selectHomeConversation } = useAtlas();
  const recent = listRecentConversations(state.headerThreads, 5);
  const activeKey = state.homeActiveThreadKey;

  if (recent.length === 0) {
    return (
      <section className="atlas-widget mb-10 px-5 py-5">
        <h2 className="text-[15px] font-semibold text-n-text m-0 tracking-tight">Recent conversations</h2>
        <p className="text-[13px] text-n-text-muted m-0 mt-2 leading-relaxed">
          Chats from the homepage and agent workspaces appear here so you can pick up where you left off.
        </p>
      </section>
    );
  }

  return (
    <section className="atlas-widget mb-10 overflow-hidden">
      <div className="px-5 pt-5 pb-3 border-b border-n-border/60">
        <h2 className="text-[15px] font-semibold text-n-text m-0 tracking-tight">Recent conversations</h2>
        <p className="text-[11px] text-n-text-muted m-0 mt-1">Last {recent.length} saved in this browser · tap to continue</p>
      </div>
      <ul className="list-none m-0 p-3 flex flex-col gap-2">
        {recent.map((c) => {
          const selected = activeKey === c.key;
          const accent = threadAccent(c.key);
          return (
            <li key={c.key}>
              <button
                type="button"
                onClick={() => selectHomeConversation(c.key)}
                className={`w-full text-left rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                  selected
                    ? 'border-n-accent/40 bg-n-accent-soft'
                    : 'border-n-border/70 bg-white hover:bg-n-surface-2'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: accent }}
                  >
                    {c.label}
                  </span>
                  <span className="text-[10px] text-n-text-muted tabular-nums shrink-0">
                    {c.messageCount} msg{c.messageCount === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-[13px] text-n-text m-0 leading-snug line-clamp-2">{c.preview}</p>
                {selected && (
                  <p className="text-[11px] font-semibold m-0 mt-2" style={{ color: accent }}>
                    Open in ask bar above — continue below
                  </p>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
