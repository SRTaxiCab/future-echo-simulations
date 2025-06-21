
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, ArrowRight } from 'lucide-react';

// Sample causal relationship data
const networkData = {
  nodes: [
    { id: 'ai-regulation', name: 'AI Regulation', type: 'policy', impact: 'high' },
    { id: 'market-volatility', name: 'Market Volatility', type: 'economic', impact: 'high' },
    { id: 'tech-innovation', name: 'Tech Innovation', type: 'technology', impact: 'medium' },
    { id: 'employment', name: 'Employment Changes', type: 'social', impact: 'high' },
    { id: 'energy-crisis', name: 'Energy Crisis', type: 'environmental', impact: 'high' },
    { id: 'supply-chain', name: 'Supply Chain', type: 'economic', impact: 'medium' },
    { id: 'geopolitical', name: 'Geopolitical Tension', type: 'political', impact: 'high' },
    { id: 'climate-action', name: 'Climate Action', type: 'environmental', impact: 'medium' }
  ],
  links: [
    { source: 'ai-regulation', target: 'market-volatility', strength: 0.8, type: 'causes' },
    { source: 'ai-regulation', target: 'tech-innovation', strength: 0.6, type: 'influences' },
    { source: 'tech-innovation', target: 'employment', strength: 0.9, type: 'causes' },
    { source: 'energy-crisis', target: 'supply-chain', strength: 0.7, type: 'disrupts' },
    { source: 'geopolitical', target: 'energy-crisis', strength: 0.5, type: 'triggers' },
    { source: 'geopolitical', target: 'market-volatility', strength: 0.6, type: 'causes' },
    { source: 'climate-action', target: 'energy-crisis', strength: 0.4, type: 'mitigates' },
    { source: 'supply-chain', target: 'market-volatility', strength: 0.5, type: 'influences' }
  ]
};

const getNodeColor = (type: string) => {
  switch (type) {
    case 'policy': return '#3b82f6';
    case 'economic': return '#ef4444';
    case 'technology': return '#10b981';
    case 'social': return '#f59e0b';
    case 'environmental': return '#8b5cf6';
    case 'political': return '#f97316';
    default: return '#6b7280';
  }
};

const getLinkColor = (type: string) => {
  switch (type) {
    case 'causes': return '#ef4444';
    case 'influences': return '#f59e0b';
    case 'disrupts': return '#dc2626';
    case 'triggers': return '#991b1b';
    case 'mitigates': return '#10b981';
    default: return '#6b7280';
  }
};

interface NetworkDiagramProps {
  className?: string;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = 800;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    // Create simulation
    const simulation = d3.forceSimulation(networkData.nodes as any)
      .force('link', d3.forceLink(networkData.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create arrow markers
    svg.append('defs').selectAll('marker')
      .data(['causes', 'influences', 'disrupts', 'triggers', 'mitigates'])
      .join('marker')
      .attr('id', d => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', d => getLinkColor(d));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(networkData.links)
      .join('line')
      .attr('stroke', (d: any) => getLinkColor(d.type))
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.strength * 10))
      .attr('marker-end', (d: any) => `url(#arrow-${d.type})`);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(networkData.nodes)
      .join('circle')
      .attr('r', (d: any) => d.impact === 'high' ? 12 : d.impact === 'medium' ? 9 : 6)
      .attr('fill', (d: any) => getNodeColor(d.type))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer');

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(networkData.nodes)
      .join('text')
      .text((d: any) => d.name)
      .attr('font-size', 10)
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('fill', '#e2e8f0')
      .attr('text-anchor', 'middle')
      .attr('dy', -15)
      .style('pointer-events', 'none');

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(15, 23, 42, 0.9)')
      .style('color', '#e2e8f0')
      .style('padding', '8px')
      .style('border', '1px solid #0ea5e9')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('font-family', 'JetBrains Mono, monospace')
      .style('z-index', '1000');

    // Add hover events
    node
      .on('mouseover', function(event, d: any) {
        tooltip
          .style('visibility', 'visible')
          .html(`<strong>${d.name}</strong><br/>Type: ${d.type}<br/>Impact: ${d.impact}`);
      })
      .on('mousemove', function(event) {
        tooltip
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('visibility', 'hidden');
      });

    // Add drag behavior
    const drag = d3.drag()
      .on('start', function(event, d: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', function(event, d: any) {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', function(event, d: any) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-mono flex items-center">
          <Network className="h-5 w-5 mr-2" />
          Causal Relationship Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Policy</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Economic</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Technology</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Social</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span>Environmental</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Political</span>
            </div>
          </div>
          
          <div className="border rounded-lg bg-muted/20 p-2">
            <svg ref={svgRef} className="w-full h-auto" style={{ minHeight: '500px' }}></svg>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Drag nodes to explore relationships. Hover for details. Arrow colors indicate relationship types:</p>
            <div className="flex flex-wrap gap-3 mt-1">
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-red-500" />
                Causes
              </span>
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-yellow-500" />
                Influences
              </span>
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-green-500" />
                Mitigates
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
