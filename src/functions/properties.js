import { nodes, edges } from "./operations.js";

function edgeEquiv(e, f) { return e[0][0] === f[0][0] && e[0][1] === f[0][1] }

export function calculateEdges() {
  edges.splice(0, edges.length)
  for (const [node, info] of nodes.entries()) {
    for (const neighbor of info.adj) {
      const sortedEdge = [[node, neighbor[0]].sort(), neighbor[1]];
      if(!edges.find(e => edgeEquiv(e, sortedEdge))) {
        edges.push(sortedEdge)
      }

    }
  }
}
export function checkEulerian() {
  for (const node of nodes) {
    if (node[1].adj.length === 0 || node[1].adj.length % 2) {
      if (document.getElementById("eulerian")) {
        document.getElementById("eulerian").textContent = "Is NOT Eulerian";
        return;
      }
    }
  }
  if (document.getElementById("eulerian"))
  document.getElementById("eulerian").textContent = "Is Eulerian";
}

export function checkBipartite() {
  function dfs(node_name, node_prop,  color) {
   color_map.set(node_name, color)
    for (const neighbor of node_prop.adj) {
      if (color_map.has(neighbor[0]) ){
        if (color_map.get(neighbor[0]) === color_map.get(node_name)) {
          return false
        }
      }
      else {
        if (!dfs(neighbor[0], nodes.get(neighbor[0]), 1- color)) { return  false }
      }
    }
    return true
  }
  let color_map = new Map()
  for (const [node, info] of nodes.entries()) {
    if (!color_map.has(node)) {
      let bipartision = dfs(node, info, 0)
      if (!bipartision) {
        if (document.getElementById("bipartite")) {
          document.getElementById("bipartite").textContent = "Is NOT Bipartite";
        }
        return false
      }
    }
  }  
  if (document.getElementById("bipartite")) document.getElementById("bipartite").textContent = "Is Bipartite"
  return true

}