import { ADR_SECTIONS } from '../../lib/data';

export function ADR() {
  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">ADR Writer</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Architecture Decision Records — generated and version-controlled</p>
      <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
        <div className="px-5.5 py-4.5 border-b border-[#F0EEE8] flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] text-[#A8A29E] m-0">ADR-042</p>
            <h2 className="text-[15.5px] font-bold mt-0.5 mb-0">Vector Database Selection for Atlas RAG Layer</h2>
          </div>
          <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0 bg-[#EDFAF4] text-[#0d9668]">Accepted</span>
        </div>
        <div className="p-5.5 flex flex-col gap-4 text-[13.5px]">
          {ADR_SECTIONS.map((sec) => (
            <div key={sec.label}>
              <p className="font-bold m-0 mb-1.5">{sec.label}</p>
              <p className="text-[#57534E] leading-[1.65] m-0">{sec.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
