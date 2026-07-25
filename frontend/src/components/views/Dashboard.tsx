import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, AGENT_ACTIVITY, AGENT_STATS, KNOWLEDGE_SOURCES } from '../../lib/data';
import { AgentIllustrationSmall } from '../icons/AgentIllustration';

export function Dashboard() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const stats = AGENT_STATS[def.id];
  const activity = AGENT_ACTIVITY[def.id];

  return (
    <div className="p-7 max-w-[1020px] mx-auto">
      <div className="flex items-start justify-between mb-6.5">
        <div>
          <h1 className="text-[23px] font-bold m-0 leading-tight">
            {def.name} Agent{' '}
            <span className="font-serif font-normal" style={{ color: def.accent }}>
              workspace
            </span>
          </h1>
          <p className="text-[13.5px] text-[#78716C] mt-1 mb-0">{def.description}</p>
        </div>
        <div className="w-[88px] h-[60px] shrink-0 opacity-90">
          <AgentIllustrationSmall agentId={def.id} accent={def.accent} />
        </div>
      </div>

      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}>
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#E4E2DC] rounded-2xl p-4">
            <p className="text-[11.5px] text-[#A8A29E] m-0 mb-2 font-semibold">{s.label}</p>
            <p className="text-2xl font-extrabold m-0 leading-none">{s.value}</p>
            <p className="text-[11px] text-[#A8A29E] mt-1.5 mb-0">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide m-0 mb-3.5">Recent Activity</p>
          <div className="flex flex-col gap-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-6.5 h-6.5 rounded-lg flex items-center justify-center shrink-0 mt-px"
                  style={{ background: def.accentBg }}
                >
                  <div className="w-[7px] h-[7px] rounded-full" style={{ background: def.accent }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13.5px] text-[#3f3d38] m-0 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-[#A8A29E] mt-0.5 mb-0">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide m-0 mb-3.5">Knowledge Sources</p>
          <div className="flex flex-col gap-2.5">
            {KNOWLEDGE_SOURCES.map((src) => (
              <div key={src.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] rounded-full" style={{ background: src.color }} />
                  <span className="text-[13px] text-[#57534E]">{src.label}</span>
                </div>
                <span className="text-[11.5px] text-[#A8A29E] font-mono">{src.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-3.5 pt-3.5 border-t border-[#F0EEE8] flex flex-col gap-2.5">
            <div>
              <div className="flex justify-between text-[11px] text-[#78716C] mb-0.5">
                <span>Retrieval quality</span>
                <span className="font-mono">95%</span>
              </div>
              <div className="h-[5px] rounded-full bg-[#F0EEE8] overflow-hidden">
                <div className="h-full" style={{ width: '95%', background: def.accent }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-[#78716C] mb-0.5">
                <span>Citation precision</span>
                <span className="font-mono">100%</span>
              </div>
              <div className="h-[5px] rounded-full bg-[#F0EEE8] overflow-hidden">
                <div className="h-full" style={{ width: '100%', background: def.accent }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
