import { useCallback, useEffect, useState } from 'react';
import {
  addCompanyCustomMetric,
  addTrackedCompany,
  AtlasApiError,
  deleteTrackedCompany,
  fetchCompetitorConfig,
  fetchCompetitorMetrics,
  type CompanyTrack,
  type EarningsMetric,
  type ResolvedCompanyMetrics,
  type StockMetric,
} from '../lib/api';

const COLORS = ['#9065B0', '#37352F', '#448361', '#337EA9', '#D9730D', '#C4554D', '#9B9A97'];

function colorForIndex(i: number) {
  return COLORS[i % COLORS.length];
}

function formatShortDate(unixSec: number) {
  return new Date(unixSec * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function niceYTicks(min: number, max: number, count = 3): number[] {
  const range = max - min || 1;
  const step = range / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round((min + step * i) * 100) / 100);
}

function StockChart({
  series,
  color,
  currency,
}: {
  series: { t: number; close: number }[];
  color: string;
  currency: string;
}) {
  if (series.length < 2) return null;

  const plotW = 220;
  const plotH = 72;
  const margin = { top: 8, right: 8, bottom: 28, left: 44 };
  const w = margin.left + plotW + margin.right;
  const h = margin.top + plotH + margin.bottom;

  const closes = series.map((p) => p.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const yTicks = niceYTicks(min, max, 3);

  const xAt = (i: number) => margin.left + (i / (series.length - 1)) * plotW;
  const yAt = (price: number) => margin.top + plotH - ((price - min) / range) * plotH;

  const linePoints = series.map((p, i) => `${xAt(i)},${yAt(p.close)}`).join(' ');

  const xLabels = [
    { i: 0, label: formatShortDate(series[0].t) },
    { i: Math.floor((series.length - 1) / 2), label: formatShortDate(series[Math.floor((series.length - 1) / 2)].t) },
    { i: series.length - 1, label: formatShortDate(series[series.length - 1].t) },
  ];

  return (
    <figure className="m-0 mt-2">
      <figcaption className="text-[10px] text-[#78716C] mb-1 leading-snug">
        <strong>What this shows:</strong> daily <strong>closing stock price</strong> ({currency}) — X = trading day, Y =
        price. Useful for spotting recent market moves vs. your narrative on the competitor.
      </figcaption>
      <svg
        width="100%"
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="block max-w-full"
        role="img"
        aria-label={`Stock closing price from ${formatShortDate(series[0].t)} to ${formatShortDate(series[series.length - 1].t)}`}
      >
        <text
          x={margin.left - 6}
          y={margin.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90, ${margin.left - 6}, ${margin.top + plotH / 2})`}
          className="fill-[#78716C]"
          style={{ fontSize: 9, fontWeight: 600 }}
        >
          Close ({currency})
        </text>

        {yTicks.map((tick) => {
          const y = yAt(tick);
          return (
            <g key={tick}>
              <line x1={margin.left} y1={y} x2={margin.left + plotW} y2={y} stroke="#E4E2DC" strokeWidth="1" />
              <text x={margin.left - 4} y={y + 3} textAnchor="end" className="fill-[#57534E]" style={{ fontSize: 9 }}>
                {tick.toFixed(max - min < 2 ? 2 : 0)}
              </text>
            </g>
          );
        })}

        <line
          x1={margin.left}
          y1={margin.top + plotH}
          x2={margin.left + plotW}
          y2={margin.top + plotH}
          stroke="#A8A29E"
          strokeWidth="1"
        />
        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke="#A8A29E" strokeWidth="1" />

        <polyline fill="none" stroke={color} strokeWidth="2" points={linePoints} />

        {xLabels.map(({ i, label }) => (
          <text
            key={i}
            x={xAt(i)}
            y={margin.top + plotH + 16}
            textAnchor={i === 0 ? 'start' : i === series.length - 1 ? 'end' : 'middle'}
            className="fill-[#57534E]"
            style={{ fontSize: 9 }}
          >
            {label}
          </text>
        ))}
        <text
          x={margin.left + plotW / 2}
          y={h - 2}
          textAnchor="middle"
          className="fill-[#78716C]"
          style={{ fontSize: 9, fontWeight: 600 }}
        >
          Trading day
        </text>
      </svg>
    </figure>
  );
}

function EarningsBarChart({ earnings, accent }: { earnings: EarningsMetric; accent: string }) {
  const plotH = 80;
  const bars = earnings.yoyQuarters;
  const values = bars.map((q) => q.yoyPct);
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 5);
  const yMax = maxAbs;
  const yMin = -maxAbs;
  const yTicks = [yMin, 0, yMax].map((v) => Math.round(v * 10) / 10);

  const barHeight = (pct: number) => {
    if (pct >= 0) return (pct / yMax) * (plotH / 2);
    return (Math.abs(pct) / Math.abs(yMin)) * (plotH / 2);
  };

  return (
    <figure className="m-0 mt-3">
      <figcaption className="text-[10px] text-[#78716C] mb-1 leading-snug">
        <strong>EPS YoY %</strong> for calendar year <strong>{earnings.calendarYear}</strong> (SEC) — each bar compares
        that quarter’s diluted EPS to the <strong>same quarter last year</strong>. Y = % change, X = quarter.
      </figcaption>
      <p className="text-[12px] m-0 mb-2">
        Latest ({earnings.latestQuarter}):{' '}
        <strong>
          {earnings.latestYoyPct >= 0 ? '+' : ''}
          {earnings.latestYoyPct}%
        </strong>{' '}
        YoY · YTD avg:{' '}
        <strong>
          {earnings.avgYoyPctCurrentYear >= 0 ? '+' : ''}
          {earnings.avgYoyPctCurrentYear}%
        </strong>
      </p>
      <div className="flex gap-2 items-stretch">
        <div className="shrink-0 flex flex-col justify-between text-right pr-1" style={{ height: plotH, width: 36 }}>
          {[...yTicks].reverse().map((tick) => (
            <span key={tick} className="text-[9px] font-mono text-[#57534E] leading-none">
              {tick > 0 ? '+' : ''}
              {tick}%
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative border-l border-b border-[#A8A29E] pl-2" style={{ height: plotH }}>
            <div
              className="absolute left-2 right-0 border-t border-[#78716C]"
              style={{ top: plotH / 2 }}
              title="0% YoY"
            />
            <div className="relative flex items-end justify-around gap-1 h-full pb-0">
              {bars.map((q) => {
                const h = barHeight(q.yoyPct);
                const positive = q.yoyPct >= 0;
                return (
                  <div key={q.frame} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                    {positive ? (
                      <div className="flex flex-col items-center justify-end w-full" style={{ height: plotH / 2 }}>
                        <span className="text-[8px] font-mono font-bold text-[#3f3d38] mb-0.5">
                          {q.yoyPct >= 0 ? '+' : ''}
                          {q.yoyPct}%
                        </span>
                        <div
                          className="w-full rounded-t-md"
                          style={{ height: Math.max(h, 3), background: accent }}
                          title={`${q.quarter} ${q.year}: $${q.epsCurrent} vs $${q.epsPriorYear} prior year`}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col w-full" style={{ height: plotH }}>
                        <div className="flex flex-col justify-start items-center w-full" style={{ height: plotH / 2 }} />
                        <div className="flex flex-col justify-start items-center w-full" style={{ height: plotH / 2 }}>
                          <div
                            className="w-full rounded-b-md"
                            style={{ height: Math.max(h, 3), background: '#dc2626' }}
                            title={`${q.quarter} ${q.year}: $${q.epsCurrent} vs $${q.epsPriorYear} prior year`}
                          />
                          <span className="text-[8px] font-mono font-bold text-[#3f3d38] mt-0.5">{q.yoyPct}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-1 pl-2 mt-1">
            {bars.map((q) => (
              <div key={`${q.frame}-lbl`} className="flex-1 text-center min-w-0">
                <span className="text-[9px] text-[#57534E] block">{q.quarter}</span>
                <span className="text-[8px] text-[#A8A29E]">${q.epsCurrent} vs ${q.epsPriorYear}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-semibold text-center mt-1 m-0 text-[#78716C]">
            Quarter {earnings.calendarYear} (X) · EPS YoY % (Y)
          </p>
        </div>
      </div>
    </figure>
  );
}

function AllCompetitorsYoyChart({
  companies,
  accent,
}: {
  companies: ResolvedCompanyMetrics[];
  accent: string;
}) {
  const items = companies.map((c, i) => ({
    name: c.name,
    color: colorForIndex(i),
    yoy: c.earnings?.avgYoyPctCurrentYear ?? null,
    marketTicker: c.marketTicker,
    isProxy: c.marketTickerIsProxy,
  }));
  const withData = items.filter((x): x is typeof x & { yoy: number } => x.yoy != null);
  if (withData.length === 0) return null;
  const plotH = 96;
  const values = withData.map((x) => x.yoy);
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 5);
  const yMax = maxAbs;
  const yMin = -maxAbs;
  const calendarYear = companies.find((c) => c.earnings)?.earnings?.calendarYear ?? new Date().getFullYear();

  return (
    <figure className="m-0 mb-4">
      <figcaption className="text-[10px] text-[#78716C] mb-2 leading-snug">
        <strong>All tracked competitors</strong> — average <strong>EPS YoY %</strong> across reported quarters in{' '}
        {calendarYear}. Private names use a <strong>proxy ticker</strong> (editable in config); label shows symbol used.
      </figcaption>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between shrink-0 text-right pr-1" style={{ height: plotH, width: 40 }}>
          <span className="text-[9px] font-mono text-[#57534E]">+{yMax}%</span>
          <span className="text-[9px] font-mono text-[#57534E]">0%</span>
          <span className="text-[9px] font-mono text-[#57534E]">{yMin}%</span>
        </div>
        <div className="flex-1 flex items-end gap-2 border-l border-b border-[#A8A29E] pl-2 pb-1 relative" style={{ height: plotH }}>
          <div className="absolute left-2 right-0 border-t border-dashed border-[#78716C]" style={{ bottom: '50%' }} />
          {items.map((item) => {
            const yoy = item.yoy;
            const pct = yoy ?? 0;
            const height = yoy == null ? 4 : (Math.abs(pct) / maxAbs) * (plotH / 2 - 4);
            const positive = pct >= 0;
            return (
              <div key={item.name} className="flex-1 flex flex-col items-center justify-end min-w-0 h-full">
                {yoy == null ? (
                  <span className="text-[8px] text-[#A8A29E] mb-1">n/a</span>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-[#3f3d38] mb-0.5">
                    {yoy >= 0 ? '+' : ''}
                    {yoy}%
                  </span>
                )}
                <div className="flex flex-col justify-end w-full items-center" style={{ height: plotH / 2 }}>
                  {yoy != null && positive && (
                    <div
                      className="w-full rounded-t-md min-h-[3px]"
                      style={{ height, background: item.color }}
                      title={`${item.name} (${item.marketTicker}): avg YoY ${yoy}%`}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-start w-full items-center" style={{ height: plotH / 2 }}>
                  {yoy != null && !positive && (
                    <div
                      className="w-full rounded-b-md min-h-[3px]"
                      style={{ height, background: '#dc2626' }}
                    />
                  )}
                </div>
                <span className="text-[8px] text-[#57534E] truncate w-full text-center mt-1" title={item.name}>
                  {item.name.split(' ')[0]}
                </span>
                {item.marketTicker && (
                  <span className="text-[7px] font-mono text-[#A8A29E]">
                    {item.isProxy ? '~' : ''}
                    {item.marketTicker}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[9px] font-semibold text-center mt-1 m-0" style={{ color: accent }}>
        Competitor (X) · Avg EPS YoY % this year (Y)
      </p>
    </figure>
  );
}

function PriceAndEarningsCharts({
  name,
  marketTicker,
  marketTickerIsProxy,
  stock,
  earnings,
  color,
  accent,
}: {
  name: string;
  marketTicker: string;
  marketTickerIsProxy: boolean;
  stock: StockMetric | null;
  earnings: EarningsMetric | null;
  color: string;
  accent: string;
}) {
  return (
    <div className="border border-[#E4E2DC] rounded-xl p-3 bg-white/80">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
        <span className="font-bold text-[14px]">{name}</span>
        {marketTicker && (
          <span className="text-[11px] font-mono text-[#78716C]">
            {marketTickerIsProxy ? `proxy ${marketTicker}` : marketTicker}
          </span>
        )}
      </div>
      {!marketTicker && (
        <p className="text-[12px] text-[#78716C] m-0 italic">Add a ticker (or save to apply auto proxy) for market charts.</p>
      )}
      {stock ? (
        <div className="mb-1">
          <p className="text-[10px] font-bold text-[#78716C] m-0 mb-1 uppercase">Share price · Yahoo Finance</p>
          <p className="text-[16px] font-extrabold m-0 leading-none">
            {stock.currency} {stock.price.toFixed(2)}
            <span
              className="text-[11px] font-bold ml-2"
              style={{ color: stock.changePct1d >= 0 ? '#1A9E6E' : '#dc2626' }}
            >
              {stock.changePct1d >= 0 ? '+' : ''}
              {stock.changePct1d}% vs prior day
            </span>
          </p>
          <StockChart series={stock.series} color={color} currency={stock.currency} />
        </div>
      ) : marketTicker ? (
        <p className="text-[12px] text-[#92400e] m-0 mb-2">Stock price unavailable for {marketTicker}.</p>
      ) : null}
      {earnings ? (
        <EarningsBarChart earnings={earnings} accent={accent} />
      ) : marketTicker ? (
        <p className="text-[12px] text-[#92400e] m-0">Earnings YoY unavailable for {marketTicker}.</p>
      ) : null}
    </div>
  );
}

interface Props {
  accent: string;
  accentBg: string;
}

export function CompetitorPulseWidget({ accent, accentBg }: Props) {
  const [companies, setCompanies] = useState<ResolvedCompanyMetrics[]>([]);
  const [config, setConfig] = useState<CompanyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newTicker, setNewTicker] = useState('');
  const [newQuery, setNewQuery] = useState('');
  const [metricCompanyId, setMetricCompanyId] = useState('');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricValue, setMetricValue] = useState('');
  const [metricUnit, setMetricUnit] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [metrics, cfg] = await Promise.all([fetchCompetitorMetrics(), fetchCompetitorConfig()]);
      setCompanies(metrics.companies);
      setConfig(cfg.companies);
      setMetricCompanyId((prev) => prev || cfg.companies[0]?.id || '');
    } catch (e) {
      setError(e instanceof AtlasApiError ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onAddCompany = async () => {
    if (!newName.trim()) return;
    try {
      await addTrackedCompany(newName.trim(), newTicker.trim(), newQuery.trim() || newName.trim());
      setNewName('');
      setNewTicker('');
      setNewQuery('');
      await load();
    } catch (e) {
      setError(e instanceof AtlasApiError ? e.message : String(e));
    }
  };

  const onAddMetric = async () => {
    if (!metricCompanyId || !metricLabel.trim() || !metricValue.trim()) return;
    try {
      await addCompanyCustomMetric(metricCompanyId, metricLabel.trim(), metricValue.trim(), metricUnit.trim());
      setMetricLabel('');
      setMetricValue('');
      setMetricUnit('');
      await load();
    } catch (e) {
      setError(e instanceof AtlasApiError ? e.message : String(e));
    }
  };

  const onRemove = async (id: string) => {
    try {
      await deleteTrackedCompany(id);
      await load();
    } catch (e) {
      setError(e instanceof AtlasApiError ? e.message : String(e));
    }
  };

  const chartCompanies = companies.filter((c) => c.marketTicker);

  return (
    <section className="bg-white border border-[#E4E2DC] rounded-2xl p-5 mb-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h2 className="text-[15px] font-bold m-0 mb-1">Competitor pulse</h2>
          <p className="text-[12px] text-[#78716C] m-0">
            Every tracked competitor appears below. <strong>Share price</strong> (Yahoo) +{' '}
            <strong>EPS YoY %</strong> by quarter for the current calendar year (SEC). Private companies use a{' '}
            <strong>proxy ticker</strong> (~symbol) until you set their own in the editor.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditorOpen((o) => !o)}
            className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-[#E4E2DC] bg-[#FAFAF8] cursor-pointer"
          >
            {editorOpen ? 'Hide editor' : 'Add companies & metrics'}
          </button>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="text-[12px] font-bold px-3 py-1.5 rounded-lg border border-[#E4E2DC] cursor-pointer"
            style={{ background: accentBg, color: accent }}
          >
            {loading ? 'Loading…' : 'Refresh data'}
          </button>
        </div>
      </div>

      {error && <p className="text-[13px] text-[#B42318] mb-3">⚠️ {error}</p>}

      {editorOpen && (
        <div className="border border-[#E4E2DC] rounded-xl p-4 mb-4 bg-[#FAFAF8]">
          <p className="text-[12px] font-bold m-0 mb-3">Track a company</p>
          <div className="grid gap-2 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))' }}>
            <input
              placeholder="Company name *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2.5 py-2 text-[13px]"
            />
            <input
              placeholder="Ticker (e.g. GOOGL)"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2.5 py-2 text-[13px]"
            />
            <input
              placeholder="News query (optional, for headlines)"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2.5 py-2 text-[13px]"
            />
          </div>
          <button
            type="button"
            onClick={() => void onAddCompany()}
            className="text-[12px] font-bold px-3 py-1.5 rounded-lg text-white border-none cursor-pointer mb-4"
            style={{ background: accent }}
          >
            Add company
          </button>

          <p className="text-[12px] font-bold m-0 mb-2">Custom metric (manual / external source)</p>
          <div className="flex flex-wrap gap-2 items-end mb-2">
            <select
              value={metricCompanyId}
              onChange={(e) => setMetricCompanyId(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2 py-2 text-[13px] min-w-[140px]"
            >
              {config.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Label (e.g. G2 score)"
              value={metricLabel}
              onChange={(e) => setMetricLabel(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2.5 py-2 text-[13px] flex-1 min-w-[120px]"
            />
            <input
              placeholder="Value"
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2.5 py-2 text-[13px] w-24"
            />
            <input
              placeholder="Unit"
              value={metricUnit}
              onChange={(e) => setMetricUnit(e.target.value)}
              className="border border-[#E4E2DC] rounded-lg px-2.5 py-2 text-[13px] w-20"
            />
            <button
              type="button"
              onClick={() => void onAddMetric()}
              className="text-[12px] font-bold px-3 py-2 rounded-lg border border-[#E4E2DC] bg-white cursor-pointer"
            >
              Add metric
            </button>
          </div>

          <p className="text-[11px] text-[#A8A29E] m-0">Tracked: {config.map((c) => c.name).join(', ') || 'none'}</p>
        </div>
      )}

      {!loading && companies.length > 0 && (
        <>
          <div className="rounded-xl px-3 py-4 mb-4" style={{ background: accentBg }}>
            <p className="text-[11px] font-bold uppercase tracking-wide m-0 mb-2" style={{ color: accent }}>
              Stock price &amp; EPS YoY · all competitors
            </p>
            <AllCompetitorsYoyChart companies={companies} accent={accent} />
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
              {companies.map((c, idx) => (
                <PriceAndEarningsCharts
                  key={c.id}
                  name={c.name}
                  marketTicker={c.marketTicker}
                  marketTickerIsProxy={c.marketTickerIsProxy}
                  stock={c.stock}
                  earnings={c.earnings}
                  color={colorForIndex(idx)}
                  accent={accent}
                />
              ))}
            </div>
            {chartCompanies.length === 0 && (
              <p className="text-[13px] text-[#57534E] m-0 mt-2">
                Refresh after save — proxy tickers are assigned automatically for default competitors.
              </p>
            )}
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))' }}>
            {companies.map((c, i) => {
              const color = colorForIndex(i);
              return (
                <div key={c.id} className="border border-[#E4E2DC] rounded-xl p-3.5 relative">
                  <button
                    type="button"
                    onClick={() => void onRemove(c.id)}
                    className="absolute top-2 right-2 text-[10px] text-[#A8A29E] border-none bg-transparent cursor-pointer hover:text-[#B42318]"
                    title="Remove company"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-2 mb-2 pr-6">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    <span className="font-bold text-[14px]">{c.name}</span>
                    {c.ticker && <span className="text-[11px] font-mono text-[#78716C]">{c.ticker}</span>}
                    {!c.ticker && c.marketTicker && c.marketTickerIsProxy && (
                      <span className="text-[10px] font-mono text-[#A8A29E]">~{c.marketTicker}</span>
                    )}
                  </div>

                  {c.marketTicker && !c.stock && !c.earnings && (
                    <p className="text-[12px] text-[#57534E] m-0 mb-2">Market data failed for {c.marketTicker} — see errors.</p>
                  )}

                  {!c.marketTicker && (
                    <p className="text-[12px] text-[#78716C] m-0 mb-2 italic">No market symbol — add a ticker in the editor.</p>
                  )}

                  {c.stock && (
                    <p className="text-[12px] text-[#57534E] m-0 mb-2">
                      <strong>
                        {c.stock.currency} {c.stock.price.toFixed(2)}
                      </strong>{' '}
                      last close ({c.marketTicker})
                    </p>
                  )}

                  {c.earnings && (
                    <p className="text-[12px] text-[#57534E] m-0 mb-2">
                      Avg EPS YoY {c.earnings.calendarYear}:{' '}
                      <strong>
                        {c.earnings.avgYoyPctCurrentYear >= 0 ? '+' : ''}
                        {c.earnings.avgYoyPctCurrentYear}%
                      </strong>
                    </p>
                  )}

                  {c.customMetrics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {c.customMetrics.map((m) => (
                        <span
                          key={m.id}
                          className="text-[11px] px-2 py-1 rounded-md bg-white border border-[#E4E2DC] text-[#3f3d38]"
                        >
                          {m.label}: <strong>{m.value}</strong>
                          {m.unit}
                        </span>
                      ))}
                    </div>
                  )}

                  {c.latestHeadline ? (
                    <a
                      href={c.latestHeadline.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[#3f3d38] leading-snug hover:underline block"
                    >
                      {c.latestHeadline.title}
                    </a>
                  ) : (
                    !c.stock && <p className="text-[12px] text-[#A8A29E] m-0">No headlines this week.</p>
                  )}

                  {c.errors.length > 0 && (
                    <p className="text-[11px] text-[#92400e] mt-2 mb-0">{c.errors.join(' · ')}</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {loading && companies.length === 0 && (
        <p className="text-[13px] text-[#A8A29E] py-6 text-center m-0">Loading real competitor metrics…</p>
      )}
    </section>
  );
}
