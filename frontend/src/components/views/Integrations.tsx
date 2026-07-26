import { useState } from 'react';
import { useAtlas } from '../../lib/AtlasContext';
import { theme } from '../../lib/theme';
import { SlackDemo } from './SlackDemo';

export function Integrations() {
  const { state, toggleIntegration, addCustomIntegration } = useAtlas();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  const onAdd = () => {
    const ok = addCustomIntegration(newName);
    if (!ok) {
      setAddError(newName.trim() ? 'That integration is already listed.' : 'Enter a name.');
      return;
    }
    setAddError(null);
    setNewName('');
    setAddOpen(false);
  };

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <div className="flex items-start justify-between gap-4 mb-5.5">
        <div className="min-w-0">
          <h1 className="text-xl font-bold m-0 mb-1">Integrations</h1>
          <p className="text-[13px] text-[#78716C] m-0">
            Connect the tools Atlas retrieves org knowledge from
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddOpen((o) => !o);
            setAddError(null);
          }}
          className="shrink-0 text-[12px] font-bold px-4 py-2 rounded-full cursor-pointer border-none text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: theme.accent }}
        >
          {addOpen ? 'Close' : '+ Add'}
        </button>
      </div>

      {addOpen && (
        <div className="mb-5 rounded-2xl border border-[#E4E2DC] bg-[#FAFAF8] p-4">
          <p className="text-[12px] font-bold text-n-text m-0 mb-2">Add integration</p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setAddError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onAdd();
              }}
              placeholder="App name (e.g. HubSpot, Linear)"
              className="border border-[#E4E2DC] rounded-lg px-3 py-2 text-[13px] flex-1 min-w-[200px] bg-white"
            />
            <button
              type="button"
              onClick={onAdd}
              className="text-[12px] font-bold px-4 py-2 rounded-lg text-white border-none cursor-pointer"
              style={{ background: theme.accent }}
            >
              Add integration
            </button>
          </div>
          {addError && <p className="text-[12px] text-[#B42318] m-0 mt-2">{addError}</p>}
        </div>
      )}

      <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        {state.integrations.map((app) => {
          const connected = app.status === 'connected';
          const isSlack = app.name === 'Slack';
          return (
            <div
              key={app.name}
              className={`bg-white border rounded-2xl p-4.5 ${isSlack ? 'border-[#4A154B]/30 ring-1 ring-[#4A154B]/10' : 'border-[#E4E2DC]'}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center font-extrabold text-sm shrink-0"
                  style={{ background: app.bg, color: app.color }}
                >
                  {app.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm m-0">{app.name}</p>
                  <p className="text-[11.5px] text-[#A8A29E] mt-0.5 mb-0 leading-snug">{app.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                {connected ? (
                  <span className="text-[11px] text-[#1A9E6E] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A9E6E] inline-block" />
                    {isSlack ? 'Demo ready — scroll down' : `Synced ${app.lastSync}`}
                  </span>
                ) : (
                  <span className="text-[11px] text-[#A8A29E]">Not connected</span>
                )}
                <button
                  type="button"
                  onClick={() => toggleIntegration(app.name)}
                  className="text-[11.5px] font-bold px-3.5 py-1.5 rounded-[9px] cursor-pointer border border-[#E4E2DC] bg-white text-[#3f3d38]"
                >
                  {connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <SlackDemo />
    </div>
  );
}
