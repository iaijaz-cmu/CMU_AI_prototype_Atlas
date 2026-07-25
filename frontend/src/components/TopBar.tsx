import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';

export function TopBar() {
  const { state, openInlineChat, closeInlineChat } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-n-border shrink-0 z-20">
      <div className="max-w-[480px] w-full">
        {state.inlineChatOpen ? (
          <button
            type="button"
            onClick={closeInlineChat}
            className="flex items-center gap-2 text-[13px] font-medium text-n-text-2 px-3 py-1.5 rounded-lg border border-n-border bg-n-inset cursor-pointer hover:bg-n-surface-2"
          >
            ← Back to {def.tools.find((t) => t.id === state.tool)?.label ?? 'workspace'}
          </button>
        ) : (
          <button
            type="button"
            onClick={openInlineChat}
            className="atlas-search-bar flex items-center gap-2 w-full box-border px-3 py-2 text-[13px] text-n-text-muted cursor-text text-left"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" strokeLinecap="round">
              <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.4" />
              <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="truncate">Ask {def.name} Agent…</span>
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!state.inlineChatOpen && (
          <button
            type="button"
            onClick={openInlineChat}
            className="text-[11.5px] font-semibold px-4 py-2 rounded-full cursor-pointer border border-n-border bg-white text-n-text hover:bg-n-surface-2 transition-colors"
          >
            Chat
          </button>
        )}
        <span
          className="text-[11.5px] font-medium px-3 py-1.5 rounded-lg hidden sm:inline border border-n-border"
          style={{ background: def.accentBg, color: def.accent }}
        >
          {def.name} · 100% eval
        </span>
        <div
          className="w-7 h-7 rounded-md text-white text-[11px] font-semibold flex items-center justify-center border border-n-border"
          style={{ background: def.accent }}
        >
          IA
        </div>
      </div>
    </div>
  );
}
