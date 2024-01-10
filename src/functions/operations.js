import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg, ecdSvg, line, play_button } from "../graph-svg.js";
import { dragstarted, dragged, dragended } from "./ux.js";
import { calculateAdj, checkEulerian, checkBipartite } from "./properties.js";

export let nodes = new Map();

nodes.set('A', {x: 500, y: 500, adj: []})
nodes.set('B', {x: 300, y: 300, adj:[]})
nodes.set('C', {x: 400, y: 450, adj: []})

export let edges = [
  { first: ['A', nodes.get('A')], second: ['B', nodes.get('B')]},
  { first: ['B', nodes.get('B')], second: ['C', nodes.get('C')] },
  { first: ['C', nodes.get('C')], second: ['A', nodes.get('A')] },
];

export function addNode(name, x, y) {
  const new_node = {
    x: x,
    y: y,
    adj: [],
  };
  nodes.set(name, new_node);
  svg
    .selectAll("circle")
    .data(nodes.values()) // Bind data to circles using links
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
    .data(nodes.entries())
    .enter()
    .append("text")
    .attr("x", (d) => d[1].x)
    .attr("y", (d) => d[1].y)
    .text((d) => d[0])
    .style("text-anchor", "middle") // Center text horizontally
    .style("dominant-baseline", "middle")
    .style("font-size", 12)
    .style("fill", "white");
  checkEulerian();
  checkBipartite();
}

export function addEdge(from, to) {

  edges.push({ first: [from, nodes.get(from)], second: [to, nodes.get(to)]});

  nodes.get(from).adj.push(to)
  nodes.get(to).adj.push(from)
  checkEulerian();

  svg
  .selectAll("path")
  .data(edges)
  .enter()
  .append("path")
  .attr("d", (d) =>
    line([
      { x: d.first[1].x, y: d.first[1].y },
      { x: d.second[1].x, y: d.second[1].y },
    ])
  )
  .style("stroke", "white");
  svg.selectAll("circle").raise();
  svg.selectAll("text").raise();
  checkBipartite();
}

export function removeEdge(fromNode, toNode) {
  const rm_i = edges.findIndex(
    (edge) =>
      (edge.first[0] === toNode && edge.second[0] === fromNode) ||
      (edge.first[0] === fromNode && edge.second[0] === toNode)
  );
  edges.splice(rm_i, 1);

  const adj_from = nodes.get(fromNode).adj.findIndex((node) => node === toNode)
  nodes.get(fromNode).adj.splice(adj_from, 1)
  const adj_to = nodes.get(toNode).adj.findIndex((node) => node === fromNode)
  nodes.get(toNode).adj.splice(adj_to, 1)
  svg.selectAll("path").remove();
  svg
  .selectAll("path")
  .data(edges)
  .enter()
  .append("path")
  .attr("d", (d) =>
    line([
      { x: d.first[1].x, y: d.first[1].y },
      { x: d.second[1].x, y: d.second[1].y },
    ])
  )
  .style("stroke", "white");
  svg.selectAll("circle").raise();
  svg.selectAll("text").raise();

  checkEulerian();
  checkBipartite();
}

export function removeNode(node) {
  const neighbors = nodes.get(node).adj
  console.log(nodes.get(node).adj)
  nodes.delete(node)
  for (const n of neighbors) nodes.get(n).adj = nodes.get(n).adj.filter((neighbor) => neighbor !== node)
  edges = edges.filter((edge) => edge.first[0] !== node && edge.second[0] !== node)

  svg.selectAll("path").remove();
  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  svg
    .selectAll("path")
    .data(edges)
    .enter()
    .append("path")
    .attr("d", (d) =>
      line([
        { x: d.first[1].x, y: d.first[1].y },
        { x: d.second[1].x, y: d.second[1].y },
      ])
    )
    .style("stroke", "white");
    svg
    .selectAll("circle")
    .data(nodes.values()) // Bind data to circles using links
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
    .data(nodes.entries())
    .enter()
    .append("text")
    .attr("x", (d) => d[1].x)
    .attr("y", (d) => d[1].y)
    .text((d) => d[0])
    .style("text-anchor", "middle") // Center text horizontally
    .style("dominant-baseline", "middle")
    .style("font-size", 12)
    .style("fill", "white");

  svg.selectAll("circle").raise();
  svg.selectAll("text").raise();

  checkEulerian();
  checkBipartite();

}

export function proveEcd() {
  play_button.remove();
  const pbi = ecdSvg
  .append("text")
  .attr("x", 100)
  .attr("y", 100)
  .text("Proof by Induction ")
  .attr("class", "fill-gray-300").attr("font-size", 24)
  const bc = ecdSvg.append("text")
  .attr("x", 100)
  .attr("y", 150)
  .text("Base Case")
  .attr("class", "fill-gray-300").attr("font-size", 24)
}
