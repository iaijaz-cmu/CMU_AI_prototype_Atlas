import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS } from '../../lib/data';

export function Report() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Market Report</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Atlas vs AI-assisted PM tools — July 2026</p>
      <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
        <div className="px-5.5 py-4.5 border-b border-[#F0EEE8] flex items-center justify-between">
          <p className="font-bold m-0">AI-PM Tools Landscape Report</p>
          <div className="text-[11.5px] text-[#78716C] px-3 py-1.5 border border-[#E4E2DC] rounded-[9px]">↓ Export PDF</div>
        </div>
        <div className="p-5.5 flex flex-col gap-3.5 text-[13.5px] text-[#3f3d38] leading-[1.7]">
          <p className="m-0">
            The AI-assisted product management market is growing at 38% YoY, driven by enterprise demand for evidence-backed
            planning tools. Three patterns dominate: general-purpose AI added to existing PM platforms, standalone AI writing
            assistants, and retrieval-first systems like Atlas that ground outputs in organizational memory.
          </p>
          <p className="m-0">
            Atlas's competitive differentiation is strongest in the retrieval-first category — no current competitor combines
            RAG-based org memory, per-source citations, confidence scoring, and approval workflows in a single PM-native
            product.
          </p>
          <div className="rounded-xl px-4 py-3.5 font-semibold" style={{ background: def.accentBg, color: def.accent }}>
            Key finding: Enterprise PMs value citation precision over generation speed. Atlas's ≥95% citation threshold is the
            correct architectural bet.
          </div>
        </div>
      </div>
    </div>
  );
}
