import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import { theme } from '../lib/theme';
import { AtlasMark } from './icons/AtlasMark';
import { ToolIcon } from './icons/ToolIcon';

export function Sidebar() {
  const { state, goPicker, goTool } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const otherAgentDots = AGENT_DEFS.filter((a) => a.id !== def.id).map((a) => a.accent);

  return (
    <div className="w-[220px] shrink-0 atlas-nav-rail flex flex-col relative z-10">
      <button
        type="button"
        onClick={goPicker}
        className="flex items-center gap-2.5 p-4 border-b border-n-border/60 cursor-pointer hover:bg-n-surface-2 w-full text-left border-none bg-white/40"
      >
        <AtlasMark size={28} variant="ai" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold m-0 leading-tight text-n-text">Atlas</p>
          <p className="text-[11px] mt-0.5 mb-0 font-medium" style={{ color: def.accent }}>
            {def.name}
          </p>
        </div>
      </button>

      <div className="flex-1 py-2 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {def.tools.map((tool) => {
          const active = tool.id === state.tool;
          const iconColor = active ? def.accent : theme.textMuted;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => goTool(tool.id)}
              className="flex items-center gap-2.5 px-2.5 py-2 atlas-nav-item cursor-pointer border-none text-left w-full"
              style={{
                background: active ? def.accentBg : 'transparent',
                color: active ? def.accent : theme.textSecondary,
              }}
            >
              <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center">
                <ToolIcon icon={tool.icon} color={iconColor} size={16} />
              </div>
              <span className="text-[13px] font-medium">{tool.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-2.5 border-t border-n-border/60 bg-white/30">
        <button
          type="button"
          onClick={goPicker}
          className="flex items-center gap-2 px-2.5 py-2 atlas-nav-item cursor-pointer text-[12px] text-n-text-2 border-none bg-transparent w-full"
        >
          <div className="flex gap-1">
            {otherAgentDots.map((dot, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background: dot, opacity: 0.65 }} />
            ))}
          </div>
          Switch workspace
        </button>
      </div>
    </div>
  );
}
