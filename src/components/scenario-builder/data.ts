
import { Region, Sector, TimePeriod, VariableOption, ImpactData, TimelineData, ProbabilityData } from './types';

// Predefined regions for scenario builder
export const regions: Region[] = [
  { id: 'na', name: 'North America' },
  { id: 'eu', name: 'Europe' },
  { id: 'asia', name: 'Asia' },
  { id: 'sa', name: 'South America' },
  { id: 'africa', name: 'Africa' },
  { id: 'oceania', name: 'Oceania' },
  { id: 'global', name: 'Global' },
];

// Predefined sectors for scenario builder
export const sectors: Sector[] = [
  { id: 'tech', name: 'Technology' },
  { id: 'energy', name: 'Energy' },
  { id: 'finance', name: 'Finance' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'manufacturing', name: 'Manufacturing' },
  { id: 'retail', name: 'Retail' },
  { id: 'government', name: 'Government' },
];

// Predefined time periods
export const timePeriods: TimePeriod[] = [
  { id: '6m', name: '6 Months' },
  { id: '1y', name: '1 Year' },
  { id: '2y', name: '2 Years' },
  { id: '5y', name: '5 Years' },
  { id: '10y', name: '10 Years' },
];

// Sample forecast data (simulation output)
export const impactData: ImpactData[] = [
  { name: 'Economic Growth', baseline: 2.5, scenario: 3.8 },
  { name: 'Unemployment', baseline: 5.2, scenario: 4.1 },
  { name: 'Inflation', baseline: 3.1, scenario: 2.8 },
  { name: 'Market Index', baseline: 12500, scenario: 14200 },
  { name: 'Consumer Confidence', baseline: 105, scenario: 118 },
];

export const timelineData: TimelineData[] = [
  { month: 'Month 1', baseline: 100, scenario: 102 },
  { month: 'Month 2', baseline: 102, scenario: 105 },
  { month: 'Month 3', baseline: 104, scenario: 110 },
  { month: 'Month 4', baseline: 105, scenario: 116 },
  { month: 'Month 5', baseline: 106, scenario: 122 },
  { month: 'Month 6', baseline: 107, scenario: 130 },
  { month: 'Month 7', baseline: 108, scenario: 135 },
  { month: 'Month 8', baseline: 110, scenario: 142 },
  { month: 'Month 9', baseline: 111, scenario: 148 },
  { month: 'Month 10', baseline: 112, scenario: 155 },
  { month: 'Month 11', baseline: 114, scenario: 163 },
  { month: 'Month 12', baseline: 115, scenario: 168 },
];

export const probabilityData: ProbabilityData[] = [
  { name: '60-80%', value: 65 },
  { name: '40-60%', value: 25 },
  { name: '20-40%', value: 10 },
];

export const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

// Sample variables for dynamic scenario building
export const variableOptions: VariableOption[] = [
  { value: 'ai_regulation', label: 'AI Regulation Strength' },
  { value: 'energy_transition', label: 'Energy Transition Speed' },
  { value: 'market_volatility', label: 'Market Volatility' },
  { value: 'geopolitical_stability', label: 'Geopolitical Stability' },
  { value: 'climate_policy', label: 'Climate Policy Implementation' },
];
