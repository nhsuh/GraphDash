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

export function checkBipartite() {
  function dfs(node_name, node_prop,  color) {
    console.log(node_name, color_map)
    color_map.set(node_name, color)
    for (const neighbor of node_prop.adj) {
      if (color_map.has(neighbor) ){
        if (color_map.get(neighbor) === color_map.get(node_name)) {
          return false
        }
      }
      else {
        if (!dfs(neighbor, nodes.get(neighbor), 1- color)) { return  false }
      }
    }
    return true
  }
  let color_map = new Map()
  for (const node of nodes) {
    if (!color_map.has(node[0])) {
      if (!dfs(node[0], node[1], 0)) {
        document.getElementById("bipartite").textContent = "Is NOT Bipartite";
        return false
      }
    }
  }
  document.getElementById("bipartite").textContent = "Is Bipartite"
  return true
}