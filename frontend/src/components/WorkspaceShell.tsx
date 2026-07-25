import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { InlineAgentChat } from './InlineAgentChat';
import { ToolRouter } from './views';
import { useAtlas } from '../lib/AtlasContext';

export function WorkspaceShell() {
  const { state, closeInlineChat } = useAtlas();

  return (
    <div className="flex h-full relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 min-h-0 flex flex-col relative">
          {state.inlineChatOpen ? (
            <InlineAgentChat onClose={closeInlineChat} />
          ) : (
            <div className="flex-1 overflow-y-auto pr-14 box-border min-h-0">
              <ToolRouter />
            </div>
          )}
        </div>
      </div>
      {!state.inlineChatOpen && (
        <div
          className="fixed bottom-[22px] right-[22px] w-9 h-9 rounded-lg bg-white border border-n-border text-n-text-2 flex items-center justify-center text-[13px] font-semibold cursor-pointer shadow-sm z-5 hover:bg-n-surface-2"
          title="Help"
        >
          ?
        </div>
      )}
    </div>
  );
}
