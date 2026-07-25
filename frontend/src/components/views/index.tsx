import { useAtlas } from '../../lib/AtlasContext';
import { Dashboard } from './Dashboard';
import { PRD } from './PRD';
import { Roadmap } from './Roadmap';
import { Approvals } from './Approvals';
import { Eval } from './Eval';
import { TechSpec } from './TechSpec';
import { Stories } from './Stories';
import { ADR } from './ADR';
import { Standup } from './Standup';
import { Competitive } from './Competitive';
import { TAM } from './TAM';
import { Signals } from './Signals';
import { Report } from './Report';
import { Battlecard } from './Battlecard';
import { ICP } from './ICP';
import { WinLoss } from './WinLoss';
import { Integrations } from './Integrations';
import { DealBrief } from './DealBrief';

const VIEWS: Record<string, React.ComponentType> = {
  dashboard: Dashboard,
  prd: PRD,
  roadmap: Roadmap,
  approvals: Approvals,
  eval: Eval,
  techspec: TechSpec,
  stories: Stories,
  adr: ADR,
  standup: Standup,
  competitive: Competitive,
  tam: TAM,
  signals: Signals,
  report: Report,
  battlecard: Battlecard,
  icp: ICP,
  winloss: WinLoss,
  integrations: Integrations,
  dealbrief: DealBrief,
};

export function ToolRouter() {
  const { state } = useAtlas();
  const View = VIEWS[state.tool] ?? Dashboard;
  return <View />;
}
