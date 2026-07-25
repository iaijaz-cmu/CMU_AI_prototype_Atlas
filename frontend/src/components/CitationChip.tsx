import { useState } from 'react';
import type { Citation } from '../lib/types';

export function CitationChip({ citation, accent }: { citation: Citation; accent: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <span
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#F5F4F0] text-[#78716C] cursor-pointer hover:brightness-95"
      >
        {citation.id}
      </span>
      {open && citation.snippet && (
        <div
          className="absolute bottom-[calc(100%+6px)] left-0 w-[260px] bg-white border border-[#E4E2DC] rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.14)] p-3 z-50 text-left"
          style={{ borderTopColor: accent, borderTopWidth: 2 }}
        >
          <p className="font-mono text-[10.5px] font-bold m-0 mb-1" style={{ color: accent }}>
            {citation.id} · {citation.source}
          </p>
          <p className="text-[12px] text-[#3f3d38] leading-snug m-0">{citation.snippet}</p>
        </div>
      )}
    </div>
  );
}
