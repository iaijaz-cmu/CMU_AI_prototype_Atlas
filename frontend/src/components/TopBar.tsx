import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import { AppBubble } from './AppBubble';
import { AtlasMarkdown } from './AtlasMarkdown';
import { CitationChip } from './CitationChip';

export function TopBar() {
  const {
    state,
    toggleHeaderBar,
    toggleHeaderAppMenu,
    setHeaderScope,
    onHeaderDraftChange,
    sendHeaderChat,
  } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const connected = state.integrations.filter((i) => i.status === 'connected');
  const headerScopeLabel = state.headerScopeApp ? '@' + state.headerScopeApp : 'All apps';

  return (
    <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-[#E4E2DC] shrink-0">
      <div className="max-w-[420px] w-full relative">
        <div
          onClick={toggleHeaderBar}
          className="flex items-center gap-2 w-full box-border px-3 py-1.5 text-xs bg-[#FAFAF8] border border-[#E4E2DC] rounded-lg text-[#A8A29E] cursor-text"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="5.2" stroke="#A8A29E" strokeWidth="1.3" />
            <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="#A8A29E" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span>Ask Atlas or search {def.name} Agent…</span>
        </div>

        {state.headerBarOpen && (
          <div className="absolute top-[38px] left-0 w-[460px] bg-white border border-[#E4E2DC] rounded-[14px] shadow-[0_16px_40px_rgba(0,0,0,0.14)] z-50 overflow-hidden">
            {(state.headerMessages.length > 0 || state.headerChatLoading) && (
              <div className="max-h-[220px] overflow-y-auto px-3.5 py-3 flex flex-col gap-2 border-b border-[#F0EEE8]">
                {state.headerMessages.map((m, i) =>
                  m.role === 'user' ? (
                    <div
                      key={i}
                      className="self-end max-w-[85%] bg-[#18181B] text-white rounded-[11px_11px_3px_11px] px-2.5 py-2 text-xs leading-normal"
                    >
                      {m.text}
                    </div>
                  ) : (
                    <div key={i} className="max-w-[88%]">
                      <div className="bg-[#F5F4F0] rounded-[11px_11px_11px_3px] px-2.5 py-2 text-xs leading-normal text-[#3f3d38]">
                        <AtlasMarkdown>{m.text}</AtlasMarkdown>
                      </div>
                      {m.citations && m.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {m.citations.map((c) => (
                            <CitationChip key={c.id} citation={c} accent={def.accent} />
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
                {state.headerChatLoading && (
                  <div className="bg-[#F5F4F0] rounded-[11px_11px_11px_3px] px-2.5 py-2 text-xs text-[#A8A29E] self-start">
                    Thinking…
                  </div>
                )}
              </div>
            )}

            <div className="px-3.5 py-3">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="relative">
                  <div
                    onClick={toggleHeaderAppMenu}
                    className="flex items-center gap-1.5 text-[11.5px] font-bold px-2.5 py-1.5 rounded-full cursor-pointer bg-[#F5F4F0] text-[#57534E]"
                  >
                    <span>{headerScopeLabel}</span>
                    <span className="text-[9px]">▾</span>
                  </div>
                  {state.headerAppMenuOpen && (
                    <div className="absolute top-7 left-0 w-[200px] bg-white border border-[#E4E2DC] rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.14)] p-1.5 z-51">
                      <div
                        onClick={toggleHeaderAppMenu}
                        className="px-2.5 py-1.5 rounded-lg text-xs text-[#57534E] cursor-pointer hover:bg-[#F5F4F0]"
                      >
                        All connected apps
                      </div>
                      {connected.map((app) => (
                        <div
                          key={app.name}
                          onClick={() => setHeaderScope(app.name)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[#F5F4F0]"
                        >
                          <AppBubble initial={app.name[0]} color={app.color} bg={app.bg} size={18} radius={5} fontSize={9} />
                          <span className="text-xs text-[#3f3d38]">{app.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-[#A8A29E]">scope your question to one integrated app</span>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  value={state.headerDraft}
                  onChange={(e) => onHeaderDraftChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendHeaderChat()}
                  placeholder="Ask a question or search…"
                  disabled={state.headerChatLoading}
                  className="flex-1 box-border border border-[#E4E2DC] rounded-[10px] px-3 py-2.5 text-[12.5px] outline-none text-[#18181B]"
                />
                <button
                  onClick={sendHeaderChat}
                  disabled={!state.headerDraft.trim() || state.headerChatLoading}
                  className="bg-[#18181B] text-white border-none rounded-[10px] px-3.5 py-2.5 text-xs font-bold cursor-pointer"
                  style={{ opacity: state.headerDraft.trim() && !state.headerChatLoading ? 1 : 0.5 }}
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-[11.5px] font-semibold px-3 py-1.5 rounded-full"
          style={{ background: def.accentBg, color: def.accent }}
        >
          {def.name} · 100% eval
        </span>
        <div className="relative w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#F5F4F0]">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6.5C4 4 5.8 2.5 8 2.5C10.2 2.5 12 4 12 6.5C12 10 13 11 13 11H3C3 11 4 10 4 6.5Z"
              stroke="#78716C"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
            <path d="M6.5 13C6.8 13.6 7.3 14 8 14C8.7 14 9.2 13.6 9.5 13" stroke="#78716C" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: def.accent, border: '1.5px solid #fff' }}
          />
        </div>
        <div
          className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
          style={{ background: def.accent }}
        >
          IA
        </div>
      </div>
    </div>
  );
}
