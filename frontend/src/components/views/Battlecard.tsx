import { useMemo, useState } from 'react';
import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, BATTLE_CARDS } from '../../lib/data';
import type { BattleCardContent } from '../../lib/types';

const PLACEHOLDER_BATTLE_CARD: BattleCardContent = {
  usp: ['Connect CRM and competitor intel to auto-fill strengths from recent deals'],
  objections: ['Add win/loss notes and discovery call summaries to sharpen weaknesses'],
  counters: ['Atlas drafts citation-backed counters from your PRDs, roadmap, and customer evidence'],
};

export function Battlecard() {
  const { state, selectBattle } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const [addOpen, setAddOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);
  const [customCards, setCustomCards] = useState<Record<string, BattleCardContent>>({});

  const allCards = useMemo(() => ({ ...BATTLE_CARDS, ...customCards }), [customCards]);
  const card = allCards[state.battleSelected] ?? BATTLE_CARDS.Productboard;
  const competitorNames = Object.keys(allCards);

  const onAddCompany = () => {
    const name = newCompany.trim();
    if (!name) return;
    if (competitorNames.some((n) => n.toLowerCase() === name.toLowerCase())) {
      selectBattle(competitorNames.find((n) => n.toLowerCase() === name.toLowerCase())!);
      setNewCompany('');
      setAddOpen(false);
      return;
    }
    setCustomCards((prev) => ({ ...prev, [name]: PLACEHOLDER_BATTLE_CARD }));
    selectBattle(name);
    setNewCompany('');
    setAddedNotice(name);
    setAddOpen(false);
    window.setTimeout(() => setAddedNotice(null), 4000);
  };

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4.5">
        <div>
          <h1 className="text-xl font-bold m-0 mb-1">Battle Cards</h1>
          <p className="text-[13px] text-[#78716C] m-0">
            Quick-reference competitor positioning for sales conversations
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen((o) => !o)}
          className="text-[12px] font-bold px-3.5 py-2 rounded-lg border cursor-pointer shrink-0"
          style={{
            borderColor: def.accent,
            color: def.accent,
            background: addOpen ? def.accentBg : '#fff',
          }}
        >
          {addOpen ? 'Close' : '+ Add competitor'}
        </button>
      </div>

      {addOpen && (
        <div className="border border-[#E4E2DC] rounded-xl p-4 mb-4 bg-[#FAFAF8]">
          <p className="text-[12px] font-bold m-0 mb-1">Compare another company</p>
          <p className="text-[12px] text-[#78716C] m-0 mb-3">
            Add any competitor to your battle card library — same strengths / weaknesses / counter layout as
            Productboard, Notion AI, and Linear.
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <input
              placeholder="Company name (e.g. Aha!, Monday.com)"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onAddCompany();
              }}
              className="border border-[#E4E2DC] rounded-lg px-3 py-2 text-[13px] flex-1 min-w-[200px] bg-white"
            />
            <button
              type="button"
              onClick={onAddCompany}
              className="text-[12px] font-bold px-3.5 py-2 rounded-lg text-white border-none cursor-pointer"
              style={{ background: def.accent }}
            >
              Add to battle cards
            </button>
          </div>
        </div>
      )}

      {addedNotice && (
        <p className="text-[12px] m-0 mb-3 font-semibold" style={{ color: def.accent }}>
          Added vs {addedNotice} — edit bullets from win/loss and deal intel (demo placeholder).
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4.5">
        {competitorNames.map((name) => {
          const active = state.battleSelected === name;
          const isCustom = Boolean(customCards[name]);
          return (
            <div
              key={name}
              role="button"
              tabIndex={0}
              onClick={() => selectBattle(name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') selectBattle(name);
              }}
              className="px-3.5 py-2 rounded-[11px] text-[13px] font-semibold cursor-pointer"
              style={{
                background: active ? def.accent : '#fff',
                color: active ? '#fff' : '#78716C',
                border: `1px solid ${active ? def.accent : isCustom ? def.accent : '#E4E2DC'}`,
                borderStyle: isCustom && !active ? 'dashed' : 'solid',
              }}
            >
              vs {name}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="px-3.5 py-2 rounded-[11px] text-[13px] font-semibold cursor-pointer bg-white"
          style={{
            color: def.accent,
            border: `1px dashed ${def.accent}`,
          }}
        >
          + Add competitor
        </button>
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
