import { useEffect, useLayoutEffect, useRef, useState, type RefObject, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import type { Integration, ToolIcon as ToolIconName } from '../lib/types';
import { theme } from '../lib/theme';
import { IntegrationLogo } from './IntegrationLogo';
import { ToolIcon } from './icons/ToolIcon';

const AGENT_NAV_ICON = {
  product: 'doc',
  engineering: 'code',
  market: 'radar',
  sales: 'shield',
} as const;

interface Props {
  align?: 'left' | 'right';
  showAppScope?: boolean;
}

export function HeaderAskDropdown({ align = 'left', showAppScope = true }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { state, closeHeaderMenus } = useAtlas();

  useEffect(() => {
    if (!state.headerOpenMenu) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (target.closest('[data-atlas-header-menu]')) return;
        closeHeaderMenus();
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [state.headerOpenMenu, closeHeaderMenus]);

  return (
    <div ref={rootRef} className="flex items-center gap-2 flex-wrap relative z-50">
      <HeaderAgentDropdown align={align} />
      {showAppScope && <HeaderAppScopeDropdown align={align} />}
    </div>
  );
}

function useMenuPosition(anchorRef: RefObject<HTMLElement | null>, open: boolean, align: 'left' | 'right') {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 240 });

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const update = () => {
      const r = anchorRef.current!.getBoundingClientRect();
      const width = 260;
      const left = align === 'right' ? r.right - width : r.left;
      setPos({
        top: r.bottom + 6,
        left: Math.max(8, Math.min(left, window.innerWidth - width - 8)),
        width,
      });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, align, anchorRef]);

  return pos;
}

function MenuPortal({
  anchorRef,
  open,
  align,
  children,
}: {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  align: 'left' | 'right';
  children: ReactNode;
}) {
  const pos = useMenuPosition(anchorRef, open, align);
  if (!open) return null;

  return createPortal(
    <div
      data-atlas-header-menu
      className="max-h-[min(360px,55vh)] overflow-y-auto bg-white border border-n-border rounded-xl shadow-lg p-1.5"
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        zIndex: 10000,
      }}
      role="listbox"
    >
      {children}
    </div>,
    document.body,
  );
}

function pillButtonClass(active: boolean) {
  return `flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-lg cursor-pointer border max-w-[200px] ${
    active ? 'border-n-border-strong bg-n-surface-2' : 'border-n-border bg-n-inset hover:bg-n-surface-2'
  }`;
}

function HeaderAgentDropdown({ align }: { align: 'left' | 'right' }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { state, toggleHeaderAgentMenu, setHeaderTargetAgent } = useAtlas();

  const selectedAgent = state.headerTargetAgent
    ? AGENT_DEFS.find((a) => a.id === state.headerTargetAgent)
    : state.currentAgentId
      ? AGENT_DEFS.find((a) => a.id === state.currentAgentId)
      : null;

  const agentLabel = selectedAgent ? `${selectedAgent.name} Agent` : 'Any agent';
  const open = state.headerOpenMenu === 'agent';

  return (
    <div className="relative" ref={anchorRef}>
      <button
        type="button"
        onClick={toggleHeaderAgentMenu}
        className={pillButtonClass(open)}
        style={
          selectedAgent
            ? { color: selectedAgent.accent, background: selectedAgent.accentBg, borderColor: `${selectedAgent.accent}40` }
            : { color: theme.textSecondary }
        }
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selectedAgent && (
          <span
            className="w-5 h-5 shrink-0 rounded flex items-center justify-center border border-n-border"
            style={{ background: selectedAgent.accentBg }}
          >
            <ToolIcon icon={AGENT_NAV_ICON[selectedAgent.id]} color={selectedAgent.accent} size={13} />
          </span>
        )}
        <span className="truncate">{agentLabel}</span>
        <Chevron open={open} />
      </button>

      <MenuPortal anchorRef={anchorRef} open={open} align={align}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-n-text-muted px-2.5 pt-1 pb-1 m-0">Agent</p>
        <AgentMenuRow
          label="Any agent"
          sub="Atlas picks context"
          selected={!state.headerTargetAgent && !state.currentAgentId}
          onClick={() => setHeaderTargetAgent(null)}
        />
        {AGENT_DEFS.map((ag) => (
          <AgentMenuRow
            key={ag.id}
            label={`${ag.name} Agent`}
            sub={ag.tagline}
            accent={ag.accent}
            accentBg={ag.accentBg}
            icon={AGENT_NAV_ICON[ag.id]}
            selected={
              state.headerTargetAgent === ag.id ||
              (!state.headerTargetAgent && state.currentAgentId === ag.id)
            }
            onClick={() => setHeaderTargetAgent(ag.id)}
          />
        ))}
      </MenuPortal>
    </div>
  );
}

