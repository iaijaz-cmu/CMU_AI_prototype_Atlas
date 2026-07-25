import { STANDUP_SECTIONS } from '../../lib/data';

export function Standup() {
  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Standup Brief</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">AI-generated from Jira Sprint 42 · Today, 9:00 AM</p>
      <div className="flex flex-col gap-3.5">
        {STANDUP_SECTIONS.map((sec) => (
          <div key={sec.label} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-[7px] h-[7px] rounded-full" style={{ background: sec.color }} />
              <p className="text-[11px] font-bold uppercase tracking-wide m-0" style={{ color: sec.color }}>
                {sec.label}
              </p>
            </div>
            {sec.items.map((it) => (
              <div key={it} className="text-[13.5px] text-[#3f3d38] mb-1.5 leading-snug">
                {it}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
