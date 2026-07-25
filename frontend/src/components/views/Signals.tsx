import { useCallback, useEffect, useState } from 'react';
import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, IMPACT_COLORS, SIGNALS } from '../../lib/data';
import { AtlasApiError, fetchNewsHeadlines, type NewsHeadline } from '../../lib/api';
import { IntegrationLogo } from '../IntegrationLogo';

export function Signals() {
  const { state, goTool } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const [live, setLive] = useState<NewsHeadline[]>([]);
  const [liveError, setLiveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchNewsHeadlines('AI product management competitive', 'google', 5);
      setLive(data.headlines);
      setLiveError(null);
    } catch (e) {
      setLiveError(e instanceof AtlasApiError ? e.message : String(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="p-7 max-w-[760px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Signals Feed</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Market intelligence from public sources and your KB</p>

      <div
        className="rounded-2xl border p-4 mb-5 flex flex-wrap items-center justify-between gap-3"
        style={{ borderColor: `${def.accent}40`, background: def.accentBg }}
      >
        <div className="flex items-center gap-2">
          <IntegrationLogo icon="google_news" bg="#E8F0FE" size={28} radius={8} />
          <div>
            <p className="text-[13px] font-bold m-0" style={{ color: def.accent }}>
              Live Google News
            </p>
            <p className="text-[11.5px] text-[#78716C] m-0">Headlines refresh when you open this feed</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => goTool('report')}
          className="text-[12px] font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer text-white"
          style={{ background: def.accent }}
        >
          Full marketing analysis →
        </button>
      </div>

      {liveError && <p className="text-[13px] text-[#B42318] mb-3">⚠️ {liveError}</p>}
      {live.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {live.map((h, i) => (
            <a
              key={i}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-[#E4E2DC] rounded-xl px-4 py-3 no-underline text-inherit hover:border-[#D4640A]/30"
            >
              <p className="text-[13px] font-semibold m-0 mb-1">{h.title}</p>
              <p className="text-[11px] text-[#A8A29E] m-0">{h.published}</p>
            </a>
          ))}
        </div>
      )}

      <p className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wide mb-2">Curated signals</p>
      <div className="flex flex-col gap-3">
        {SIGNALS.map((s, i) => {
          const impact = IMPACT_COLORS[s.impact];
          return (
            <div key={i} className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex gap-1.5">
                  <span
                    className="text-[10.5px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: def.accentBg, color: def.accent }}
                  >
                    {s.type}
                  </span>
                  <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: impact.bg, color: impact.color }}>
                    {s.impact}
                  </span>
                </div>
                <span className="text-[11px] text-[#A8A29E]">{s.time}</span>
              </div>
              <p className="text-[13.5px] font-semibold m-0 mb-1 leading-snug">{s.headline}</p>
              <p className="text-[11.5px] text-[#A8A29E] m-0">{s.source}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
