import type {
  AdrSection,
  AgentDef,
  AgentId,
  Approval,
  BattleCardContent,
  CompetitiveRow,
  EvalDim,
  EvalVersion,
  IcpAccount,
  Integration,
  JiraStory,
  KnowledgeSource,
  PortfolioProject,
  RoadmapItem,
  Signal,
  Stat,
  ActivityItem,
  StandupSection,
  TamSegment,
  UnitEconomic,
  WinLossStat,
  DealBriefSection,
  Priority,
  ImpactLevel,
  IcpStatus,
} from './types';
import { agentAccents } from './theme';

/** Homepage hero copy */
export const ATLAS_HOME_COPY = {
  greeting: 'Hello, Ifra.',
  welcomeSubline: 'Welcome to your multi-agent workspace.',
};

/** Example prompts shown in each agent workspace chat */
export const AGENT_CHAT_EXAMPLES: Record<AgentId, { placeholder: string; hint: string }> = {
  product: {
    placeholder: 'Generate a PRD using our roadmap priorities (e.g. notification center, onboarding)…',
    hint: 'Try: “Write a PRD for the 2026 roadmap theme: AI assistant pilot”',
  },
  engineering: {
    placeholder: 'Draft an ADR or technical spec for a system decision…',
    hint: 'Try: “ADR for vector DB selection for the Atlas RAG layer”',
  },
  market: {
    placeholder: 'Competitor analysis, positioning, or marketing strategy…',
    hint: 'Try: “Marketing strategy to win enterprise vs Competitor A and B”',
  },
  sales: {
    placeholder: 'Executive pitch — trends, proof points, why we win…',
    hint: 'Try: “Sales pitch to execs on why our product beats alternatives this quarter”',
  },
};

