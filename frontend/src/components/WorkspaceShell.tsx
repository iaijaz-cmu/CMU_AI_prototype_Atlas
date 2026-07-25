import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToolRouter } from './views';

export function WorkspaceShell() {
  return (
    <div className="flex h-full relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto pr-14 box-border">
          <ToolRouter />
        </div>
      </div>
      <div className="fixed bottom-[22px] right-[22px] w-9 h-9 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[13px] font-bold cursor-pointer shadow-[0_4px_14px_rgba(0,0,0,0.2)] z-5 opacity-85 hover:opacity-100">
        ?
      </div>
    </div>
  );
}
