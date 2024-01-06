import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { addNode } from "./functions/operations.js";
import {
  dragstarted,
  dragged,
  dragended,
  toggle,
  clear,
} from "./functions/ux.js";
import { calculateAdj, checkEulerian } from "./functions/properties.js";
import { addEdge, removeEdge } from "./functions/operations.js";
export let nodes = [
  { name: "A", x: 500, y: 500, adj: [] },
  { name: "B", x: 300, y: 300, adj: [] },
  { name: "C", x: 400, y: 450, adj: [] },
];

export let edges = [
  { first: nodes[0], second: nodes[1] },
  { first: nodes[1], second: nodes[2] },
  { first: nodes[2], second: nodes[0] },
];

export const svg = d3
  .select("graph")
  .append("svg")
  .attr("class", "bg-gray-800 rounded-xl")
  .attr("width", 800)
  .attr("height", 800);

export const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

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

svg
  .selectAll("circle")
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

calculateAdj();
checkEulerian();

document.getElementById("add-node").addEventListener("click", () => {
  toggle("node-form", "add-node");
});

document.getElementById("node-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  const nodeName = document.getElementById("node-name").value;
  const nodeX = parseFloat(document.getElementById("node-x").value);
  const nodeY = parseFloat(document.getElementById("node-y").value);

  addNode(nodeName, nodeX, nodeY);

  clear(["node-name", "node-x", "node-y"]);
  toggle("add-node", "node-form");
});

document.getElementById("cancel-nodes").addEventListener("click", () => {
  clear(["node-name", "node-x", "node-y"]);
  toggle("add-node", "node-form");
});

document.getElementById("add-edge").addEventListener("click", () => {
  toggle("edge-form", "add-edge");
});
document.getElementById("edge-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  const fromNode = document.getElementById("from-node").value;
  const toNode = document.getElementById("to-node").value;

  addEdge(fromNode, toNode);

  clear(["from-node", "to-node"]);
  toggle("add-edge", "edge-form");
});

document.getElementById("cancel-edges").addEventListener("click", () => {
  clear(["from-node", "to-node"]);
  toggle("add-edge", "edge-form");
});

document.getElementById("rm-edge").addEventListener("click", () => {
  toggle("rm-edge-form", "rm-edge");
});

document.getElementById("rm-edge-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const fromNode = document.getElementById("rm-from-node").value;
  const toNode = document.getElementById("rm-to-node").value;

  removeEdge(fromNode, toNode);

  clear(["rm-from-node", "rm-to-node"]);

  toggle("rm-edge", "rm-edge-form");
});

document.getElementById("cancel-rm-edges").addEventListener("click", () => {
  clear(["rm-from-node", "rm-to-node"]);
  toggle("rm-edge", "rm-edge-form");
});