export const AGENT_DEFS: AgentDef[] = [
  {
    id: 'product',
    name: 'Product',
    initial: 'P',
    tagline: 'From idea to PRD in seconds',
    description:
      'Generate PRDs, roadmaps, and feature specs grounded in org knowledge — Jira, Slack, customer feedback.',
    accent: agentAccents.product.accent,
    accentBg: agentAccents.product.bg,
    shadowColor: agentAccents.product.shadow,
    tools: [
      { id: 'dashboard', label: 'Overview', icon: 'grid' },
      { id: 'prd', label: 'PRD Generator', icon: 'doc' },
      { id: 'roadmap', label: 'Roadmap', icon: 'map' },
      { id: 'approvals', label: 'Approvals', icon: 'check' },
      { id: 'eval', label: 'Eval Scores', icon: 'chart' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    initial: 'E',
    tagline: 'Tech specs that ship',
    description:
      'Break features into Jira stories, generate architecture decision records, and surface blockers before standup.',
    accent: agentAccents.engineering.accent,
    accentBg: agentAccents.engineering.bg,
    shadowColor: agentAccents.engineering.shadow,
    tools: [
      { id: 'dashboard', label: 'Overview', icon: 'grid' },
      { id: 'techspec', label: 'Tech Spec', icon: 'code' },
      { id: 'stories', label: 'Jira Stories', icon: 'ticket' },
      { id: 'adr', label: 'ADR Writer', icon: 'decision' },
      { id: 'standup', label: 'Standup Brief', icon: 'bolt' },
    ],
  },
  {
    id: 'market',
    name: 'Market',
    initial: 'M',
    tagline: 'Intelligence without the legwork',
    description:
      'Competitive analysis, TAM estimates, and market signals synthesized from public sources and internal data.',
    accent: agentAccents.market.accent,
    accentBg: agentAccents.market.bg,
    shadowColor: agentAccents.market.shadow,
    tools: [
      { id: 'dashboard', label: 'Overview', icon: 'grid' },
      { id: 'competitive', label: 'Competitor Intel', icon: 'radar' },
      { id: 'tam', label: 'Market Sizing', icon: 'globe' },
      { id: 'signals', label: 'Signals Feed', icon: 'signal' },
      { id: 'report', label: 'Market Report', icon: 'report' },
    ],
  },
  {
    id: 'sales',
    name: 'Sales',
    initial: 'S',
    tagline: 'Close faster with AI context',
    description:
      'Battle cards, ICP analysis, win/loss breakdowns, and deal intelligence from CRM and customer feedback.',
    accent: agentAccents.sales.accent,
    accentBg: agentAccents.sales.bg,
    shadowColor: agentAccents.sales.shadow,
    tools: [
      { id: 'dashboard', label: 'Overview', icon: 'grid' },
      { id: 'battlecard', label: 'Battle Cards', icon: 'shield' },
      { id: 'icp', label: 'ICP Analysis', icon: 'target' },
      { id: 'winloss', label: 'Win / Loss', icon: 'trophy' },
      { id: 'dealbrief', label: 'Deal Brief', icon: 'deal' },
    ],
  },
];

export const AGENT_STATS: Record<AgentId, Stat[]> = {
  product: [
    { label: 'PRDs Generated', value: '50', sub: 'Sprint 1 eval set' },
    { label: 'Eval Score', value: '100%', sub: '+10 pts vs v0.2' },
    { label: 'Pending Approvals', value: '3', sub: 'Awaiting review' },
    { label: 'KB Documents', value: '38', sub: 'Indexed sources' },
  ],
  engineering: [
    { label: 'Tech Specs', value: '12', sub: 'Generated this sprint' },
    { label: 'Jira Stories', value: '47', sub: 'Auto-broken down' },
    { label: 'ADRs Written', value: '6', sub: 'Architecture decisions' },
    { label: 'Blockers Caught', value: '9', sub: 'Pre-standup signals' },
  ],
  market: [
    { label: 'Competitors Tracked', value: '3', sub: 'Weekly refresh' },
    { label: 'Market Reports', value: '8', sub: 'Generated this month' },
    { label: 'Signal Items', value: '24', sub: 'New this week' },
    { label: 'TAM Estimate', value: '$4.2B', sub: 'AI-assisted PM tools' },
  ],
  sales: [
    { label: 'Battle Cards', value: '6', sub: '3 competitors covered' },
    { label: 'Deals Briefed', value: '14', sub: 'This quarter' },
    { label: 'Win Rate', value: '68%', sub: '+12 pts MoM' },
    { label: 'ICP Score Avg', value: '87', sub: 'Across active pipeline' },
  ],
};

export const AGENT_ACTIVITY: Record<AgentId, ActivityItem[]> = {
  product: [
    { text: 'PRD generated — Unified Notification Controls', time: '2 min ago' },
    { text: 'Roadmap updated — Q1 2026 Mobile Focus', time: '1 hr ago' },
    { text: 'Approval granted — Dark Mode Rollout', time: 'Yesterday' },
    { text: 'Knowledge sync — Jira Sprint 42', time: 'Yesterday' },
  ],
  engineering: [
    { text: 'Tech spec generated — Notification Settings API', time: '5 min ago' },
    { text: '6 Jira stories broken from PRD-2024-003', time: '30 min ago' },
    { text: 'ADR-042 written — Vector DB selection', time: '2 hr ago' },
    { text: 'Standup brief — 2 blockers surfaced', time: 'This morning' },
  ],
  market: [
    { text: 'Competitor C AI features detected', time: '1 hr ago' },
    { text: 'TAM model updated — $4.2B estimate', time: '3 hr ago' },
    { text: 'Market report generated — AI-PM Tools', time: 'Yesterday' },
    { text: 'Weekly refresh — public sources', time: '2 days ago' },
  ],
  sales: [
    { text: 'Battle card updated — vs Productboard', time: '15 min ago' },
    { text: 'Deal brief — Acme Corp renewal ($240K)', time: '1 hr ago' },
    { text: 'ICP score updated — TechCorp (92)', time: '3 hr ago' },
    { text: 'Win/loss analysis — Q4 2025 complete', time: 'Yesterday' },
  ],
};

export const KNOWLEDGE_SOURCES: KnowledgeSource[] = [
  { label: 'Customer Feedback', count: 17, color: '#1A9E6E' },
  { label: 'Jira Tickets', count: 13, color: '#0F7FBE' },
  { label: 'Historical PRDs', count: 5, color: '#6D5BD0' },
  { label: 'Competitors', count: 3, color: '#D4640A' },
];

export const PRD_EXAMPLES = [
  'Unified notification controls',
  'AI standup summarizer',
  'Dark mode rollout',
  'Referral program v2',
];

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'p1',
    name: 'Unified notification controls',
    status: 'Active',
    lead: 'Product',
    agentId: 'product',
    toolId: 'prd',
    progress: 72,
    updatedLabel: 'PRD v2 · 2h ago',
  },
  {
    id: 'p2',
    name: 'Notification settings API',
    status: 'Active',
    lead: 'Engineering',
    agentId: 'engineering',
    toolId: 'techspec',
    progress: 48,
    updatedLabel: 'Tech spec draft · yesterday',
  },
  {
    id: 'p3',
    name: 'AI-PM competitive pulse',
    status: 'Discovery',
    lead: 'Market',
    agentId: 'market',
    toolId: 'competitive',
    progress: 35,
    updatedLabel: 'Watchlist refresh · today',
  },
  {
    id: 'p4',
    name: 'Acme renewal ($240K)',
    status: 'Active',
    lead: 'Sales',
    agentId: 'sales',
    toolId: 'dealbrief',
    progress: 61,
    updatedLabel: 'Deal brief · 1h ago',
  },
  {
    id: 'p5',
    name: 'Referral program v2',
    status: 'Paused',
    lead: 'Product',
    agentId: 'product',
    toolId: 'roadmap',
    progress: 18,
    updatedLabel: 'Roadmap Q2 · last week',
  },
];

