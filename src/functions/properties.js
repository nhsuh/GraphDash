import { nodes, edges } from "../graph-svg.js";
export function calculateAdj() {
  for (const edge of edges) {
    edge.first.adj.push(edge.second);
    edge.second.adj.push(edge.first);
  }
  console.log(nodes);
}
export function checkEulerian() {
  for (const node of nodes) {
    if (node.adj.length === 0 || node.adj.length % 2) {
      document.getElementById("eulerian").textContent = "Is NOT Eulerian";
      return;
    }
  }
  document.getElementById("eulerian").textContent = "Is Eulerian";
}
