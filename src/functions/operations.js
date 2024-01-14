import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg, ecdSvg, line, play_button } from "../graph-svg.js";
import { dragstarted, dragged, dragended } from "./ux.js";
import { calculateEdges, checkEulerian, checkBipartite } from "./properties.js";

const nodeHist = sessionStorage.getItem("nodesData")
console.log(nodeHist)
export let nodes = nodeHist ? new Map(Object.entries(JSON.parse(nodeHist))) :   new Map([
  ["A", { x: 500, y: 500, adj: ["B", "C"] }],
  ["B", { x: 300, y: 300, adj: ["A", "C"] }],
  ["C", { x: 400, y: 450, adj: ["A", "B"] }],
]);

let next_button;

export let edges = [];

calculateEdges();

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

  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function addEdge(from, to) {
  edges.push({ first: [from, nodes.get(from)], second: [to, nodes.get(to)] });

  nodes.get(from).adj.push(to);
  nodes.get(to).adj.push(from);
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

  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function removeEdge(fromNode, toNode) {
  edges = edges.filter(
    (edge) =>
      !(
        (edge.first[0] === toNode && edge.second[0] === fromNode) ||
        (edge.first[0] === fromNode && edge.second[0] === toNode)
      )
  );

  const adj_from = nodes.get(fromNode).adj.findIndex((node) => node === toNode);
  nodes.get(fromNode).adj.splice(adj_from, 1);
  const adj_to = nodes.get(toNode).adj.findIndex((node) => node === fromNode);
  nodes.get(toNode).adj.splice(adj_to, 1);
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

  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function removeNode(node) {
  const neighbors = nodes.get(node).adj;
  console.log(nodes.get(node).adj);
  nodes.delete(node);
  for (const n of neighbors)
    nodes.get(n).adj = nodes.get(n).adj.filter((neighbor) => neighbor !== node);
  edges = edges.filter(
    (edge) => edge.first[0] !== node && edge.second[0] !== node
  );

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

  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function bcEcd() {
  play_button.remove();
  const pbi = ecdSvg
    .append("text")
    .attr("x", 75)
    .attr("y", 75)
    .text("Proof by Induction ")
    .attr("class", "fill-gray-300")
    .attr("font-size", 24);
  const bc1 = ecdSvg
    .append("text")
    .attr("x", 75)
    .attr("y", 125)
    .text("Base Case: An Eulerian graph with 0 edges has 0 vertices.")
    .attr("class", "fill-gray-300")
    .attr("font-size", 24);
  const bc2 = ecdSvg
    .append("text")
    .attr("x", 75)
    .attr("y", 165)
    .text("It can be decomposed into trivial cycles that will be exhaustive. ")
    .attr("class", "fill-gray-300")
    .attr("font-size", 24);
  next_button = ecdSvg
    .append("text")
    .attr("x", 1050)
    .attr("y", 650)
    .text("Next")
    .attr("class", "fill-gray-300")
    .attr("font-size", 24);

  next_button
    .on("mouseover", () => {
      next_button.style("cursor", "pointer");
    })
    .on("mouseout", () => {
      next_button.style("cursor", "default");
    });
  next_button.on("click", () => {
    pbi.remove();
    bc1.remove();
    bc2.remove();
    iHEcd();
  });
}

function iHEcd() {
  const ihL = ecdSvg
    .append("text")
    .attr("x", 75)
    .attr("y", 75)
    .text("Inductive Hypothesis")
    .attr("class", "fill-gray-300")
    .attr("font-size", 24);
  const ih = ecdSvg
    .append("text")
    .attr("x", 75)
    .attr("y", 125)
    .text(
      "Suppose the proposition holds for all graphs with less than m edges:"
    )
    .attr("class", "fill-gray-300")
    .attr("font-size", 24);
  const ihG = ecdSvg
    .append("text")
    .attr("x", 200)
    .attr("y", 400)
    .text("G =")
    .attr("class", "fill-gray-300")
    .attr("font-size", 48);

  const ihGraph = ecdSvg
    .append("circle")
    .attr("cx", 500)
    .attr("cy", 400)
    .attr("r", 200)
    .attr("fill", "lightslategray");

  const node1 = ecdSvg
    .append("circle")
    .attr("cx", 400)
    .attr("cy", 300)
    .attr("r", 30)
    .attr("fill", "lightsteelblue");
  const node2 = ecdSvg
    .append("circle")
    .attr("cx", 450)
    .attr("cy", 500)
    .attr("r", 30)
    .attr("fill", "lightsteelblue");
  const node3 = ecdSvg
    .append("circle")
    .attr("cx", 550)
    .attr("cy", 400)
    .attr("r", 30)
    .attr("fill", "lightsteelblue");
  const node4 = ecdSvg
    .append("circle")
    .attr("cx", 580)
    .attr("cy", 500)
    .attr("r", 30)
    .attr("fill", "lightsteelblue");
}
