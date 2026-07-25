import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, COMPETITIVE_ROWS } from '../../lib/data';
import { CompetitorPulseWidget } from '../CompetitorPulseWidget';

export function Competitive() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[1020px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Competitor Intelligence</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Live news pulse + static battlecard context</p>

      <CompetitorPulseWidget accent={def.accent} accentBg={def.accentBg} />

      <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide mb-2 mt-2">Battlecard matrix</p>
      <div className="flex flex-col gap-3">
        {COMPETITIVE_ROWS.map((row) => (
          <div
            key={row.name}
            className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 grid gap-4"
            style={{ gridTemplateColumns: '1fr 1.4fr 1.4fr 1.4fr' }}
          >
            <div>
              <p className="text-[11px] text-[#A8A29E] m-0 mb-1">Competitor</p>
              <p className="font-bold m-0">{row.name}</p>
              <p className="font-mono text-[11px] text-[#A8A29E] mt-0.5 mb-0">{row.price}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A8A29E] m-0 mb-1">Strength</p>
              <p className="text-[13px] text-[#3f3d38] m-0">{row.strength}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A8A29E] m-0 mb-1">Weakness</p>
              <p className="text-[13px] text-[#dc2626] m-0">{row.weakness}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A8A29E] m-0 mb-1">Atlas Edge</p>
              <p className="text-[13px] font-semibold m-0" style={{ color: def.accent }}>
                {row.edge}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
