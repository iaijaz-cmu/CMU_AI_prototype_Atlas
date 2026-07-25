import { AtlasProvider, useAtlas } from './lib/AtlasContext';
import { Picker } from './components/Picker';
import { WorkspaceShell } from './components/WorkspaceShell';

function AtlasApp() {
  const { state } = useAtlas();
  return (
    <div className="atlas-app-shell h-screen w-full font-sans overflow-hidden">
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