export const PRD_STEP_LABELS = [
  'Retrieving org context…',
  'Reranking top 5 sources…',
  'Generating PRD…',
  'Adding citations…',
];

export const ROADMAP_ITEMS: RoadmapItem[] = [
  { id: 'R1', theme: 'Trust & Reliability', quarter: 'Q1 2026', priority: 'P0', status: 'In Progress', features: ['Citation ≥95%', 'Failure-mode refusals', 'Confidence scoring'] },
  { id: 'R2', theme: 'Notification Controls', quarter: 'Q1 2026', priority: 'P1', status: 'Planned', features: ['Granular toggles', 'Digest mode', 'Admin defaults'] },
  { id: 'R3', theme: 'Knowledge Expansion', quarter: 'Q2 2026', priority: 'P1', status: 'Planned', features: ['Outlook integration', 'Meeting transcripts', 'KB v3'] },
  { id: 'R4', theme: 'AI Standup Summarizer', quarter: 'Q2 2026', priority: 'P2', status: 'Backlog', features: ['Daily Jira digest', 'Blocker detection', 'Slack push'] },
  { id: 'R5', theme: 'Cascade Architecture', quarter: 'Q3 2026', priority: 'P2', status: 'Backlog', features: ['Haiku for simple', 'Sonnet for complex', 'Cost tracking'] },
];

export const PRIORITY_COLORS: Record<Priority, { bg: string; color: string }> = {
  P0: { bg: '#FEF2F2', color: '#dc2626' },
  P1: { bg: '#FFF4EA', color: '#D4640A' },
  P2: { bg: '#F5F4F0', color: '#6B6966' },
};

export const APPROVALS_SEED: Approval[] = [
  { id: 'A1', type: 'PRD', title: 'Unified Notification Controls', confidence: 'High', sources: 5, time: '10 min ago', status: 'pending' },
  { id: 'A2', type: 'Roadmap', title: 'Q2 2026 Knowledge Expansion Plan', confidence: 'High', sources: 8, time: '2 hr ago', status: 'pending' },
  { id: 'A3', type: 'Market Analysis', title: 'Competitor C Feature Gap — AI Features', confidence: 'Medium', sources: 3, time: '4 hr ago', status: 'pending' },
  { id: 'A4', type: 'PRD', title: 'Dark Mode Rollout v2', confidence: 'High', sources: 6, time: 'Yesterday', status: 'approved' },
];

