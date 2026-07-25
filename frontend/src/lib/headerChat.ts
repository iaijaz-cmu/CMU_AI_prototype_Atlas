import { AGENT_DEFS } from './data';
import type { AgentId, HeaderMessage, HeaderThreadKey } from './types';

export const HEADER_THREAD_KEYS: HeaderThreadKey[] = ['home', 'product', 'engineering', 'market', 'sales'];

export interface RecentConversation {
  key: HeaderThreadKey;
  label: string;
  preview: string;
  messageCount: number;
  lastAt: number;
}

export function conversationLabel(key: HeaderThreadKey): string {
  if (key === 'home') return 'Workspace';
  return AGENT_DEFS.find((a) => a.id === key)?.name ?? key;
}

function threadLastAt(msgs: HeaderMessage[]): number {
  let max = 0;
  msgs.forEach((m, i) => {
    const t = m.at ?? i;
    if (t > max) max = t;
  });
  return max;
}

export function listRecentConversations(
  threads: Record<HeaderThreadKey, HeaderMessage[]>,
  limit = 5,
): RecentConversation[] {
  const items: RecentConversation[] = [];
  for (const key of HEADER_THREAD_KEYS) {
    const msgs = threads[key] ?? [];
    if (msgs.length === 0) continue;
    const last = msgs[msgs.length - 1]!;
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    const raw = (lastUser?.text ?? last.text).replace(/\s+/g, ' ').trim();
    const preview = raw.length > 100 ? `${raw.slice(0, 100)}…` : raw;
    items.push({
      key,
      label: conversationLabel(key),
      preview,
      messageCount: msgs.length,
      lastAt: threadLastAt(msgs),
    });
  }
  return items.sort((a, b) => b.lastAt - a.lastAt).slice(0, limit);
}

export function emptyHeaderThreads(): Record<HeaderThreadKey, HeaderMessage[]> {
  return {
    home: [],
    product: [],
    engineering: [],
    market: [],
    sales: [],
  };
}

export function headerDisplayThreadKey(currentAgentId: AgentId | null, _headerTargetAgent: AgentId | null): HeaderThreadKey {
  if (currentAgentId) return currentAgentId;
  return 'home';
}

export function headerSendThreadKey(
  currentAgentId: AgentId | null,
  headerTargetAgent: AgentId | null,
): HeaderThreadKey {
  if (currentAgentId) return headerTargetAgent ?? currentAgentId;
  return 'home';
}

/** Where homepage ask-bar messages are stored (browser-local threads). */
export function headerHomeSendThreadKey(
  homeActiveThreadKey: HeaderThreadKey | null,
  headerTargetAgent: AgentId | null,
): HeaderThreadKey {
  if (headerTargetAgent) return headerTargetAgent;
  if (homeActiveThreadKey) return homeActiveThreadKey;
  return 'home';
}

export function headerHomeThreadFromTag(chatTag: AgentId | null): HeaderThreadKey {
  return chatTag ?? 'home';
}

export function headerEffectiveAgent(
  currentAgentId: AgentId | null,
  headerTargetAgent: AgentId | null,
): AgentId | null {
  return headerTargetAgent ?? currentAgentId;
}
