import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import { AtlasMark } from './icons/AtlasMark';
import { ChatMessageList, type ThreadMessage } from './ChatMessageList';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { useChatScroll } from './useChatScroll';
import { theme } from '../lib/theme';

export function FloatingChat() {
  const { state, toggleChat, onChatDraftChange, sendChat, setChatTag, openAgentFromChat } = useAtlas();

  const thread: ThreadMessage[] = state.chatMessages.map((m) => ({
    role: m.role,
    text: m.text,
    title: m.title,
    citations: m.citations,
    uncertaintyFlags: m.uncertaintyFlags,
    agentTag: m.tag,
  }));

  const { bottomRef, containerRef } = useChatScroll([
    state.chatMessages.length,
    state.chatLoading,
    state.chatMessages[state.chatMessages.length - 1]?.text,
    state.chatOpen,
  ]);

  return (
    <>
      <div
        onClick={toggleChat}
        className="fixed bottom-[26px] right-[26px] w-[52px] h-[52px] rounded-full bg-white border border-n-border flex items-center justify-center cursor-pointer shadow-lg z-40 hover:shadow-xl hover:border-n-accent/30 transition-all"
      >
        <AtlasMark size={28} variant="ai" />
      </div>

      {state.chatOpen && (
        <div className="fixed bottom-[90px] right-[26px] w-[380px] max-h-[min(560px,78vh)] atlas-card-elevated flex flex-col overflow-hidden z-41">
          <div className="px-4 py-3 border-b border-n-border flex items-center gap-2 bg-n-inset">
            <AtlasMark size={22} variant="ai" />
            <div>
              <span className="font-bold text-[13.5px] block leading-tight">Atlas Assistant</span>
            </div>
            <div className="flex-1" />
            <button
              type="button"
              onClick={toggleChat}
              className="cursor-pointer text-n-text-muted text-lg px-1 py-0.5 border-none bg-transparent"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-3 min-h-[200px] max-h-[340px] bg-gradient-to-b from-n-inset to-white"
          >
            <ChatMessageList
              messages={thread}
              compact
              citationAccent={AGENT_DEFS[0].accent}
              showGmail={(m, i) => i > 0 && m.role === 'assistant' && !m.text.startsWith('⚠️')}
              onOpenAgent={openAgentFromChat}
            />
            {state.chatLoading && <ChatTypingIndicator compact />}
            <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
          </div>

          <div className="px-4 py-3 border-t border-n-border bg-white">
            <div className="flex gap-1.5 mb-2 flex-wrap">
              {AGENT_DEFS.map((a) => {
                const active = state.chatTag === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setChatTag(a.id)}
                    className="text-[10.5px] font-bold px-2.5 py-1 rounded-full cursor-pointer border-none"
                    style={{ background: active ? a.accent : a.accentBg, color: active ? '#fff' : a.accent }}
                  >
                    {a.name}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 items-end">
              <textarea
                value={state.chatDraft}
                onChange={(e) => onChatDraftChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChat();
                  }
                }}
                rows={2}
                placeholder="Message Atlas… (Enter to send)"
                disabled={state.chatLoading}
                className="flex-1 box-border border border-n-border rounded-xl px-3 py-2 text-[12.5px] outline-none text-n-text resize-none leading-relaxed focus:border-n-border-strong bg-n-inset"
              />
              <button
                type="button"
                onClick={sendChat}
                disabled={!state.chatDraft.trim() || state.chatLoading}
                className="text-white border-none rounded-lg px-3.5 py-2.5 text-xs font-semibold cursor-pointer shrink-0"
                style={{
                  background: theme.navy,
                  opacity: state.chatDraft.trim() && !state.chatLoading ? 1 : 0.45,
                }}
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
