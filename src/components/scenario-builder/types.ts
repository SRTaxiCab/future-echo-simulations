
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