export const EVAL_VERSIONS: EvalVersion[] = [
  { v: 'v0.1', score: 68, delta: null, color: '#D4640A' },
  { v: 'v0.2', score: 90, delta: '+22 pts', color: '#6D5BD0' },
  { v: 'v0.3', score: 100, delta: '+10 pts', color: '#1A9E6E' },
];

export const EVAL_DIMS: EvalDim[] = [
  { label: 'Citation', color: '#6D5BD0' },
  { label: 'Confidence', color: '#1A9E6E' },
  { label: 'Structure', color: '#D4640A' },
  { label: 'Uncertainty', color: '#0F7FBE' },
  { label: 'Refusal', color: '#18181B' },
];

export const TECH_SPEC_EXAMPLES = [
  'Notification settings API — granular per-channel toggles',
  'Dark mode rollout — theming architecture',
  'Referral program v2 — attribution service',
];

export const JIRA_STORIES: JiraStory[] = [
  { id: 'JIRA-520', title: 'Add notification preferences schema to users table', points: 3, type: 'Backend' },
  { id: 'JIRA-521', title: 'Build GET/PUT /notifications/preferences endpoints', points: 5, type: 'Backend' },
  { id: 'JIRA-522', title: 'Notification router — respect user preferences', points: 5, type: 'Backend' },
  { id: 'JIRA-523', title: 'Preference settings UI — channel toggles', points: 3, type: 'Frontend' },
  { id: 'JIRA-524', title: 'Digest mode scheduler — hourly/daily batching', points: 8, type: 'Backend' },
  { id: 'JIRA-525', title: 'Audit log for preference mutations', points: 2, type: 'Backend' },
];

export const ADR_SECTIONS: AdrSection[] = [
  { label: 'Context', text: 'Atlas requires a vector database for tenant-isolated embedding storage and sub-100ms retrieval. The system must support 200–500 token chunks with overlap, cross-encoder reranking, and top-k=5 retrieval.' },
  { label: 'Decision', text: 'We will use Pinecone (managed) for Sprint 1–2, with an abstraction layer (VectorStore interface) that allows migration to pgvector or Weaviate as volume grows beyond 1M vectors.' },
  { label: 'Consequences', text: 'Managed service reduces ops burden for Sprint 1. Abstraction layer adds ~2 days of initial engineering but protects against vendor lock-in. Tenant isolation via namespace prefixes.' },
];

export const STANDUP_SECTIONS: StandupSection[] = [
  { status: 'done', label: 'Completed yesterday', color: '#1A9E6E', items: ['JIRA-501: Financial tracking schema ✓', 'JIRA-488: Notification settings page — design review done'] },
  { status: 'progress', label: 'In progress today', color: '#6D5BD0', items: ['JIRA-521: Notification preferences API endpoints (João, ~4h remaining)', 'JIRA-523: Preference UI — channel toggles (Alinta, in review)'] },
  { status: 'blocked', label: 'Blockers', color: '#dc2626', items: ['JIRA-524: Digest mode scheduler blocked on infrastructure ticket INFRA-88 (Redis cluster sizing)', 'JIRA-515: Account linking — blocked pending legal sign-off on data model'] },
];

export const COMPETITIVE_ROWS: CompetitiveRow[] = [
  { name: 'Productboard', strength: 'Best-in-class roadmapping UI', weakness: 'No RAG, no citation grounding', price: '$49/seat', edge: 'Org memory + evidence-backed outputs' },
  { name: 'Notion AI', strength: 'Ubiquitous adoption, flexible docs', weakness: 'Generic LLM, no product-specific retrieval', price: '$20/seat', edge: 'Purpose-built PM workflows + citations' },
  { name: 'Linear', strength: 'Developer-centric, fast issue management', weakness: 'Not a PM artifact generation tool', price: '$8/seat', edge: 'End-to-end PRD → Jira story generation' },
];

