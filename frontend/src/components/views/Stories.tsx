import { JIRA_STORIES } from '../../lib/data';
import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS } from '../../lib/data';

export function Stories() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const summary = `${JIRA_STORIES.length} stories · ${JIRA_STORIES.reduce((acc, s) => acc + s.points, 0)} total points`;

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Jira Story Breakdown</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Auto-generated from PRD — Unified Notification Controls</p>
      <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
        <div className="px-4.5 py-3.5 border-b border-[#F0EEE8] flex items-center justify-between">
          <p className="text-[13px] font-semibold m-0">{summary}</p>
          <div className="text-[11.5px] text-[#78716C] px-3 py-1.5 border border-[#E4E2DC] rounded-[9px]">↗ Push to Jira</div>
        </div>
        {JIRA_STORIES.map((s) => {
          const isBackend = s.type === 'Backend';
          const typeBg = isBackend ? def.accentBg : '#FFF4EA';
          const typeColor = isBackend ? def.accent : '#D4640A';
          return (
            <div key={s.id} className="flex items-center gap-3.5 px-4.5 py-3 border-b border-[#FAFAF8]">
              <span className="font-mono text-[11px] text-[#A8A29E] w-[68px] shrink-0">{s.id}</span>
              <div className="flex-1 text-[13px] text-[#3f3d38] min-w-0">{s.title}</div>
              <span
                className="text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: typeBg, color: typeColor }}
              >
                {s.type}
              </span>
              <span className="font-mono text-[11px] text-[#A8A29E] w-[30px] text-right shrink-0">{s.points}pt</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
