export type AgentId = 'product' | 'engineering' | 'market' | 'sales';

export type ToolIcon =
  | 'grid'
  | 'doc'
  | 'map'
  | 'check'
  | 'chart'
  | 'code'
  | 'ticket'
  | 'decision'
  | 'bolt'
  | 'radar'
  | 'globe'
  | 'signal'
  | 'report'
  | 'shield'
  | 'target'
  | 'trophy'
  | 'deal'
  | 'plug';

export interface ToolDef {
  id: string;
  label: string;
  icon: ToolIcon;
}

export interface AgentDef {
  id: AgentId;
  name: string;
  initial: string;
  tagline: string;
  description: string;
  accent: string;
  accentBg: string;
  shadowColor: string;
  tools: ToolDef[];
}

export interface Stat {
  label: string;
  value: string;
  sub: string;
}

export interface ActivityItem {
  text: string;
  time: string;
}

export interface KnowledgeSource {
  label: string;
  count: number;
  color: string;
}

export type Priority = 'P0' | 'P1' | 'P2';

export interface RoadmapItem {
  id: string;
  theme: string;
  quarter: string;
  priority: Priority;
  status: string;
  features: string[];
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Approval {
  id: string;
  type: string;
  title: string;
  confidence: 'High' | 'Medium' | 'Low';
  sources: number;
  time: string;
  status: ApprovalStatus;
}

export interface EvalVersion {
  v: string;
  score: number;
  delta: string | null;
  color: string;
}

export interface EvalDim {
  label: string;
  color: string;
}

export interface JiraStory {
  id: string;
  title: string;
  points: number;
  type: 'Backend' | 'Frontend';
}

export interface AdrSection {
  label: string;
  text: string;
}

export interface StandupSection {
  status: 'done' | 'progress' | 'blocked';
  label: string;
  color: string;
  items: string[];
}

export interface CompetitiveRow {
  name: string;
  strength: string;
  weakness: string;
  price: string;
  edge: string;
}

export interface TamSegment {
  label: string;
  value: string;
  note: string;
  growth: string;
}

export interface UnitEconomic {
  label: string;
  value: string;
}

export type ImpactLevel = 'High' | 'Medium' | 'Low';

export interface Signal {
  source: string;
  headline: string;
  time: string;
  type: string;
  impact: ImpactLevel;
}

export interface BattleCardContent {
  usp: string[];
  objections: string[];
  counters: string[];
}

export type IcpStatus = 'Hot' | 'Warm' | 'Cold';

export interface IcpAccount {
  name: string;
  score: number;
  segment: string;
  size: string;
  pain: string;
  status: IcpStatus;
}

export interface WinLossStat {
  label: string;
  value: string;
  delta: string;
  color: string;
}

export type IntegrationIcon =
  | 'jira'
  | 'slack'
  | 'confluence'
  | 'drive'
  | 'zendesk'
  | 'salesforce';

export type IntegrationStatus = 'connected' | 'not_connected';

export interface Integration {
  name: string;
  icon: IntegrationIcon;
  desc: string;
  color: string;
  bg: string;
  status: IntegrationStatus;
  lastSync: string | null;
}

export interface DealBriefSection {
  label: string;
  content: string;
}

export interface Citation {
  id: string;
  source: string;
  snippet: string | null;
}

export interface Confidence {
  level: 'High' | 'Medium' | 'Low';
  reason: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  tag?: AgentId | null;
  citations?: Citation[];
  confidence?: Confidence | null;
  uncertaintyFlags?: string | null;
}

export interface HeaderMessage {
  role: 'user' | 'assistant';
  text: string;
  scope?: string | null;
  citations?: Citation[];
  confidence?: Confidence | null;
  uncertaintyFlags?: string | null;
}

export type ChatMode = 'ask' | 'research' | 'build';
