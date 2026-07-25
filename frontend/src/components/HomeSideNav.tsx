import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import type { AgentId, ToolIcon as ToolIconName } from '../lib/types';
import { theme } from '../lib/theme';
import { AtlasMark } from './icons/AtlasMark';
import { ToolIcon } from './icons/ToolIcon';

const AGENT_NAV_ICON: Record<AgentId, ToolIconName> = {
  product: 'doc',
  engineering: 'code',
  market: 'radar',
  sales: 'shield',
};

interface Props {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function HomeSideNav({ collapsed, onToggleCollapse }: Props) {
  const { goAgent } = useAtlas();

  return (
    <aside
      className="shrink-0 atlas-nav-rail flex flex-col h-full transition-[width] duration-200 ease-out overflow-hidden"
      style={{ width: collapsed ? 72 : 220 }}
      aria-expanded={!collapsed}
    >
      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex items-center gap-2.5 p-4 border-b border-[#E9E9E7] w-full text-left cursor-pointer hover:bg-[#F1F1EF] border-none bg-transparent"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={collapsed ? 'Expand Atlas navigation' : 'Collapse Atlas navigation'}
      >
        <AtlasMark size={collapsed ? 32 : 28} variant="ai" />
        {!collapsed && (
          <span className="text-[13.5px] font-semibold text-[#37352F] truncate">Atlas</span>
        )}
      </button>

      <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto" aria-label="Agents">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#9B9A97] px-2.5 mb-1 m-0">Agents</p>
        )}
        {AGENT_DEFS.map((ag) => (
          <AgentNavItem
            key={ag.id}
            agentId={ag.id}
            name={ag.name}
            accent={ag.accent}
            accentBg={ag.accentBg}
            collapsed={collapsed}
            onSelect={() => goAgent(ag.id)}
          />
        ))}
      </nav>
    </aside>
  );
}

function AgentNavItem({
  agentId,
  name,
  accent,
  accentBg,
  collapsed,
  onSelect,
}: {
  agentId: AgentId;
  name: string;
  accent: string;
  accentBg: string;
  collapsed: boolean;
  onSelect: () => void;
}) {
  const icon = AGENT_NAV_ICON[agentId];

  return (
    <button
      type="button"
      onClick={onSelect}
      title={collapsed ? name : undefined}
      aria-label={`Open ${name} agent`}
      className={`flex items-center gap-2.5 atlas-nav-item cursor-pointer border-none text-left w-full ${
        collapsed ? 'justify-center px-0 py-2.5' : 'px-2.5 py-2.5'
      }`}
    >
      <span
        className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center border border-[#E9E9E7]"
        style={{ background: accentBg }}
      >
        <ToolIcon icon={icon} color={accent} size={17} />
      </span>
      {!collapsed && (
        <span className="text-[13px] font-medium truncate" style={{ color: theme.text }}>
          {name}
        </span>
      )}
    </button>
  );
}
