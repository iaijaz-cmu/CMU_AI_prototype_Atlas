import { useState } from 'react';

const PROFILE = {
  name: 'Ifra Aijaz',
  email: 'ifra@example.com',
};

function PersonIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.35" />
      <path d="M3.5 13.5c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

export function HomeHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="shrink-0 flex items-center justify-end px-6 sm:px-10 py-4 sticky top-0 z-30 bg-n-bg/80 backdrop-blur-md">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-9 h-9 rounded-full bg-white text-n-text-2 flex items-center justify-center cursor-pointer shadow-sm border border-n-border/60 hover:shadow-md hover:text-n-text transition-all"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Account menu"
        >
          <PersonIcon />
        </button>

        {open && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default border-none bg-transparent"
              aria-label="Close profile menu"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-[240px] atlas-widget rounded-2xl p-2 z-50" role="menu">
              <div className="px-3 py-3 border-b border-n-border mb-1">
                <p className="text-[14px] font-semibold text-n-text m-0">{PROFILE.name}</p>
                <p className="text-[11px] text-n-text-muted m-0 mt-1">{PROFILE.email}</p>
              </div>
              <MenuRow label="Workspace settings" onClick={() => setOpen(false)} />
              <MenuRow label="Connected apps" onClick={() => setOpen(false)} />
              <MenuRow label="Sign out" muted onClick={() => setOpen(false)} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function MenuRow({
  label,
  onClick,
  muted,
}: {
  label: string;
  onClick: () => void;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-xl border-none cursor-pointer text-[13px] hover:bg-n-surface-2 ${
        muted ? 'text-n-text-muted' : 'text-n-text font-medium'
      }`}
    >
      {label}
    </button>
  );
}
