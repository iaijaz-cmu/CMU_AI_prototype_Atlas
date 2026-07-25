import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, TAM_SEGMENTS, UNIT_ECONOMICS } from '../../lib/data';

export function TAM() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Market Sizing</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">TAM/SAM/SOM model — grounded in industry reports and competitive pricing data</p>
      <div className="grid grid-cols-3 gap-3.5 mb-4.5">
        {TAM_SEGMENTS.map((s) => (
          <div key={s.label} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
            <p className="text-[11px] text-[#A8A29E] m-0 mb-2">{s.label}</p>
            <p className="text-[26px] font-extrabold m-0 mb-1.5">{s.value}</p>
            <p className="text-[11.5px] text-[#78716C] m-0">{s.note}</p>
            <p className="text-[11.5px] font-bold mt-2 mb-0" style={{ color: def.accent }}>
              {s.growth}
            </p>
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#E4E2DC] rounded-2xl p-5">
        <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide m-0 mb-3.5">Unit Economics</p>
        <div className="grid grid-cols-4 gap-3">
          {UNIT_ECONOMICS.map((u) => (
            <div key={u.label} className="text-center p-3 rounded-xl" style={{ background: def.accentBg }}>
              <p className="text-[11px] text-[#78716C] m-0 mb-1">{u.label}</p>
              <p className="font-bold m-0" style={{ color: def.accent }}>
                {u.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
