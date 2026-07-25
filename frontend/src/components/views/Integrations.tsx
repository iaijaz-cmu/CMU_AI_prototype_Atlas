import { useAtlas } from '../../lib/AtlasContext';
import { SlackDemo } from './SlackDemo';

export function Integrations() {
  const { state, toggleIntegration } = useAtlas();

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Integrations</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Connect the tools Atlas retrieves org knowledge from</p>
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
