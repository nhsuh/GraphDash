import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg } from "../graph-svg.js";
import { refresh, updateColor } from "./aux.js";
import { dragstarted, dragged, dragended } from "./ux.js";
import { calculateEdges, checkEulerian, checkBipartite } from "./properties.js";

const nodeHist = sessionStorage.getItem("nodesData");
export let nodes = nodeHist
  ? new Map(Object.entries(JSON.parse(nodeHist)))
  : new Map([
      [
        "A",
        {
          x: 500,
          y: 500,
          adj: [
            ["B", 3],
            ["D", 2],
          ],
          color: "steelblue",
        },
      ],
      [
        "B",
        {
          x: 300,
          y: 300,
          adj: [
            ["A", 3],
            ["C", 4],
          ],
          color: "steelblue",
        },
      ],
      ["C", { x: 400, y: 450, adj: [["B", 4]], color: "steelblue" }],
      ["D", { x: 200, y: 100, adj: [["A", 2]], color: "steelblue" }],
    ]);

export let edges = [];

calculateEdges();

checkBipartite();
checkEulerian();

console.log(nodes)

export function addNode(name, x, y, check) {
  const new_node = {
    x: x,
    y: y,
    adj: [],
    color: "steelblue",
  };
  nodes.set(name, new_node);
  refresh();
  const nodesObj = JSON.stringify(Object.fromEntries(nodes));
  sessionStorage.setItem("nodesData", nodesObj);
  if (check) {
    checkEulerian();
    checkBipartite();
  }
}

export function addEdge(from, to, check) {

  nodes.get(from).adj.push([to, null]);
  nodes.get(to).adj.push([from, null]);
  if (check) {
    checkEulerian();
    checkBipartite();
  }

  refresh();

  const nodesObj = JSON.stringify(Object.fromEntries(nodes));
  sessionStorage.setItem("nodesData", nodesObj);
}

export function removeEdge(fromNode, toNode, check) {

  const adj_from = nodes.get(fromNode).adj.findIndex((node) => node[0] === toNode);

  nodes.get(fromNode).adj.splice(adj_from, 1);
  const adj_to = nodes.get(toNode).adj.findIndex((node) => node[0] === fromNode);
  nodes.get(toNode).adj.splice(adj_to, 1);
  refresh();

  if (check) {
    checkEulerian();
    checkBipartite();
  }


  const nodesObj = JSON.stringify(Object.fromEntries(nodes));
  sessionStorage.setItem("nodesData", nodesObj);
}

export function removeNode(node, check) {
  const neighbors = nodes.get(node).adj;
  nodes.delete(node);
  for (const n of neighbors)
    nodes.get(n[0]).adj = nodes
      .get(n[0])
      .adj.filter((neighbor) => neighbor[0] !== node);
  edges = edges.filter((edge) => edge[0][0] !== node && edge[0][1] !== node);
  refresh();

  if (check) {
    checkEulerian();
    checkBipartite();
  }


  const nodesObj = JSON.stringify(Object.fromEntries(nodes));
  sessionStorage.setItem("nodesData", nodesObj);
}

export function contractEdge(fromNode, toNode, nodeName) {
  const mid_x = (nodes.get(fromNode).x + nodes.get(toNode).x) / 2;
  const mid_y = (nodes.get(fromNode).y + nodes.get(toNode).y) / 2;

  addNode(nodeName, mid_x, mid_y, false);
  for (const adjNode of nodes.get(fromNode).adj) {
    if (adjNode[0] !== nodeName) addEdge(adjNode[0], nodeName, false);
  }
  for (const adjNode of nodes.get(toNode).adj) {
    if (adjNode[0] !== nodeName) addEdge(adjNode[0], nodeName, false);
  }
  removeNode(toNode, false);
  removeNode(fromNode, false);

  checkEulerian();
  checkBipartite();


  const nodesObj = JSON.stringify(Object.fromEntries(nodes));
  sessionStorage.setItem("nodesData", nodesObj);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function bfs(startNode) {
  let visited = [];
  let visiting_queue = [];
  visiting_queue.push(startNode);
  visited.push(startNode);
  while (visiting_queue.length !== 0) {
    let curr = visiting_queue[0];
    await sleep(500);
    nodes.get(curr).color = "seagreen";
    updateColor();
    visiting_queue.splice(0, 1);
    for (let neighbor of nodes.get(curr).adj) {
      if (!visited.includes(neighbor[0])) {
        visiting_queue.push(neighbor[0]);
        visited.push(neighbor[0]);
      }
    }
  }
}
