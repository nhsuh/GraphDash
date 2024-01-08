import { nodes, edges } from "./operations.js";
export function calculateAdj() {
  for (const edge of edges) {
    edge.first[1].adj.push(edge.second[0]);
    edge.second[1].adj.push(edge.first[0]);
  }
}
export function checkEulerian() {
  for (const node of nodes) {
    console.log(node[1].adj)
    if (node[1].adj.length === 0 || node[1].adj.length % 2) {
      document.getElementById("eulerian").textContent = "Is NOT Eulerian";
      return;
    }
  }
  document.getElementById("eulerian").textContent = "Is Eulerian";
}
