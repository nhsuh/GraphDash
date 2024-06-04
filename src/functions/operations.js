import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg } from "../graph-svg.js";
import { refresh, updateColor } from "./aux.js";
import { dragstarted, dragged, dragended } from "./ux.js";
import { calculateEdges, checkEulerian, checkBipartite } from "./properties.js";

const nodeHist = sessionStorage.getItem("nodesData")
export let nodes = nodeHist ? new Map(Object.entries(JSON.parse(nodeHist))) :   new Map([
  ["A", { x: 500, y: 500, adj: [["B", null]], color: "steelblue" }],
  ["B", { x: 300, y: 300, adj: [["A", null], ["C", null]], color: "steelblue"  }],
  ["C", { x: 400, y: 450, adj: [["B", null]], color: "steelblue"  }],
]);

export let edges = [];

console.log(nodes)
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
  refresh();  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function addEdge(from, to) {
  edges.push([[from, to], null]);

  nodes.get(from).adj.push([to, null]);
  nodes.get(to).adj.push([from, null]);
  checkEulerian();

refresh();

  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function removeEdge(fromNode, toNode) {
  console.log(edges)
  edges = edges.filter(
    (edge) =>
      !(
        (edge[0][0] === toNode && edge[0][1] === fromNode) ||
        (edge[0][0] === fromNode && edge[0][1] === toNode)
      )
  );

  const adj_from = nodes.get(fromNode).adj.findIndex((node) => node === toNode);
  nodes.get(fromNode).adj.splice(adj_from, 1);
  const adj_to = nodes.get(toNode).adj.findIndex((node) => node === fromNode);
  nodes.get(toNode).adj.splice(adj_to, 1);
  refresh();


  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function removeNode(node) {
  const neighbors = nodes.get(node).adj;
  nodes.delete(node);
  for (const n of neighbors)
    nodes.get(n[0]).adj = nodes.get(n[0]).adj.filter((neighbor) => neighbor[0] !== node);
  edges = edges.filter(
    (edge) => edge[0][0] !== node && edge[0][1] !== node
  );

  refresh();


  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}


export function contractEdge(fromNode, toNode, nodeName) {
  const mid_x = (nodes.get(fromNode).x + nodes.get(toNode).x) / 2
  const mid_y = (nodes.get(fromNode).y + nodes.get(toNode).y) / 2

  addNode(nodeName, mid_x, mid_y)
  for (const adjNode of nodes.get(fromNode).adj) {
    if (adjNode[0] !== nodeName) addEdge(adjNode[0], nodeName)
    //addEdge(adj, nodeName)
  }
  for(const adjNode of nodes.get(toNode).adj) {
    if (adjNode[0] !== nodeName) addEdge(adjNode[0], nodeName)
  }
  removeNode(toNode)
  removeNode(fromNode)

  console.log(nodes)
  console.log(edges)

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
      if (!visited.includes(neighbor[0])) {
        visiting_queue.push(neighbor[0])
        visited.push(neighbor[0])
      }
    }
  }
}
