import { useCallback, useEffect, useState } from 'react';
import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS } from '../../lib/data';
import {
  analyzeMarketNews,
  AtlasApiError,
  fetchNewsHeadlines,
  type GenerateResult,
  type NewsHeadline,
  type NewsSourceId,
} from '../../lib/api';
import { AtlasMarkdown } from '../AtlasMarkdown';
import { CitationChip } from '../CitationChip';
import { ConfidenceBadge } from '../ConfidenceBadge';
import { GmailComposeButton } from '../GmailComposeButton';
import { IntegrationLogo } from '../IntegrationLogo';

const QUERY_CHIPS = [
  'AI product management tools',
  'enterprise SaaS GTM strategy',
  'Productboard competitor',
  'generative AI PM software',
];

const ANALYSIS_PROMPTS = [
  'Marketing analysis: themes, audience signals, and recommended campaigns for Atlas.',
  'Competitive positioning vs Productboard and Linear based on these headlines.',
  'Executive brief: risks, opportunities, and messaging pillars for Q3.',
];

export function Report() {
  const { state } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];

  const [source, setSource] = useState<NewsSourceId>('google');
  const [query, setQuery] = useState(QUERY_CHIPS[0]);
  const [analysisPrompt, setAnalysisPrompt] = useState(ANALYSIS_PROMPTS[0]);
  const [headlines, setHeadlines] = useState<NewsHeadline[]>([]);
  const [loadingHeadlines, setLoadingHeadlines] = useState(false);
  const [headlineError, setHeadlineError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);

  const loadHeadlines = useCallback(async () => {
    setLoadingHeadlines(true);
    setHeadlineError(null);
    try {
      const data = await fetchNewsHeadlines(query, source, 8);
      setHeadlines(data.headlines);
    } catch (e) {
      setHeadlineError(e instanceof AtlasApiError ? e.message : String(e));
      setHeadlines([]);
    } finally {
      setLoadingHeadlines(false);
    }
  }, [query, source]);

  useEffect(() => {
    void loadHeadlines();
  }, [loadHeadlines]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    setResult(null);
    try {
      const out = await analyzeMarketNews({ query, source, question: analysisPrompt, limit: 10 });
      setResult(out);
    } catch (e) {
      setAnalysisError(e instanceof AtlasApiError ? e.message : String(e));
    } finally {
      setAnalyzing(false);
    }
  };

  const sourceLabel = source === 'bloomberg' ? 'Bloomberg' : 'Google News';

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Market Report</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">
        Live {sourceLabel} headlines + Atlas Market agent — grounded marketing analysis
      </p>

      <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 mb-4.5">
        <p className="text-[12px] font-bold text-[#57534E] m-0 mb-2">News source</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(
            [
              { id: 'google' as const, label: 'Google News', icon: 'google_news' as const, bg: '#E8F0FE' },
              { id: 'bloomberg' as const, label: 'Bloomberg', icon: 'bloomberg' as const, bg: '#F5F4F0' },
            ] as const
          ).map((s) => {
            const active = source === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSource(s.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer text-[13px] font-bold"
                style={{
                  borderColor: active ? def.accent : '#E4E2DC',
                  background: active ? def.accentBg : '#fff',
                  color: active ? def.accent : '#57534E',
                }}
              >
                <IntegrationLogo icon={s.icon} bg={s.bg} size={22} radius={6} />
                {s.label}
              </button>
            );
          })}
        </div>

        <p className="text-[12px] font-bold text-[#57534E] m-0 mb-2">Search topic</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full box-border border border-[#E4E2DC] rounded-xl px-3 py-2.5 text-[13.5px] mb-2 outline-none focus:border-[#D4640A]/50"
          placeholder="e.g. AI product management"
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {QUERY_CHIPS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuery(q)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-[#E4E2DC] bg-[#FAFAF8] text-[#57534E] cursor-pointer hover:border-[#A8A29E]"
            >
              {q.length > 36 ? `${q.slice(0, 36)}…` : q}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void loadHeadlines()}
          disabled={loadingHeadlines}
          className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-[#E4E2DC] bg-white cursor-pointer mb-4"
        >
          {loadingHeadlines ? 'Refreshing…' : 'Refresh headlines'}
        </button>

        {headlineError && <p className="text-[13px] text-[#B42318] m-0 mb-3">⚠️ {headlineError}</p>}

        <div className="border border-[#E4E2DC] rounded-xl max-h-[220px] overflow-y-auto divide-y divide-[#F0EEE8]">
          {headlines.length === 0 && !loadingHeadlines && (
            <p className="text-[13px] text-[#A8A29E] px-3 py-4 m-0">No headlines yet — try another query.</p>
          )}
          {headlines.map((h, i) => (
            <a
              key={`${i}-${h.url}`}
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 hover:bg-[#FAFAF8] no-underline text-inherit"
            >
              <p className="text-[13px] font-semibold m-0 mb-0.5 leading-snug">{h.title}</p>
              <p className="text-[11px] text-[#A8A29E] m-0">
                {h.source} · {h.published || 'Recent'}
              </p>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 mb-4.5">
        <p className="text-[12px] font-bold text-[#57534E] m-0 mb-2">Marketing analysis prompt</p>
        <textarea
          value={analysisPrompt}
          onChange={(e) => setAnalysisPrompt(e.target.value)}
          rows={3}
          className="w-full box-border border border-[#E4E2DC] rounded-xl px-3 py-2.5 text-[13px] resize-y outline-none mb-2"
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {ANALYSIS_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setAnalysisPrompt(p)}
              className="text-[11px] px-2.5 py-1 rounded-full border border-[#E4E2DC] bg-[#FAFAF8] text-[#57534E] cursor-pointer"
            >
              {p.length > 48 ? `${p.slice(0, 48)}…` : p}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void runAnalysis()}
          disabled={analyzing || !query.trim()}
          className="flex items-center gap-2 px-4.5 py-2.5 rounded-[11px] text-[13px] font-bold text-white border-none cursor-pointer"
          style={{ background: def.accent, opacity: analyzing || !query.trim() ? 0.6 : 1 }}
        >
          {analyzing ? 'Analyzing with Market agent…' : 'Generate marketing analysis'}
        </button>
        {analysisError && <p className="text-[13px] text-[#B42318] mt-3 mb-0">⚠️ {analysisError}</p>}
      </div>

      {result && (
        <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
          <div className="px-5.5 py-4.5 border-b border-[#F0EEE8]">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#A8A29E] mb-1.5">
              <span className="font-mono">Market agent · {sourceLabel} · v0.3</span>
              {result.confidence && <ConfidenceBadge confidence={result.confidence} />}
            </div>
            <h2 className="text-[16px] font-bold m-0 mb-2">{result.title ?? 'Marketing analysis'}</h2>
            <GmailComposeButton
              subject={result.title ?? `Market analysis — ${query}`}
              body={result.body}
              citationIds={result.citations.map((c) => c.id)}
              uncertaintyFlags={result.uncertaintyFlags}
              compact
            />
            {result.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {result.citations.map((c) => (
                  <CitationChip key={c.id} citation={c} accent={def.accent} />
                ))}
              </div>
            )}
          </div>
          <div className="p-5.5">
            <AtlasMarkdown>{result.body}</AtlasMarkdown>
          </div>
          {result.uncertaintyFlags && (
            <div className="mx-5.5 mb-5.5 rounded-xl px-4 py-3 bg-[#FFF4EA] border border-[#F5D9B4] text-[#92400e] text-[12.5px]">
              <p className="font-bold m-0 mb-1">Uncertainty flags</p>
              <p className="m-0">{result.uncertaintyFlags}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
