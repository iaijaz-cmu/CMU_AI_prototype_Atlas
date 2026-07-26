import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { InlineAgentChat } from './InlineAgentChat';
import { FloatingChat } from './FloatingChat';
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
      {!state.inlineChatOpen && <FloatingChat />}
    </div>
  );
}
