import { EVAL_DIMS, EVAL_VERSIONS } from '../../lib/data';

export function Eval() {
  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Eval Dashboard</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Automated scoring across 50 test cases — per-dimension breakdown</p>

      <div className="grid grid-cols-3 gap-3.5 mb-5">
        {EVAL_VERSIONS.map((v) => (
          <div key={v.v} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 text-center">
            <p className="font-mono text-[11px] text-[#A8A29E] m-0 mb-1">{v.v}</p>
            <p className="text-[32px] font-extrabold m-0" style={{ color: v.color }}>
              {v.score}%
            </p>
            {v.delta && <p className="text-[11px] text-emerald-500 font-semibold mt-1 mb-0">{v.delta}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E4E2DC] rounded-2xl p-5 mb-4.5">
        <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide m-0 mb-3.5">v0.3 — Per Dimension</p>
        <div className="flex flex-col gap-2.5">
          {EVAL_DIMS.map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="text-[11.5px] text-[#78716C] w-24 shrink-0">{d.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#F0EEE8] overflow-hidden">
                <div className="h-full w-full" style={{ background: d.color }} />
              </div>
              <span className="font-mono text-[11.5px] text-[#57534E] w-8 text-right shrink-0">100%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#18181B] rounded-2xl p-4.5 font-mono text-[11.5px] text-[#A8A29E] leading-[1.8]">
        <div className="text-[#78716C] mb-1.5">// Sprint 2 eval harness (v0.3)</div>
        <div>
          <span className="text-[#c4b5fd]">auto_score</span>(result) → citation | confidence | structure | uncertainty | refusal
        </div>
        <div>
          <span className="text-[#c4b5fd]">failure_mode_report</span>: 10 improved, 0 regressed
        </div>
        <div>
          <span className="text-[#c4b5fd]">eval_set</span>: 50 cases (30 modal · 12 edge · 5 out-of-scope · 3 adversarial)
        </div>
      </div>
    </div>
  );
}
