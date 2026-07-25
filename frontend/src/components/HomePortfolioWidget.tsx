import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS, PORTFOLIO_PROJECTS } from '../lib/data';
import type { PortfolioProjectStatus, ToolIcon as ToolIconName } from '../lib/types';
import { theme } from '../lib/theme';
import { ToolIcon } from './icons/ToolIcon';

const AGENT_TOOL_ICON: Record<string, ToolIconName> = {
  product: 'doc',
  engineering: 'code',
  market: 'radar',
  sales: 'deal',
};

const STATUS_STYLE: Record<PortfolioProjectStatus, { bg: string; color: string }> = {
  Active: { bg: '#EDF3EC', color: '#448361' },
  Discovery: { bg: theme.accentSoft, color: theme.accent },
  Shipped: { bg: theme.goldSoft, color: '#9A7B3A' },
  Paused: { bg: theme.surfaceHover, color: theme.textMuted },
};

export function HomePortfolioWidget() {
  const { goAgent, goTool } = useAtlas();

  return (
    <section className="atlas-widget h-full flex flex-col min-h-[320px] overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-n-border/60 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-n-text m-0 tracking-tight">Portfolio</h2>
          <p className="text-[11px] text-n-text-muted m-0 mt-1">Your active initiatives</p>
        </div>
        <span className="text-[11px] font-semibold tabular-nums px-2.5 py-1 rounded-full bg-n-accent-soft text-n-accent">
          {PORTFOLIO_PROJECTS.length}
        </span>
      </div>

      <ul className="list-none m-0 p-4 flex flex-col gap-2 flex-1 overflow-y-auto max-h-[360px]">
        {PORTFOLIO_PROJECTS.map((p) => {
          const agent = AGENT_DEFS.find((a) => a.id === p.agentId);
          const status = STATUS_STYLE[p.status];
          const toolIcon = AGENT_TOOL_ICON[p.agentId] ?? 'grid';
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  goAgent(p.agentId);
                  goTool(p.toolId);
                }}
                className="group w-full text-left p-3.5 rounded-2xl bg-n-inset/80 hover:bg-white border border-transparent hover:border-n-border hover:shadow-sm cursor-pointer transition-all flex gap-3 items-center"
              >
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-n-border/40"
                  style={{ background: agent?.accentBg }}
                >
                  <ToolIcon icon={toolIcon} color={agent?.accent ?? theme.accent} size={17} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-n-text truncate group-hover:text-n-accent transition-colors">
                      {p.name}
                    </span>
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: status.bg, color: status.color }}
                    >
                      {p.status}
                    </span>
                  </span>
                  <span className="text-[10px] text-n-text-muted block mb-2">{p.updatedLabel}</span>
                  <span className="flex items-center gap-2">
                    <span className="flex-1 h-1 rounded-full bg-n-border overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-n-accent"
                        style={{ width: `${p.progress}%`, opacity: 0.85 }}
                      />
                    </span>
                    <span className="text-[10px] font-bold tabular-nums text-n-text-2">{p.progress}%</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
