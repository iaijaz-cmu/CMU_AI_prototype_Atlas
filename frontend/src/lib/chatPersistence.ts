import type { HeaderMessage, HeaderThreadKey } from './types';
import { emptyHeaderThreads, HEADER_THREAD_KEYS } from './headerChat';

const STORAGE_KEY = 'atlas-header-threads-v1';

function isHeaderMessage(raw: unknown): raw is HeaderMessage {
  if (!raw || typeof raw !== 'object') return false;
  const m = raw as HeaderMessage;
  if ((m.role !== 'user' && m.role !== 'assistant') || typeof m.text !== 'string') return false;
  if (m.at !== undefined && typeof m.at !== 'number') return false;
  return true;
}

export function loadPersistedHeaderThreads(): Record<HeaderThreadKey, HeaderMessage[]> {
  const base = emptyHeaderThreads();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    for (const key of HEADER_THREAD_KEYS) {
      const arr = parsed[key];
      if (!Array.isArray(arr)) continue;
      base[key] = arr.filter(isHeaderMessage).slice(-80);
    }
  } catch {
    /* ignore corrupt storage */
  }
  return base;
}

export function persistHeaderThreads(threads: Record<HeaderThreadKey, HeaderMessage[]>): void {
  try {
    const trimmed: Record<HeaderThreadKey, HeaderMessage[]> = { ...emptyHeaderThreads() };
    for (const key of HEADER_THREAD_KEYS) {
      trimmed[key] = (threads[key] ?? []).slice(-80);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* quota / private mode */
  }
}

export function clearPersistedHeaderThreads(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
