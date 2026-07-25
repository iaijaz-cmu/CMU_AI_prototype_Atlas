import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import { AtlasMark } from './icons/AtlasMark';
import { ToolIcon } from './icons/ToolIcon';

export function Sidebar() {
  const { state, goPicker, goTool } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const otherAgentDots = AGENT_DEFS.filter((a) => a.id !== def.id).map((a) => a.accent + '80');

  return (
    <div className="w-[220px] shrink-0 bg-white border-r border-[#E4E2DC] flex flex-col">
      <div
        onClick={goPicker}
        className="flex items-center gap-2.5 p-4 border-b border-[#E4E2DC] cursor-pointer hover:opacity-70"
      >
        <AtlasMark size={28} />
        <div className="min-w-0">
          <p className="text-[13.5px] font-bold m-0 leading-tight">Atlas</p>
          <p className="text-[11px] mt-0.5 mb-0 font-semibold" style={{ color: def.accent }}>
            {def.name} Agent
          </p>
        </div>
      </div>

      <div className="flex-1 py-2.5 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {def.tools.map((tool) => {
          const active = tool.id === state.tool;
          const iconColor = active ? def.accent : '#A8A29E';
          return (
            <div
              key={tool.id}
              onClick={() => goTool(tool.id)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-[10px] cursor-pointer hover:bg-[#F5F4F0]"
              style={{ background: active ? def.accentBg : 'transparent' }}
            >
              <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
                <ToolIcon icon={tool.icon} color={iconColor} />
              </div>
              <span className="text-[13px] font-semibold" style={{ color: active ? def.accent : '#78716C' }}>
                {tool.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-[#E4E2DC]">
        <div
          onClick={goPicker}
          className="flex items-center gap-2 px-2.5 py-2 rounded-[10px] cursor-pointer text-[11.5px] text-[#78716C] hover:bg-[#F5F4F0]"
        >
          <div className="flex gap-0.5">
            {otherAgentDots.map((dot, i) => (
              <div key={i} className="w-[9px] h-[9px] rounded-[3px]" style={{ background: dot }} />
            ))}
          </div>
          Switch agent
        </div>
      </div>
    </div>
  );
}
