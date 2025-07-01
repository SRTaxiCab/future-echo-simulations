// Sample global events data with geographical coordinates
export const globalEvents = [
  {
    id: 'event-1',
    title: 'AI Regulation Framework',
    coordinates: [-74.006, 40.7128] as [number, number], // New York
    country: 'United States',
    impact: 'high' as const,
    probability: 78,
    sector: 'Technology',
    description: 'Major AI oversight legislation expected to pass',
    predictedEffects: ['Global tech market volatility', 'Regulatory compliance costs']
  },
  {
    id: 'event-2',
    title: 'Energy Grid Innovation',
    coordinates: [2.3522, 48.8566] as [number, number], // Paris
    country: 'France',
    impact: 'medium' as const,
    probability: 65,
    sector: 'Energy',
    description: 'Decentralized energy network pilot program',
    predictedEffects: ['Regional energy independence', 'Grid resilience improvement']
  },
  {
    id: 'event-3',
    title: 'Supply Chain Disruption',
    coordinates: [139.6917, 35.6895] as [number, number], // Tokyo
    country: 'Japan',
    impact: 'high' as const,
    probability: 82,
    sector: 'Manufacturing',
    description: 'Semiconductor shortage affecting global production',
    predictedEffects: ['Electronics price increase', 'Production delays']
  },
  {
    id: 'event-4',
    title: 'Climate Adaptation Measures',
    coordinates: [151.2093, -33.8688] as [number, number], // Sydney
    country: 'Australia',
    impact: 'medium' as const,
    probability: 71,
    sector: 'Environment',
    description: 'Large-scale renewable energy infrastructure',
    predictedEffects: ['Carbon emission reduction', 'Energy cost stabilization']
  },
  {
    id: 'event-5',
    title: 'Financial Market Reform',
    coordinates: [8.5417, 47.3769] as [number, number], // Zurich
    country: 'Switzerland',
    impact: 'high' as const,
    probability: 69,
    sector: 'Finance',
    description: 'New cryptocurrency regulation framework',
    predictedEffects: ['Market stabilization', 'Institutional adoption']
  }
];

// Regional probability data for heat map
export const regionalData = [
  { region: 'North America', probability: 75, color: '#ef4444' },
  { region: 'Europe', probability: 68, color: '#f59e0b' },
  { region: 'Asia-Pacific', probability: 82, color: '#ef4444' },
  { region: 'Latin America', probability: 45, color: '#10b981' },
  { region: 'Africa', probability: 52, color: '#6b7280' },
  { region: 'Middle East', probability: 63, color: '#f59e0b' }
];

export type GlobalEvent = typeof globalEvents[0];
export type RegionalData = typeof regionalData[0];