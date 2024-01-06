import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { nodes, svg, edges, line } from "../graph-svg.js";
import { dragstarted, dragged, dragended } from "./ux.js";
import { checkEulerian } from "./properties.js";

export function addNode(name, x, y) {
  const new_node = {
    name: name,
    x: x,
    y: y,
    adj: [],
  };
  nodes.push(new_node);
  svg
    .selectAll("circle")
    .data(nodes) // Bind data to circles using links
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x) // Position based on source node
    .attr("cy", (d) => d.y)
    .attr("r", 30) // Set radius
    .style("fill", "steelblue");
  svg
    .selectAll("circle")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
  svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .text((d) => d.name)
    .style("text-anchor", "middle") // Center text horizontally
    .style("dominant-baseline", "middle")
    .style("font-size", 12)
    .style("fill", "white");
  checkEulerian();
}

export function addEdge(from, to) {
  const from_i = nodes.findIndex((node) => node.name === from);
  const to_i = nodes.findIndex((node) => node.name === to);
  edges.push({ first: nodes[from_i], second: nodes[to_i] });

  nodes[from_i].adj.push(nodes[to_i]);

  nodes[to_i].adj.push(nodes[from_i]);
  checkEulerian();

  svg
    .selectAll("path")
    .data(edges)
    .enter()
    .append("path")
    .attr("d", (d) =>
      line([
        { x: d.first.x, y: d.first.y },
        { x: d.second.x, y: d.second.y },
      ])
    )
    .style("stroke", "white");
  svg.selectAll("circle").raise();
  svg.selectAll("text").raise();
}

export function removeEdge(fromNode, toNode) {
  /* edges = edges.filter(
      (edge) =>
        !(edge.first.name === toNode && edge.second.name === fromNode) &&
        !(edge.first.name === fromNode && edge.second.name === toNode)
    );*/
  const rm_i = edges.findIndex(
    (edge) =>
      (edge.first.name === toNode && edge.second.name === fromNode) ||
      (edge.first.name === fromNode && edge.second.name === toNode)
  );
  edges.splice(rm_i, 1);
  svg.selectAll("path").remove();
  svg
    .selectAll("path")
    .data(edges)
    .enter()
    .append("path")
    .attr("d", (d) =>
      line([
        { x: d.first.x, y: d.first.y },
        { x: d.second.x, y: d.second.y },
      ])
    )
    .style("stroke", "white");
  svg.selectAll("circle").raise();
  svg.selectAll("text").raise();

  checkEulerian();
}
