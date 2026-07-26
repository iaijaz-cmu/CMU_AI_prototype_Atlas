import { useEffect, useState } from 'react';
import { useAtlas } from '../lib/AtlasContext';
import { AtlasApiError, fetchCompetitorMetrics, type G2Metric, type ResolvedCompanyMetrics } from '../lib/api';
import { CompetitorBrandMark } from './CompetitorBrandMark';
import { theme } from '../lib/theme';

function fmtPct(n: number | null | undefined, digits = 1) {
  if (n == null || Number.isNaN(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(digits)}%`;
}

function fmtG2(g2: G2Metric | null | undefined) {
  if (g2?.score == null || Number.isNaN(g2.score)) return '—';
  return `${g2.score.toFixed(1)}/${g2.maxScore ?? 5}`;
}

function MiniSparkline({ positive }: { positive: boolean | null }) {
  const stroke = positive === false ? '#C4554D' : positive === true ? theme.accent : theme.gold;
  return (
    <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M0 14 C8 6 16 18 24 10 S40 4 48 12"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function CompanyRow({ c }: { c: ResolvedCompanyMetrics }) {
  const change = c.stock?.changePct1d;
  const changeUp = change == null ? null : change >= 0;

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-n-inset/60 hover:bg-white border border-transparent hover:border-n-border/80 transition-all">
      <CompetitorBrandMark companyId={c.id} name={c.name} size={40} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-n-text m-0 truncate">{c.name}</p>
        <p className="text-[10px] text-n-text-muted m-0">
          {c.marketTicker || '—'}
          {c.marketTickerIsProxy ? ' · proxy' : ''}
        </p>
      </div>
      <MiniSparkline positive={changeUp} />
      <div className="text-right shrink-0 min-w-[52px]">
        <p className="text-[9px] uppercase tracking-wider text-n-text-muted m-0 mb-0.5">1d</p>
        <p
          className="text-[13px] font-bold tabular-nums m-0"
          style={{ color: changeUp === false ? '#C4554D' : changeUp === true ? '#3D8B6E' : theme.text }}
        >
          {fmtPct(change)}
        </p>
      </div>
      <div className="text-right shrink-0 min-w-[52px]">
        <p className="text-[9px] uppercase tracking-wider text-n-text-muted m-0 mb-0.5">G2</p>
        {c.g2?.url ? (
          <a
            href={c.g2.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-bold tabular-nums text-n-text m-0 hover:text-n-accent"
            title="View on G2"
          >
            {fmtG2(c.g2)}
          </a>
        ) : (
          <p className="text-[13px] font-bold tabular-nums text-n-text m-0">{fmtG2(c.g2)}</p>
        )}
      </div>
    </div>
  );
}

export function HomeCompetitorSnapshotWidget() {
  const { goAgent, goTool } = useAtlas();
  const [companies, setCompanies] = useState<ResolvedCompanyMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void fetchCompetitorMetrics()
      .then((res) => {
        if (cancelled) return;
        setCompanies(res.companies.slice(0, 5));
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof AtlasApiError ? err.message : 'Could not load metrics');
        setCompanies([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const avg1d =
    companies.length > 0
      ? companies.reduce((s, c) => s + (c.stock?.changePct1d ?? 0), 0) /
        Math.max(1, companies.filter((c) => c.stock?.changePct1d != null).length)
      : null;

  return (
    <section className="atlas-widget h-full flex flex-col min-h-[320px] overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-n-border/60 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold text-n-text m-0 tracking-tight truncate">Competitors</h2>
          <p className="text-[11px] text-n-text-muted m-0 mt-1">Live G2 ratings · stock pulse</p>
        </div>
        <button
          type="button"
          onClick={() => {
            goAgent('market');
            goTool('dashboard');
          }}
          className="text-[11px] font-semibold px-3.5 py-2 rounded-full cursor-pointer shrink-0 border border-n-border bg-white text-n-text hover:bg-n-surface-2 transition-colors"
        >
          View all
        </button>
      </div>

      {!loading && !error && companies.length > 0 && (
        <div className="px-5 pt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-n-accent-soft border border-[rgba(227,107,82,0.12)] p-4">
            <p className="text-[10px] uppercase tracking-wider text-n-accent m-0 mb-1 font-semibold">Avg 1d move</p>
            <p className="text-[24px] font-semibold text-n-text m-0 leading-none tabular-nums">{fmtPct(avg1d)}</p>
            <MiniSparkline positive={avg1d != null ? avg1d >= 0 : null} />
          </div>
          <div className="rounded-2xl bg-white border border-n-border p-4 flex flex-col justify-center">
            <p className="text-[10px] uppercase tracking-wider text-n-text-muted m-0 mb-1 font-semibold">Tracked</p>
            <p className="text-[24px] font-semibold text-n-text m-0 leading-none tabular-nums">{companies.length}</p>
            <p className="text-[10px] text-n-text-muted m-0 mt-1">in watchlist</p>
          </div>
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col min-h-0 gap-2">
        {loading && <p className="text-[12px] text-n-text-muted m-0 px-1">Loading metrics…</p>}
        {error && <p className="text-[12px] text-n-text-2 m-0 rounded-2xl bg-n-inset p-4">{error}</p>}
        {!loading && !error && companies.map((c) => <CompanyRow key={c.id} c={c} />)}
      </div>
    </section>
  );
}
