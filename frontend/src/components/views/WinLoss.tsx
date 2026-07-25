import { LOSS_REASONS, WIN_REASONS, WINLOSS_STATS } from '../../lib/data';

export function WinLoss() {
  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Win / Loss Analysis</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Q4 2025 — grounded in CRM notes, deal records, and customer interviews</p>
      <div className="grid grid-cols-3 gap-3.5 mb-4.5">
        {WINLOSS_STATS.map((s) => (
          <div key={s.label} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 text-center">
            <p className="text-[11px] text-[#A8A29E] m-0 mb-2">{s.label}</p>
            <p className="text-[26px] font-extrabold m-0" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-[11px] text-emerald-500 font-semibold mt-1.5 mb-0">{s.delta}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-500 m-0 mb-2.5">Top Win Reasons</p>
          {WIN_REASONS.map((r) => (
            <div key={r} className="text-[13px] text-[#3f3d38] flex gap-1.5 mb-2">
              <span className="text-emerald-500">✓</span>
              {r}
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#dc2626] m-0 mb-2.5">Top Loss Reasons</p>
          {LOSS_REASONS.map((r) => (
            <div key={r} className="text-[13px] text-[#3f3d38] flex gap-1.5 mb-2">
              <span className="text-[#f87171]">✕</span>
              {r}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
