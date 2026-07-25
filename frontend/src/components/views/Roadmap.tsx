import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, PRIORITY_COLORS, ROADMAP_ITEMS } from '../../lib/data';

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026'];

export function Roadmap() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  return (
    <div className="p-7 max-w-[1020px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Roadmap Planner</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">
        AI-generated roadmap grounded in customer feedback, Jira velocity, and strategic themes
      </p>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
        {QUARTERS.map((q) => (
          <div key={q}>
            <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide m-0 mb-2.5">{q}</p>
            <div className="flex flex-col gap-2.5">
              {ROADMAP_ITEMS.filter((r) => r.quarter === q).map((item) => {
                const prio = PRIORITY_COLORS[item.priority];
                return (
                  <div key={item.id} className="bg-white border border-[#E4E2DC] rounded-2xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: prio.bg, color: prio.color }}
                      >
                        {item.priority}
                      </span>
                      <span className="text-[10.5px] text-[#A8A29E] font-mono">{item.id}</span>
                    </div>
                    <p className="text-[13.5px] font-bold m-0 mb-2">{item.theme}</p>
                    {item.features.map((f) => (
                      <div key={f} className="text-[11.5px] text-[#78716C] flex items-center gap-1.5 mb-0.5">
                        <span className="text-[#D6D3CB]">›</span>
                        {f}
                      </div>
                    ))}
                    <p className="text-[11.5px] mt-2 mb-0 font-semibold" style={{ color: def.accent }}>
                      {item.status}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