export const TAM_SEGMENTS: TamSegment[] = [
  { label: 'Total Addressable Market', value: '$4.2B', note: 'AI-assisted product management tools, 2026', growth: '+38% YoY' },
  { label: 'Serviceable Addressable Market', value: '$820M', note: 'Enterprise + mid-market PM tools segment', growth: '+31% YoY' },
  { label: 'Serviceable Obtainable Market', value: '$41M', note: '5% SAM capture at $99/seat, 3-year horizon', growth: 'Target ARR' },
];

export const UNIT_ECONOMICS: UnitEconomic[] = [
  { label: 'Price', value: '$99/user/mo' },
  { label: 'Inference cost', value: '~$0.27/user/mo' },
  { label: 'Gross margin', value: '~73%' },
  { label: 'Target ARR', value: '$41M (Y3)' },
];

export const SIGNALS: Signal[] = [
  { source: 'TechCrunch', headline: 'Productboard raises $72M Series D, doubles down on AI roadmapping features', time: '2 days ago', type: 'Funding', impact: 'High' },
  { source: 'Product Hunt', headline: 'Notion AI launches structured PRD templates for product teams', time: '4 days ago', type: 'Product', impact: 'Medium' },
  { source: 'LinkedIn', headline: 'Linear posts job listing for ML Engineer — "AI-assisted issue prioritization"', time: '1 week ago', type: 'Hiring', impact: 'Low' },
  { source: 'G2 Review', headline: '14 new Productboard reviews mention "AI summaries" — 11 positive, 3 request improvements', time: '1 week ago', type: 'Sentiment', impact: 'Medium' },
];

export const IMPACT_COLORS: Record<ImpactLevel, { bg: string; color: string }> = {
  High: { bg: '#FEF2F2', color: '#dc2626' },
  Medium: { bg: '#FFF4EA', color: '#D4640A' },
  Low: { bg: '#F5F4F0', color: '#6B6966' },
};

export const BATTLE_CARDS: Record<string, BattleCardContent> = {
  Productboard: {
    usp: ['Roadmapping UI is best-in-class for visual boards', 'Strong customer portal for feedback collection', 'Integrates with Jira, Slack, Zendesk'],
    objections: ['No RAG — AI suggestions not grounded in org data', 'No citation or confidence scoring', 'Generic text generation, not PM-workflow specific'],
    counters: ['Atlas citations mean every recommendation is traceable — no black-box AI', "We retrieve from your actual Jira/Slack/Confluence, not generic training data", 'Atlas generates PRDs, roadmaps, AND Jira stories in one workflow'],
  },
  'Notion AI': {
    usp: ['Ubiquitous — teams already use Notion', 'Flexible document structure', 'Good for collaborative writing'],
    objections: ['AI is a generic layer, not product-planning specific', 'No retrieval from Jira, Slack, or CRM', 'No approval or oversight workflow'],
    counters: ['Atlas is purpose-built for PMs — PRD templates, roadmap generators, eval scoring', 'We connect to the tools your engineering team actually uses', 'Human-in-the-loop approval before any output ships'],
  },
  Linear: {
    usp: ['Best-in-class developer experience for issue tracking', 'Fast, keyboard-driven UI', 'Strong API ecosystem'],
    objections: ['Issue tracker, not a PM intelligence tool', 'No AI generation of PRDs or roadmaps', 'No customer feedback synthesis'],
    counters: ['Atlas generates the upstream artifacts that feed into Linear', 'We break PRDs into Jira/Linear stories automatically', 'Customer feedback → PRD → stories in one flow'],
  },
};

export const ICP_ACCOUNTS: IcpAccount[] = [
  { name: 'TechCorp', score: 92, segment: 'Enterprise', size: '500–2000 employees', pain: 'Scattered product knowledge', status: 'Hot' },
  { name: 'BuildCo', score: 85, segment: 'Mid-Market', size: '100–500 employees', pain: 'Manual PRD process', status: 'Warm' },
  { name: 'DataSoft', score: 78, segment: 'Enterprise', size: '2000+ employees', pain: 'Poor retrieval across Jira/Notion', status: 'Warm' },
  { name: 'StartupXYZ', score: 55, segment: 'SMB', size: '<100 employees', pain: 'Not enough PM headcount', status: 'Cold' },
];

