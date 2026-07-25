import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, DEAL_BRIEF_SECTIONS } from '../../lib/data';

export function DealBrief() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Deal Brief</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Acme Corp — Enterprise Renewal · $240K · Closes Sept 2026</p>
      <div className="flex flex-col gap-3">
        {DEAL_BRIEF_SECTIONS.map((sec) => (
          <div key={sec.label} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
            <p className="text-[11px] font-bold uppercase tracking-wide m-0 mb-2" style={{ color: def.accent }}>
              {sec.label}
            </p>
            <p className="text-[13.5px] text-[#3f3d38] leading-[1.65] m-0">{sec.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
