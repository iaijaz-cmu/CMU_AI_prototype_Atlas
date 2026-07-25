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
}

export class AtlasApiError extends Error {}

export async function generate({ message, agent, scope }: GenerateParams): Promise<GenerateResult> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, agent: agent ?? null, scope: scope ?? null }),
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