export const ICP_STATUS_COLORS: Record<IcpStatus, { bg: string; color: string }> = {
  Hot: { bg: '#FEF2F2', color: '#dc2626' },
  Warm: { bg: '#FFF4EA', color: '#D4640A' },
  Cold: { bg: '#F5F4F0', color: '#6B6966' },
};

export const WINLOSS_STATS: WinLossStat[] = [
  { label: 'Win Rate', value: '68%', delta: '+12 pts QoQ', color: '#1A9E6E' },
  { label: 'Avg Deal Size', value: '$28K', delta: '+$4K QoQ', color: '#0F7FBE' },
  { label: 'Avg Sales Cycle', value: '42 days', delta: '−6 days', color: '#D4640A' },
];

export const WIN_REASONS = [
  'Citation grounding — buyers trust AI with sources',
  'PRD quality exceeded competitors',
  'Native Jira integration',
  '$99/seat beats Productboard for comparable feature set',
];

export const LOSS_REASONS = [
  'No Confluence integration (3 deals)',
  'Missing SSO for enterprise sign-on (2 deals)',
  'Competitor offered free trial (3 deals)',
];

export const INTEGRATIONS: Integration[] = [
  { name: 'Jira', icon: 'jira', desc: 'Tickets, sprints, and story sync', color: '#0052CC', bg: '#E9F2FF', status: 'connected', lastSync: '2 min ago' },
  { name: 'Slack', icon: 'slack', desc: 'Channel threads and standup context', color: '#4A154B', bg: '#F5EBF5', status: 'connected', lastSync: '5 min ago' },
  { name: 'Gmail', icon: 'gmail', desc: 'Open Atlas output in a new Gmail compose window', color: '#EA4335', bg: '#FCE8E6', status: 'connected', lastSync: 'Just now' },
  { name: 'Google News', icon: 'google_news', desc: 'Live headlines for market & marketing analysis', color: '#4285F4', bg: '#E8F0FE', status: 'connected', lastSync: 'Live' },
  { name: 'Bloomberg', icon: 'bloomberg', desc: 'Business & markets coverage (via news index)', color: '#000000', bg: '#F5F4F0', status: 'connected', lastSync: 'Live' },
  { name: 'Confluence / Notion', icon: 'confluence', desc: 'Historical PRDs and specs', color: '#172B4D', bg: '#F0EEFF', status: 'connected', lastSync: '1 hr ago' },
  { name: 'Google Drive', icon: 'drive', desc: 'Docs, sheets, and research decks', color: '#1FA463', bg: '#EAF7EF', status: 'not_connected', lastSync: null },
  { name: 'Zendesk', icon: 'zendesk', desc: 'Support tickets and customer feedback', color: '#17181A', bg: '#F5F4F0', status: 'not_connected', lastSync: null },
  { name: 'Salesforce', icon: 'salesforce', desc: 'CRM, pipeline, and account data', color: '#00A1E0', bg: '#EAF7FF', status: 'not_connected', lastSync: null },
];

export const DEAL_BRIEF_SECTIONS: DealBriefSection[] = [
  { label: 'Account Context', content: 'Acme Corp (2,400 employees, SaaS). PM team of 18 using Atlas since Jan 2026. Primary use: PRD generation and roadmap planning. Champion: Sarah Chen (VP Product). Economic buyer: CTO.' },
  { label: 'Pain Points Retrieved', content: 'CF-009: Multi-account linking issues reported by 3 Acme users. JIRA-503: Request for Confluence integration (submitted by Acme admin). CF-010: Positive signal — AI standup summarizer request came from Acme standup note.' },
  { label: 'Renewal Risks', content: 'Missing Confluence integration is a stated blocker. 2 Acme users had MFA recovery issues (CF-005). Recommend proactive outreach from CS before renewal meeting.' },
  { label: 'Recommended Pitch', content: 'Lead with Q3 roadmap: Confluence integration ships Q2, SSO Q3. Show citation precision metrics (100% on eval set). Offer to include Acme use cases in customer evidence package.' },
];
