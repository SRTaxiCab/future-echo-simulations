
import { CausalTreeData } from './types';

// Sample causal tree data for different sectors
export const getCausalTreeData = (
  sector: string,
  variables: Array<{ name: string; value: number }>
): CausalTreeData => {
  // Default nodes that are always present
  const baseNodes = [
    {
      id: 'economic_growth',
      name: 'Economic Growth',
      type: 'outcome' as const,
      description: 'Overall economic expansion rate',
    },
    {
      id: 'innovation_rate',
      name: 'Innovation Rate',
      type: 'outcome' as const,
      description: 'Pace of technological advancement',
    },
    {
      id: 'market_stability',
      name: 'Market Stability',
      type: 'outcome' as const,
      description: 'Financial market volatility and risk',
    },
    {
      id: 'social_impact',
      name: 'Social Impact',
      type: 'outcome' as const,
      description: 'Effects on society and communities',
    },
  ];
  
  // Convert user-selected variables to nodes
  const variableNodes = variables.map(variable => ({
    id: variable.name,
    name: getVariableName(variable.name),
    type: 'variable' as const,
    description: getVariableDescription(variable.name),
    value: variable.value,
  }));
  
  // Add sector-specific nodes
  let sectorNodes: any[] = [];
  let links: any[] = [];
  
  switch (sector) {
    case 'tech':
      sectorNodes = [
        {
          id: 'digital_adoption',
          name: 'Digital Adoption',
          type: 'outcome' as const,
          description: 'Rate of technology uptake across sectors',
        },
        {
          id: 'data_privacy',
          name: 'Data Privacy',
          type: 'outcome' as const,
          description: 'Level of protection for personal data',
        },
      ];
      
      // Technology sector specific links
      links = createTechSectorLinks(variableNodes.map(n => n.id));
      break;
      
    case 'energy':
      sectorNodes = [
        {
          id: 'carbon_emissions',
          name: 'Carbon Emissions',
          type: 'outcome' as const,
          description: 'Greenhouse gas output levels',
        },
        {
          id: 'energy_prices',
          name: 'Energy Prices',
          type: 'outcome' as const,
          description: 'Cost of energy for consumers and businesses',
        },
      ];
      
      // Energy sector specific links
      links = createEnergySectorLinks(variableNodes.map(n => n.id));
      break;
      
    case 'finance':
      sectorNodes = [
        {
          id: 'investment_flows',
          name: 'Investment Flows',
          type: 'outcome' as const,
          description: 'Capital movement between markets',
        },
        {
          id: 'financial_inclusion',
          name: 'Financial Inclusion',
          type: 'outcome' as const,
          description: 'Access to financial services across populations',
        },
      ];
      
      // Finance sector specific links
      links = createFinanceSectorLinks(variableNodes.map(n => n.id));
      break;
      
    default:
      // Generic links for other sectors
      links = createDefaultLinks(variableNodes.map(n => n.id));
  }
  
  // Combine all nodes
  const allNodes = [...variableNodes, ...baseNodes, ...sectorNodes];
  
  return {
    nodes: allNodes,
    links: links,
  };
};

// Helper functions to get readable names and descriptions
function getVariableName(variableId: string): string {
  const nameMap: Record<string, string> = {
    'ai_regulation': 'AI Regulation Strength',
    'energy_transition': 'Energy Transition Speed',
    'market_volatility': 'Market Volatility',
    'geopolitical_stability': 'Geopolitical Stability',
    'climate_policy': 'Climate Policy Implementation',
  };
  
  return nameMap[variableId] || variableId.replace(/_/g, ' ');
}

function getVariableDescription(variableId: string): string {
  const descriptionMap: Record<string, string> = {
    'ai_regulation': 'Intensity of government oversight on AI development and deployment',
    'energy_transition': 'Rate of shift from fossil fuels to renewable energy sources',
    'market_volatility': 'Degree of unpredictable price changes in financial markets',
    'geopolitical_stability': 'Level of harmony in international relations and trade',
    'climate_policy': 'Strength and enforcement of climate change mitigation policies',
  };
  
  return descriptionMap[variableId] || '';
}

