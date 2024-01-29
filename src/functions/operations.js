import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg, ecdSvg, line, play_button } from "../graph-svg.js";
import { dragstarted, dragged, dragended } from "./ux.js";
import { calculateEdges, checkEulerian, checkBipartite } from "./properties.js";

const nodeHist = sessionStorage.getItem("nodesData")
export let nodes = nodeHist ? new Map(Object.entries(JSON.parse(nodeHist))) :   new Map([
  ["A", { x: 500, y: 500, adj: ["B"], color: "steelblue" }],
  ["B", { x: 300, y: 300, adj: ["A", "C"], color: "steelblue"  }],
  ["C", { x: 400, y: 450, adj: ["B"], color: "steelblue"  }],
]);

let next_button;

export let edges = [];

calculateEdges();

checkBipartite();
checkEulerian();

export function addNode(name, x, y) {
  const new_node = {
    x: x,
    y: y,
    adj: [],
    color: "steelblue"
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
    .style("fill", (d) => d.color);
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
  edges.push([from, to]);

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
        { x: nodes.get(d[0]).x, y: nodes.get(d[0]).y },
        { x: nodes.get(d[1]).x, y: nodes.get(d[1]).y },
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
        (edge[0] === toNode && edge[1] === fromNode) ||
        (edge[0] === fromNode && edge[1] === toNode)
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
        { x: nodes.get(d[0]).x, y: nodes.get(d[0]).y },
        { x: nodes.get(d[1]).x, y: nodes.get(d[1]).y },
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
  nodes.delete(node);
  for (const n of neighbors)
    nodes.get(n).adj = nodes.get(n).adj.filter((neighbor) => neighbor !== node);
  edges = edges.filter(
    (edge) => edge[0] !== node && edge[1] !== node
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
        { x: nodes.get(d[0]).x, y: nodes.get(d[0]).y },
        { x: nodes.get(d[1]).x, y: nodes.get(d[1]).y },
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
    .style("fill", (d) => d.color);
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

export function contractEdge(fromNode, toNode, nodeName) {
  const mid_x = (nodes.get(fromNode).x + nodes.get(toNode).x) / 2
  const mid_y = (nodes.get(fromNode).y + nodes.get(toNode).y) / 2

  addNode(nodeName, mid_x, mid_y)
  for (const adjNode of nodes.get(fromNode).adj) {
    if (adjNode !== nodeName) addEdge(adjNode, nodeName)
    //addEdge(adj, nodeName)
  }
  for(const adjNode of nodes.get(toNode).adj) {
    if (adjNode !== nodeName) addEdge(adjNode, nodeName)
  }
  removeNode(toNode)
  removeNode(fromNode)
  console.log(nodes)

  checkEulerian();
  checkBipartite();

  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function bfs(startNode) {
  console.log("bfs", startNode)
  let visited = []
  let visiting_queue = []
  visiting_queue.push(startNode)
  visited.push(startNode)
  while (visiting_queue.length !== 0) {
    let curr = visiting_queue[0]
    console.log(curr)
    await sleep(500)
    nodes.get(curr).color = "seagreen"
    updateColor()
    visiting_queue.splice(0, 1)
    for (let neighbor of nodes.get(curr).adj) {
      if (!visited.includes(neighbor)) {
        visiting_queue.push(neighbor)
        visited.push(neighbor)
      }
    }
  }
}
function updateColor() {
  console.log(nodes)
  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  svg
    .selectAll("circle")
    .data(nodes.values()) // Bind data to circles using links
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x) // Position based on source node
    .attr("cy", (d) => d.y)
    .attr("r", 30) // Set radius
    .style("fill", (d) => 
      d.color);
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
}