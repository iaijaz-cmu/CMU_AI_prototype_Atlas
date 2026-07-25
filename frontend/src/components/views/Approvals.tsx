import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS } from '../../lib/data';

export function Approvals() {
  const { state, resolveApproval } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Review &amp; Approve</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">
        Human oversight layer — approve before any artifact is exported or acted upon
      </p>
      <div className="flex flex-col gap-3">
        {state.approvals.map((item) => {
          const isPending = item.status === 'pending';
          const confColor = item.confidence === 'High' ? '#1A9E6E' : '#D4640A';
          const statusBg = item.status === 'approved' ? '#EDFAF4' : '#FEF2F2';
          const statusColor = item.status === 'approved' ? '#1A9E6E' : '#dc2626';
          return (
            <div key={item.id} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 flex items-center gap-3.5">
              <div
                className="w-9 h-9 rounded-[11px] flex items-center justify-center text-sm shrink-0"
                style={{ background: def.accentBg, color: def.accent }}
              >
                ▤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#A8A29E] m-0 mb-0.5">
                  {item.type} · {item.sources} sources · {item.time}
                </p>
                <p className="text-[13.5px] font-bold m-0 whitespace-nowrap overflow-hidden text-ellipsis">{item.title}</p>
                <p className="text-[11.5px] mt-0.5 mb-0" style={{ color: confColor }}>
                  Confidence: {item.confidence}
                </p>
              </div>
              {isPending ? (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => resolveApproval(item.id, 'approved')}
                    className="px-3.5 py-1.5 text-[11.5px] font-bold text-[#0d9668] bg-[#EDFAF4] border border-[#A7E8CD] rounded-[9px] cursor-pointer"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => resolveApproval(item.id, 'rejected')}
                    className="px-3.5 py-1.5 text-[11.5px] font-bold text-[#dc2626] bg-[#FEF2F2] border border-[#FECACA] rounded-[9px] cursor-pointer"
                  >
                    ✕ Reject
                  </button>
                </div>
              ) : (
                <span
                  className="text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: statusBg, color: statusColor }}
                >
                  {item.status}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
