import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import { AtlasMark } from './icons/AtlasMark';
import { AtlasMarkdown } from './AtlasMarkdown';
import { CitationChip } from './CitationChip';

export function FloatingChat() {
  const { state, toggleChat, onChatDraftChange, sendChat, setChatTag, openAgentFromChat } = useAtlas();

  return (
    <>
      <div
        onClick={toggleChat}
        className="fixed bottom-[26px] right-[26px] w-[52px] h-[52px] rounded-full bg-[#18181B] text-white flex items-center justify-center cursor-pointer shadow-[0_6px_20px_rgba(0,0,0,0.25)] z-40"
      >
        <svg width="21" height="21" viewBox="0 0 16 16" fill="none">
          <path d="M2 3.5h12v7.5H6.5L3 14v-3H2V3.5z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
          <circle cx="5.5" cy="7.2" r="0.8" fill="#fff" />
          <circle cx="8" cy="7.2" r="0.8" fill="#fff" />
          <circle cx="10.5" cy="7.2" r="0.8" fill="#fff" />
        </svg>
      </div>

      {state.chatOpen && (
        <div className="fixed bottom-[90px] right-[26px] w-[340px] max-h-[480px] bg-white border border-[#E4E2DC] rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden z-41">
          <div className="px-4 py-3.5 border-b border-[#F0EEE8] flex items-center gap-2">
            <AtlasMark size={20} />
            <span className="font-bold text-[13.5px]">Atlas Assistant</span>
            <div className="flex-1" />
            <div onClick={toggleChat} className="cursor-pointer text-[#A8A29E] text-base px-1 py-0.5">
              ×
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-2.5 min-h-[180px] max-h-[280px]">
            {state.chatMessages.map((m, i) => {
              const def = m.tag ? AGENT_DEFS.find((a) => a.id === m.tag) : null;
              if (m.role === 'user') {
                return (
                  <div
                    key={i}
                    className="self-end max-w-[82%] bg-[#18181B] text-white rounded-[12px_12px_3px_12px] px-3 py-2.5 text-[12.5px] leading-normal"
                  >
                    {m.text}
                  </div>
                );
              }
              return (
                <div key={i}>
                  <div className="bg-[#F5F4F0] rounded-[12px_12px_12px_3px] px-3 py-2.5 text-[12.5px] leading-normal text-[#3f3d38] max-w-[88%]">
                    <AtlasMarkdown>{m.text}</AtlasMarkdown>
                  </div>
                  {m.citations && m.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {m.citations.map((c) => (
                        <CitationChip key={c.id} citation={c} accent={def?.accent ?? '#18181B'} />
                      ))}
                    </div>
                  )}
                  {def && (
                    <div
                      onClick={() => openAgentFromChat(def.id)}
                      className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer"
                      style={{ background: def.accentBg, color: def.accent }}
                    >
                      Open {def.name} Agent →
                    </div>
                  )}
                </div>
              );
            })}
            {state.chatLoading && (
              <div className="bg-[#F5F4F0] rounded-[12px_12px_12px_3px] px-3 py-2.5 text-[12.5px] text-[#A8A29E] self-start">
                Thinking…
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-[#F0EEE8]">
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {AGENT_DEFS.map((a) => {
                const active = state.chatTag === a.id;
                return (
                  <div
                    key={a.id}
                    onClick={() => setChatTag(a.id)}
                    className="text-[10.5px] font-bold px-2.5 py-1 rounded-full cursor-pointer"
                    style={{ background: active ? a.accent : a.accentBg, color: active ? '#fff' : a.accent }}
                  >
                    {a.name}
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 items-center">
              <input
                value={state.chatDraft}
                onChange={(e) => onChatDraftChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Ask Atlas…"
                disabled={state.chatLoading}
                className="flex-1 box-border border border-[#E4E2DC] rounded-[10px] px-2.5 py-2 text-[12.5px] outline-none text-[#18181B]"
              />
              <button
                onClick={sendChat}
                disabled={!state.chatDraft.trim() || state.chatLoading}
                className="bg-[#18181B] text-white border-none rounded-[10px] px-3.5 py-2 text-xs font-bold cursor-pointer"
                style={{ opacity: state.chatDraft.trim() && !state.chatLoading ? 1 : 0.5 }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