// Helper functions to create links based on sector
function createTechSectorLinks(variableIds: string[]): any[] {
  const baseLinks = [
    {
      source: 'digital_adoption',
      target: 'economic_growth',
      strength: 0.8,
      description: 'Digital technologies increase productivity',
    },
    {
      source: 'innovation_rate',
      target: 'digital_adoption',
      strength: 0.9,
      description: 'Innovation accelerates technology adoption',
    },
    {
      source: 'data_privacy',
      target: 'market_stability',
      strength: 0.5,
      description: 'Privacy concerns affect market trust',
    },
  ];
  
  // Add links from user variables
  const variableLinks: any[] = [];
  
  variableIds.forEach(id => {
    if (id === 'ai_regulation') {
      variableLinks.push(
        {
          source: id,
          target: 'innovation_rate',
          strength: -0.6,
          description: 'Regulation may slow innovation',
        },
        {
          source: id,
          target: 'data_privacy',
          strength: 0.8,
          description: 'Regulation improves privacy protections',
        }
      );
    }
    
    if (id === 'market_volatility') {
      variableLinks.push(
        {
          source: id,
          target: 'market_stability',
          strength: -0.9,
          description: 'Direct inverse relationship',
        },
        {
          source: id,
          target: 'innovation_rate',
          strength: 0.3,
          description: 'Volatility can drive innovation',
        }
      );
    }
    
    if (id === 'geopolitical_stability') {
      variableLinks.push(
        {
          source: id,
          target: 'market_stability',
          strength: 0.7,
          description: 'Political stability improves markets',
        },
        {
          source: id,
          target: 'innovation_rate',
          strength: 0.4,
          description: 'Stable conditions foster innovation',
        }
      );
    }
  });
  
  return [...baseLinks, ...variableLinks];
}

function createEnergySectorLinks(variableIds: string[]): any[] {
  const baseLinks = [
    {
      source: 'carbon_emissions',
      target: 'social_impact',
      strength: -0.7,
      description: 'Emissions negatively impact society',
    },
    {
      source: 'energy_prices',
      target: 'economic_growth',
      strength: -0.6,
      description: 'High energy costs slow growth',
    },
    {
      source: 'energy_prices',
      target: 'market_stability',
      strength: -0.4,
      description: 'Energy price fluctuations increase market volatility',
    },
  ];
  
  // Add links from user variables
  const variableLinks: any[] = [];
  
  variableIds.forEach(id => {
    if (id === 'energy_transition') {
      variableLinks.push(
        {
          source: id,
          target: 'carbon_emissions',
          strength: -0.8,
          description: 'Clean energy reduces emissions',
        },
        {
          source: id,
          target: 'energy_prices',
          strength: -0.3,
          description: 'Renewable energy lowers long-term costs',
        }
      );
    }
    
    if (id === 'climate_policy') {
      variableLinks.push(
        {
          source: id,
          target: 'carbon_emissions',
          strength: -0.7,
          description: 'Policies reduce emissions',
        },
        {
          source: id,
          target: 'energy_transition',
          strength: 0.8,
          description: 'Policies accelerate energy transition',
        }
      );
    }
  });
  
  return [...baseLinks, ...variableLinks];
}

function createFinanceSectorLinks(variableIds: string[]): any[] {
  const baseLinks = [
    {
      source: 'investment_flows',
      target: 'economic_growth',
      strength: 0.8,
      description: 'Investments drive economic growth',
    },
    {
      source: 'financial_inclusion',
      target: 'social_impact',
      strength: 0.7,
      description: 'Access to finance improves social outcomes',
    },
    {
      source: 'market_stability',
      target: 'investment_flows',
      strength: 0.6,
      description: 'Stable markets attract investment',
    },
  ];
  
  // Add links from user variables
  const variableLinks: any[] = [];
  
  variableIds.forEach(id => {
    if (id === 'market_volatility') {
      variableLinks.push(
        {
          source: id,
          target: 'market_stability',
          strength: -0.9,
          description: 'Direct inverse relationship',
        },
        {
          source: id,
          target: 'investment_flows',
          strength: -0.7,
          description: 'Volatility reduces investment',
        }
      );
    }
    
    if (id === 'geopolitical_stability') {
      variableLinks.push(
        {
          source: id,
          target: 'market_stability',
          strength: 0.7,
          description: 'Political stability improves markets',
        },
        {
          source: id,
          target: 'financial_inclusion',
          strength: 0.4,
          description: 'Stability enables broader inclusion',
        }
      );
    }
  });
  
  return [...baseLinks, ...variableLinks];
}

function createDefaultLinks(variableIds: string[]): any[] {
  // Generic links that work for any sector
  const baseLinks = [
    {
      source: 'innovation_rate',
      target: 'economic_growth',
      strength: 0.7,
      description: 'Innovation drives growth',
    },
    {
      source: 'market_stability',
      target: 'economic_growth',
      strength: 0.5,
      description: 'Stable markets enable growth',
    },
  ];
  
  // Add generic links from user variables
  const variableLinks: any[] = [];
  
  variableIds.forEach(id => {
    if (id === 'geopolitical_stability') {
      variableLinks.push(
        {
          source: id,
          target: 'market_stability',
          strength: 0.7,
          description: 'Political stability improves markets',
        }
      );
    }
    
    if (id === 'market_volatility') {
      variableLinks.push(
        {
          source: id,
          target: 'market_stability',
          strength: -0.9,
          description: 'Direct inverse relationship',
        }
      );
    }
  });
  
  return [...baseLinks, ...variableLinks];
}
