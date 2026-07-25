import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS, AGENT_CHAT_EXAMPLES } from '../lib/data';
import { HeaderAskDropdown } from './HeaderAskDropdown';
import { ChatMessageList } from './ChatMessageList';
import { ChatTypingIndicator } from './ChatTypingIndicator';
import { useChatScroll } from './useChatScroll';
import { AtlasMark } from './icons/AtlasMark';

interface Props {
  onClose: () => void;
}

export function InlineAgentChat({ onClose }: Props) {
  const {
    state,
    onHeaderDraftChange,
    sendHeaderChat,
    activeHeaderMessages,
  } = useAtlas();

  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const examples = AGENT_CHAT_EXAMPLES[def.id];
  const messages = activeHeaderMessages();
  const slackScoped = state.headerScopeApp === 'Slack';
  const gmailScoped = state.headerScopeApp === 'Gmail';
  const placeholder = gmailScoped
    ? 'Message Atlas — use Open in Gmail on replies when ready…'
    : slackScoped
      ? 'Follow up on your Slack thread…'
      : examples.placeholder;

  const { bottomRef, containerRef } = useChatScroll([
    messages.length,
    state.headerChatLoading,
    messages[messages.length - 1]?.text,
  ]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-n-bg">
      <header className="shrink-0 flex items-center gap-3 px-5 py-3 bg-white border-b border-n-border">
        <AtlasMark size={24} variant="ai" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold m-0 leading-tight text-n-text">Atlas Chat</p>
          <p className="text-[11px] m-0 text-n-text-2 truncate">{def.name} Agent workspace</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 w-9 h-9 rounded-lg border border-n-border bg-n-inset text-n-text-2 cursor-pointer text-lg leading-none hover:bg-n-surface-2"
          aria-label="Close chat"
          title="Close chat"
        >
          ×
        </button>
      </header>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        <div className="max-w-[720px] mx-auto flex flex-col gap-4 w-full">
          {messages.length === 0 && !state.headerChatLoading && (
            <div className="text-center py-12 px-4">
              <p className="text-[15px] font-semibold text-n-text m-0 mb-2">{def.name} Agent</p>
              <p className="text-[13px] text-n-text-muted m-0 max-w-md mx-auto leading-relaxed mb-3">
                Specialized for{' '}
                {def.id === 'product'
                  ? 'PRDs, roadmap alignment, and requirements'
                  : def.id === 'engineering'
                    ? 'ADRs, tech specs, and engineering breakdowns'
                    : def.id === 'market'
                      ? 'competitor analysis and marketing strategy'
                      : 'executive pitches and competitive win stories'}
                . Answers are grounded in your org knowledge base with citations.
              </p>
              <p className="text-[12px] text-n-text-2 m-0 max-w-md mx-auto italic">{examples.hint}</p>
            </div>
          )}
          <ChatMessageList
            messages={messages}
            citationAccent={def.accent}
            gmailCompact={!gmailScoped}
            showGmail
          />
          {state.headerChatLoading && <ChatTypingIndicator />}
          <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
        </div>
      </div>

      <footer className="shrink-0 border-t border-n-border bg-white px-4 py-4">
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <HeaderAskDropdown align="left" />
          </div>
          <div className="flex items-end gap-2 rounded-xl border border-n-border bg-n-inset px-3 py-2 shadow-sm focus-within:border-n-border-strong">
            <textarea
              value={state.headerDraft}
              onChange={(e) => onHeaderDraftChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendHeaderChat();
                }
              }}
              rows={1}
              placeholder={placeholder}
              disabled={state.headerChatLoading}
              className="flex-1 min-h-[44px] max-h-[160px] resize-none border-none bg-transparent outline-none text-[15px] text-n-text py-2.5 leading-relaxed font-inherit"
            />
            <button
              type="button"
              onClick={sendHeaderChat}
              disabled={!state.headerDraft.trim() || state.headerChatLoading}
              className="shrink-0 w-9 h-9 rounded-xl border-none cursor-pointer flex items-center justify-center text-white mb-0.5"
              style={{
                background: def.accent,
                opacity: state.headerDraft.trim() && !state.headerChatLoading ? 1 : 0.45,
              }}
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
          <p className="text-[10px] text-n-text-muted text-center m-0 mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </footer>
    </div>
  );
}
