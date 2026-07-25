import type { AgentId, Citation, Confidence } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

export interface GenerateResult {
  content: string;
  body: string;
  title: string | null;
  confidence: Confidence | null;
  uncertaintyFlags: string | null;
  citations: Citation[];
  themes: string[];
}

export interface GenerateParams {
  message: string;
  agent?: AgentId | null;
  scope?: string | null;
  history?: { role: 'user' | 'assistant'; text: string }[];
}

export class AtlasApiError extends Error {}

export async function generate({ message, agent, scope, history }: GenerateParams): Promise<GenerateResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        agent: agent ?? null,
        scope: scope ?? null,
        history: history ?? [],
      }),
    });
  } catch {
    throw new AtlasApiError(
      `Couldn't reach the Atlas API at ${API_BASE_URL}. Is the backend running? (cd backend/api && uvicorn main:app --reload --port 8787)`,
    );
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* non-JSON error body, fall back to statusText */
    }
    throw new AtlasApiError(detail);
  }

  return res.json();
}

export interface SlackMessage {
  ts: string;
  user?: string;
  text: string;
  threadTs?: string | null;
}

export interface SlackStatus {
  configured: boolean;
  demoMode?: boolean;
  eventsReady: boolean;
  channel: { id: string; name?: string; isMember?: boolean } | null;
  error?: string;
}

export interface SlackMessagesResponse {
  channel: { id: string; name?: string; is_member?: boolean };
  messages: SlackMessage[];
  demoMode?: boolean;
}

async function slackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new AtlasApiError(`Couldn't reach the Atlas API at ${API_BASE_URL}.`);
  }
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new AtlasApiError(detail);
  }
  return res.json();
}

export function fetchSlackStatus(): Promise<SlackStatus> {
  return slackFetch('/api/slack/status');
}

export function fetchSlackMessages(limit = 20): Promise<SlackMessagesResponse> {
  return slackFetch(`/api/slack/messages?limit=${limit}`);
}

export function slackRespond(
  question: string,
  postToSlack = false,
  history: { role: 'user' | 'assistant'; text: string }[] = [],
): Promise<GenerateResult> {
  return slackFetch('/api/slack/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, postToSlack, history }),
  });
}

export type NewsSourceId = 'google' | 'bloomberg';

export interface NewsHeadline {
  title: string;
  url: string;
  published: string;
  source: string;
}

export interface NewsHeadlinesResponse {
  query: string;
  source: NewsSourceId;
  headlines: NewsHeadline[];
}

export function fetchNewsHeadlines(
  query: string,
  source: NewsSourceId = 'google',
  limit = 8,
): Promise<NewsHeadlinesResponse> {
  const params = new URLSearchParams({ q: query, source, limit: String(limit) });
  return slackFetch(`/api/news/headlines?${params.toString()}`);
}

export function analyzeMarketNews(params: {
  query: string;
  source: NewsSourceId;
  question?: string;
  limit?: number;
}): Promise<GenerateResult> {
  return slackFetch('/api/news/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: params.query,
      source: params.source,
      question: params.question ?? null,
      limit: params.limit ?? 8,
    }),
  });
}

export interface CustomMetric {
  id: string;
  label: string;
  value: string;
  unit: string;
}

export interface CompanyTrack {
  id: string;
  name: string;
  ticker: string;
  chartTicker?: string;
  newsQuery: string;
  metricTypes: string[];
  customMetrics: CustomMetric[];
}

export interface CompetitorConfig {
  companies: CompanyTrack[];
}

export interface StockSeriesPoint {
  t: number;
  close: number;
}

export interface StockMetric {
  ticker: string;
  currency: string;
  price: number;
  changePct1d: number;
  series: StockSeriesPoint[];
}

export interface EarningsYoyQuarter {
  quarter: string;
  year: number;
  frame: string;
  epsCurrent: number;
  epsPriorYear: number;
  yoyPct: number;
}

export interface EarningsMetric {
  ticker: string;
  unit: string;
  source: string;
  calendarYear: number;
  latestYoyPct: number;
  avgYoyPctCurrentYear: number;
  latestQuarter: string;
  yoyQuarters: EarningsYoyQuarter[];
}

export interface ResolvedCompanyMetrics {
  id: string;
  name: string;
  ticker: string;
  chartTicker: string;
  marketTicker: string;
  marketTickerIsProxy: boolean;
  newsQuery: string;
  customMetrics: CustomMetric[];
  stock: StockMetric | null;
  earnings: EarningsMetric | null;
  news: { count7d: number; headlines: NewsHeadline[] } | null;
  latestHeadline: NewsHeadline | null;
  errors: string[];
}

export interface CompetitorMetricsResponse {
  source: string;
  companies: ResolvedCompanyMetrics[];
}

export function fetchCompetitorConfig(): Promise<CompetitorConfig> {
  return slackFetch('/api/competitors/config');
}

export function saveCompetitorConfig(config: CompetitorConfig): Promise<CompetitorConfig> {
  return slackFetch('/api/competitors/config', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
}

export function fetchCompetitorMetrics(): Promise<CompetitorMetricsResponse> {
  return slackFetch('/api/competitors/metrics');
}

export function addTrackedCompany(name: string, ticker = '', newsQuery = ''): Promise<{ company: CompanyTrack; config: CompetitorConfig }> {
  return slackFetch('/api/competitors/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, ticker, newsQuery }),
  });
}

export function addCompanyCustomMetric(
  companyId: string,
  label: string,
  value: string,
  unit = '',
): Promise<{ metric: CustomMetric; config: CompetitorConfig }> {
  return slackFetch(`/api/competitors/companies/${companyId}/metrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ label, value, unit }),
  });
}

export function deleteTrackedCompany(companyId: string): Promise<CompetitorConfig> {
  return slackFetch(`/api/competitors/companies/${companyId}`, { method: 'DELETE' });
}
