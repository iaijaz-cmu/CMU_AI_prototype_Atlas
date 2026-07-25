import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, IMPACT_COLORS, SIGNALS } from '../../lib/data';

export function Signals() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Signals Feed</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Market intelligence from public sources — refreshed weekly</p>
      <div className="flex flex-col gap-3">
        {SIGNALS.map((s, i) => {
          const impact = IMPACT_COLORS[s.impact];
          return (
            <div key={i} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  <span
                    className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: def.accentBg, color: def.accent }}
                  >
                    {s.type}
                  </span>
                  <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: impact.bg, color: impact.color }}>
                    {s.impact}
                  </span>
                </div>
                <span className="text-[11px] text-[#A8A29E]">{s.time}</span>
              </div>
              <p className="text-[13.5px] font-semibold m-0 mb-1 leading-snug">{s.headline}</p>
              <p className="text-[11.5px] text-[#A8A29E] m-0">{s.source}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
