import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, BATTLE_CARDS } from '../../lib/data';

export function Battlecard() {
  const { state, selectBattle } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const card = BATTLE_CARDS[state.battleSelected];

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Battle Cards</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-4.5">Quick-reference competitor positioning for sales conversations</p>
      <div className="flex gap-2 mb-4.5">
        {Object.keys(BATTLE_CARDS).map((name) => {
          const active = state.battleSelected === name;
          return (
            <div
              key={name}
              onClick={() => selectBattle(name)}
              className="px-3.5 py-2 rounded-[11px] text-[13px] font-semibold cursor-pointer"
              style={{
                background: active ? def.accent : '#fff',
                color: active ? '#fff' : '#78716C',
                border: `1px solid ${active ? def.accent : '#E4E2DC'}`,
              }}
            >
              vs {name}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#78716C] m-0 mb-2.5">Their Strengths</p>
          {card.usp.map((i) => (
            <div key={i} className="text-[13px] text-[#3f3d38] flex gap-1.5 mb-2 leading-snug">
              <span className="text-[#78716C]">›</span>
              {i}
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#dc2626] m-0 mb-2.5">Their Weaknesses</p>
          {card.objections.map((i) => (
            <div key={i} className="text-[13px] text-[#3f3d38] flex gap-1.5 mb-2 leading-snug">
              <span className="text-[#dc2626]">›</span>
              {i}
            </div>
          ))}
        </div>
        <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
          <p className="text-[11px] font-bold uppercase tracking-wide m-0 mb-2.5" style={{ color: def.accent }}>
            Our Counter
          </p>
          {card.counters.map((i) => (
            <div key={i} className="text-[13px] text-[#3f3d38] flex gap-1.5 mb-2 leading-snug">
              <span style={{ color: def.accent }}>›</span>
              {i}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
