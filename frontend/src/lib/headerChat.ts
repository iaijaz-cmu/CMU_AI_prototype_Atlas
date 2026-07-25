import type { AgentId, HeaderMessage, HeaderThreadKey } from './types';

export const HEADER_THREAD_KEYS: HeaderThreadKey[] = ['home', 'product', 'engineering', 'market', 'sales'];

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

export function headerEffectiveAgent(
  currentAgentId: AgentId | null,
  headerTargetAgent: AgentId | null,
): AgentId | null {
  return headerTargetAgent ?? currentAgentId;
}
