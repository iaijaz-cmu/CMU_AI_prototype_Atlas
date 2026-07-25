import { AtlasProvider, useAtlas } from './lib/AtlasContext';
import { Picker } from './components/Picker';
import { WorkspaceShell } from './components/WorkspaceShell';

function AtlasApp() {
  const { state } = useAtlas();
  return (
    <div className="h-screen w-full bg-[#F5F4F0] text-[#18181B] font-sans overflow-hidden">
      {state.currentAgentId ? <WorkspaceShell /> : <Picker />}
    </div>
  );
}

export default function App() {
  return (
    <AtlasProvider>
      <AtlasApp />
    </AtlasProvider>
  );
}