function HeaderAppScopeDropdown({ align }: { align: 'left' | 'right' }) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const { state, toggleHeaderScopeMenu, setHeaderScope, clearHeaderScope } = useAtlas();

  const scopedIntegration = state.headerScopeApp
    ? state.integrations.find((i) => i.name === state.headerScopeApp)
    : undefined;
  const slackScoped = state.headerScopeApp === 'Slack';
  const gmailScoped = state.headerScopeApp === 'Gmail';
  const appLabel = state.headerScopeApp ? state.headerScopeApp : 'All apps';
  const open = state.headerOpenMenu === 'apps';

  const scopeStyle = slackScoped
    ? { color: '#4A154B', background: '#F5EBF5', borderColor: '#4A154B30' }
    : gmailScoped
      ? { color: '#C4554D', background: '#FCE8E6', borderColor: '#C4554D30' }
      : scopedIntegration
        ? { color: theme.textSecondary, background: scopedIntegration.bg, borderColor: theme.border }
        : { color: theme.textSecondary, background: theme.surfaceInset, borderColor: theme.border };

  const connected = state.integrations.filter((i) => i.status === 'connected');
  const notConnected = state.integrations.filter((i) => i.status !== 'connected');

  return (
    <div className="relative" ref={anchorRef}>
      <button
        type="button"
        onClick={toggleHeaderScopeMenu}
        className={pillButtonClass(open)}
        style={scopeStyle}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {scopedIntegration ? (
          <IntegrationLogo icon={scopedIntegration.icon} bg={scopedIntegration.bg} size={16} radius={4} />
        ) : (
          <AppsGridIcon />
        )}
        <span className="truncate">{appLabel}</span>
        <Chevron open={open} />
      </button>

      <MenuPortal anchorRef={anchorRef} open={open} align={align}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-n-text-muted px-2.5 pt-1 pb-1 m-0">
          App scope
        </p>
        <button
          type="button"
          onClick={clearHeaderScope}
          className="w-full px-2.5 py-2 rounded-lg text-xs text-n-text-2 cursor-pointer border-none text-left hover:bg-n-surface-2"
          style={{
            background: !state.headerScopeApp ? theme.surfaceHover : undefined,
            fontWeight: !state.headerScopeApp ? 600 : 400,
          }}
        >
          <span className="flex items-center gap-2">
            <AppsGridIcon />
            <span>All apps · workspace-wide</span>
          </span>
        </button>

        {connected.length > 0 && (
          <p className="text-[9px] font-bold uppercase tracking-wider text-n-text-muted px-2.5 pt-2 pb-1 m-0">
            Connected
          </p>
        )}
        {connected.map((app) => (
          <IntegrationMenuRow
            key={app.name}
            app={app}
            selected={state.headerScopeApp === app.name}
            onClick={() => setHeaderScope(app.name)}
          />
        ))}

        {notConnected.length > 0 && (
          <p className="text-[9px] font-bold uppercase tracking-wider text-n-text-muted px-2.5 pt-2 pb-1 m-0">
            Not connected
          </p>
        )}
        {notConnected.map((app) => (
          <IntegrationMenuRow key={app.name} app={app} selected={false} disabled />
        ))}
      </MenuPortal>
    </div>
  );
}

function IntegrationMenuRow({
  app,
  selected,
  onClick,
  disabled,
}: {
  app: Integration;
  selected: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg cursor-pointer border-none text-left hover:bg-n-surface-2 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: selected
          ? app.name === 'Gmail'
            ? '#FCE8E6'
            : app.name === 'Slack'
              ? '#F5EBF5'
              : theme.surfaceHover
          : undefined,
      }}
    >
      <IntegrationLogo icon={app.icon} bg={app.bg} size={18} radius={5} />
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-xs font-semibold text-n-text truncate">{app.name}</span>
        {!disabled && <span className="block text-[10px] text-n-text-muted truncate">{app.desc}</span>}
        {disabled && <span className="block text-[10px] text-n-text-muted">Connect in Integrations</span>}
      </span>
      {selected && <span className="text-[10px] font-bold text-n-text-2 shrink-0">✓</span>}
    </button>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className={`shrink-0 text-n-text-muted transition-transform ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AppsGridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-n-text-muted" aria-hidden>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function AgentMenuRow({
  label,
  sub,
  selected,
  onClick,
  accent,
  accentBg,
  icon,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  accent?: string;
  accentBg?: string;
  icon?: ToolIconName;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full px-2.5 py-2 rounded-lg cursor-pointer border-none text-left hover:bg-n-surface-2"
      style={{ background: selected ? accentBg ?? theme.surfaceHover : undefined }}
    >
      {icon && accent && accentBg ? (
        <span
          className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center border border-n-border"
          style={{ background: accentBg }}
        >
          <ToolIcon icon={icon} color={accent} size={15} />
        </span>
      ) : (
        <span className="w-7 h-7 shrink-0 rounded-md bg-n-surface-2 border border-n-border flex items-center justify-center text-[11px] text-n-accent">
          ✦
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-n-text truncate">{label}</span>
        <span className="block text-[10px] text-n-text-2 truncate">{sub}</span>
      </span>
      {selected && accent && (
        <span className="text-[10px] font-bold shrink-0" style={{ color: accent }}>
          ✓
        </span>
      )}
      {selected && !accent && <span className="text-[10px] font-bold shrink-0">✓</span>}
    </button>
  );
}
