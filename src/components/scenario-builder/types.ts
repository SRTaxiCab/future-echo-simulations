
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
