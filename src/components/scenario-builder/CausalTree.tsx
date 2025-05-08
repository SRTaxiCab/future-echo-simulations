
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CausalTreeData, CausalNode, CausalLink } from './types';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Expand } from 'lucide-react';

interface CausalTreeProps {
  data: CausalTreeData;
  width?: number;
  height?: number;
}

export const CausalTree: React.FC<CausalTreeProps> = ({
  data,
  width = 600,
  height = 400
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<CausalNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create main group for the visualization
    const g = svg.append("g");
    
    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom as any);

    // Simulation setup
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.links)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.7))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(50));

    // Create links
    const links = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke", (d) => getLinkColor(d.strength))
      .attr("stroke-width", (d) => Math.abs(d.strength) * 3)
      .attr("stroke-dasharray", (d) => d.strength < 0 ? "5,5" : "");

    // Create nodes
    const nodeGroups = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .attr("class", "node-group")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any)
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      });

    // Add circles for each node
    nodeGroups.append("circle")
      .attr("r", (d) => getNodeRadius(d))
      .attr("fill", (d) => getNodeColor(d))
      .attr("stroke", "#333")
      .attr("stroke-width", 1);

    // Add labels for each node
    nodeGroups.append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 30)
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .attr("pointer-events", "none");
    
    // Add value indicators for variable nodes
    nodeGroups.filter((d) => d.type === 'variable')
      .append("text")
      .text((d) => d.value ? `${d.value}%` : '')
      .attr("text-anchor", "middle")
      .attr("dy", -20)
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none");

    // Update positions on tick
    simulation.on("tick", () => {
      links
        .attr("x1", d => (d.source as any).x)
        .attr("y1", d => (d.source as any).y)
        .attr("x2", d => (d.target as any).x)
        .attr("y2", d => (d.target as any).y);

      nodeGroups.attr("transform", d => `translate(${(d as any).x},${(d as any).y})`);
    });

    // Clear selection when clicking on background
    svg.on("click", () => {
      setSelectedNode(null);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Clean up
    return () => {
      simulation.stop();
    };
  }, [data, width, height]);

  // Helper functions for styling nodes and links
  function getNodeRadius(node: CausalNode): number {
    switch (node.type) {
      case 'variable':
        return 15;
      case 'outcome':
        return 12;
      case 'event':
        return 10;
      default:
        return 10;
    }
  }

  function getNodeColor(node: CausalNode): string {
    switch (node.type) {
      case 'variable':
        return '#9b87f5'; // Primary purple
      case 'outcome':
        return '#F97316'; // Bright orange
      case 'event':
        return '#0EA5E9'; // Ocean blue
      default:
        return '#8E9196'; // Neutral gray
    }
  }

  function getLinkColor(strength: number): string {
    if (strength > 0.7) return '#10B981'; // Strong positive - green
    if (strength > 0) return '#38BDF8'; // Positive - blue
    if (strength > -0.7) return '#F97316'; // Negative - orange
    return '#EF4444'; // Strong negative - red
  }

  function handleZoomIn() {
    const svg = d3.select(svgRef.current);
    const currentZoom = d3.zoomTransform(svg.node() as any);
    svg.transition().call(
      (d3.zoom() as any).transform,
      d3.zoomIdentity.scale(currentZoom.k * 1.2).translate(
        currentZoom.x / 1.2,
        currentZoom.y / 1.2
      )
    );
  }

  function handleZoomOut() {
    const svg = d3.select(svgRef.current);
    const currentZoom = d3.zoomTransform(svg.node() as any);
    svg.transition().call(
      (d3.zoom() as any).transform,
      d3.zoomIdentity.scale(currentZoom.k / 1.2).translate(
        currentZoom.x * 1.2,
        currentZoom.y * 1.2
      )
    );
  }

  function handleReset() {
    const svg = d3.select(svgRef.current);
    svg.transition().call(
      (d3.zoom() as any).transform,
      d3.zoomIdentity
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-mono text-lg">Causal Analysis Tree</CardTitle>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} className="h-8 w-8 p-0">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="border border-border rounded-md bg-black/5"
          />
          
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="outline" className="bg-black/20 text-xs font-normal">
              <div className="w-3 h-3 rounded-full bg-[#9b87f5] mr-1.5"></div>
              Variables
            </Badge>
            <Badge variant="outline" className="bg-black/20 text-xs font-normal">
              <div className="w-3 h-3 rounded-full bg-[#F97316] mr-1.5"></div>
              Outcomes
            </Badge>
          </div>
          
          {selectedNode && (
            <div className="absolute bottom-3 left-3 right-3 bg-background border border-border rounded-md p-3 text-xs">
              <h4 className="font-mono font-bold mb-1">{selectedNode.name}</h4>
              <p className="text-muted-foreground">{selectedNode.description}</p>
              {selectedNode.value !== undefined && (
                <Badge className="mt-2 bg-[#9b87f5]">{selectedNode.value}%</Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>Drag nodes to explore relationships. Click on a node to see details.</p>
        </div>
      </CardContent>
    </Card>
  );
};
