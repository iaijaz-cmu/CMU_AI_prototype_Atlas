import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, ICP_ACCOUNTS, ICP_STATUS_COLORS } from '../../lib/data';

export function ICP() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">ICP Analysis</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Ideal Customer Profile scoring — grounded in CRM + customer feedback patterns</p>
      <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
        {ICP_ACCOUNTS.map((a) => {
          const status = ICP_STATUS_COLORS[a.status];
          return (
            <div key={a.name} className="flex items-center gap-4 px-4.5 py-4 border-b border-[#FAFAF8]">
              <div
                className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center font-extrabold text-sm shrink-0"
                style={{ background: def.accentBg, color: def.accent }}
              >
                {a.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold m-0 text-sm">{a.name}</p>
                <p className="text-[11px] text-[#A8A29E] mt-0.5 mb-0">
                  {a.segment} · {a.size}
                </p>
                <p className="text-[11.5px] text-[#78716C] mt-0.5 mb-0">Pain: {a.pain}</p>
              </div>
              <div className="w-[110px] h-[5px] rounded-full bg-[#F0EEE8] overflow-hidden shrink-0">
                <div className="h-full" style={{ width: `${a.score}%`, background: def.accent }} />
              </div>
              <span className="font-extrabold text-base w-7 text-right shrink-0" style={{ color: def.accent }}>
                {a.score}
              </span>
              <span
                className="text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: status.bg, color: status.color }}
              >
                {a.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
