import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTimemapStore, Node } from '../../store/timemapStore';

const Canvas = () => {
  const ref = useRef<SVGSVGElement>(null);
  const { nodes, updateNodePosition } = useTimemapStore();

  useEffect(() => {
    const svg = d3.select(ref.current);

    const drag = d3.drag<SVGCircleElement, Node>()
      .on('start', (event, d) => {
        d3.select(event.sourceEvent.target).raise().attr('stroke', 'black');
      })
      .on('drag', (event, d) => {
        d3.select(event.sourceEvent.target).attr('cx', event.x).attr('cy', event.y);
      })
      .on('end', (event, d) => {
        d3.select(event.sourceEvent.target).attr('stroke', null);
        updateNodePosition(d.id, event.x, event.y);
      });

    const circles = svg.selectAll<SVGCircleElement, Node>('circle')
      .data(nodes, (d) => d.id)
      .join(
        enter => enter.append('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => d.radius)
          .attr('fill', d => d.color)
          .call(drag),
        update => update
          .attr('fill', 'green') // Color existing nodes green to see updates
          .call(update => update.transition().duration(500)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)),
        exit => exit.remove()
      );

  }, [nodes, updateNodePosition]);

  return (
    <div className="flex-grow bg-gray-100 dark:bg-gray-800">
      <svg ref={ref} width="100%" height="100%"></svg>
    </div>
  );
};

export default Canvas;
