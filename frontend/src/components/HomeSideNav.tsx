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
  const { state, goAgent } = useAtlas();
  const activeId = state.currentAgentId;

  return (
    <aside
      className="shrink-0 atlas-nav-rail flex flex-col h-full transition-[width] duration-200 ease-out overflow-hidden relative z-10"
      style={{ width: collapsed ? 72 : 212 }}
      aria-expanded={!collapsed}
    >
      <div className="p-3 border-b border-n-border/60 bg-white/40">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center gap-2.5 py-2 rounded-xl cursor-pointer border-none bg-transparent hover:bg-n-surface-2 transition-colors ${
            collapsed ? 'justify-center px-0' : 'px-2'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <AtlasMark size={28} variant="ai" />
          {!collapsed && (
            <span className="text-[14px] font-semibold text-n-text truncate tracking-tight">Atlas</span>
          )}
        </button>
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto" aria-label="Agents">
        {!collapsed && (
          <p className="text-[10px] font-semibold uppercase tracking-wider text-n-text-muted px-2.5 pt-1 pb-2 m-0">
            Agents
          </p>
        )}
        {AGENT_DEFS.map((ag) => (
          <AgentNavItem
            key={ag.id}
            name={ag.name}
            accent={ag.accent}
            accentBg={ag.accentBg}
            icon={AGENT_NAV_ICON[ag.id]}
            collapsed={collapsed}
            active={activeId === ag.id}
            onSelect={() => goAgent(ag.id)}
          />
        ))}
      </nav>
    </aside>
  );
}

function AgentNavItem({
  name,
  accent,
  accentBg,
  icon,
  collapsed,
  active,
  onSelect,
}: {
  name: string;
  accent: string;
  accentBg: string;
  icon: ToolIconName;
  collapsed: boolean;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={collapsed ? name : undefined}
      aria-label={`Open ${name} agent`}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2.5 w-full py-2 rounded-xl cursor-pointer border-none transition-colors ${
        collapsed ? 'justify-center px-0' : 'px-2.5'
      } ${active ? '' : 'bg-transparent hover:bg-n-surface-2'}`}
      style={
        active
          ? { background: accentBg, boxShadow: `inset 0 0 0 1px ${accent}30` }
          : undefined
      }
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/70 border border-n-border/50"
        style={active ? { background: '#fff', borderColor: `${accent}25` } : { background: accentBg }}
      >
        <ToolIcon icon={icon} color={accent} size={17} />
      </span>
      {!collapsed && (
        <span className="text-[13px] font-medium truncate" style={{ color: active ? accent : theme.textSecondary }}>
          {name}
        </span>
      )}
    </button>
  );
}
