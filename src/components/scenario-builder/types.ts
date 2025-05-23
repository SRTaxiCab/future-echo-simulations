
export interface Region {
  id: string;
  name: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface TimePeriod {
  id: string;
  name: string;
}

export interface VariableOption {
  value: string;
  label: string;
}

export interface ImpactData {
  name: string;
  baseline: number;
  scenario: number;
}

export interface TimelineData {
  month: string;
  baseline: number;
  scenario: number;
}

export interface ProbabilityData {
  name: string;
  value: number;
}

// New types for the CausalTree component
export interface CausalNode {
  id: string;
  name: string;
  type: 'variable' | 'outcome' | 'event';
  description?: string;
  value?: number;
  x?: number;
  y?: number;
}

export interface CausalLink {
  source: string;
  target: string;
  strength: number; // -1 to 1, negative for inverse relationships
  description?: string;
}

export interface CausalTreeData {
  nodes: CausalNode[];
  links: CausalLink[];
}

// New types for offline support and app status
export interface AppStatus {
  online: boolean;
  lastSynced: Date | null;
  pendingChanges: boolean;
}

export interface ScenarioData {
  id: string;
  name: string;
  hypothesis: string;
  region: string;
  sector: string;
  timePeriod: string;
  variables: Array<{name: string, value: number}>;
  isResultReady: boolean;
  timestamp: Date;
}

export interface AnalysisResult {
  impactData: ImpactData[];
  timelineData: TimelineData[];
  probabilityData: ProbabilityData[];
  causalTreeData: CausalTreeData;
  confidence: number;
  deviation: number;
  keyFactors: string[];
}
