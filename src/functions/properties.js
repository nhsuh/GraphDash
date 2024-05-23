import { nodes, edges } from "./operations.js";

export function calculateEdges() {
  for (const [node, info] of nodes.entries()) {
    console.log(node)
    for (const neighbor of info.adj) {
      const sortedEdge = [[node, neighbor[0]].sort(), neighbor[1]];
      edges.push(sortedEdge)

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
    console.log(node_name)
    console.log(node_prop)
   color_map.set(node_name, color)
    for (const neighbor of node_prop.adj) {
      if (color_map.has(neighbor[0]) ){
        console.log(node_name, neighbor[0])
        console.log(color_map)
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
  console.log(nodes.entries())
  for (const [node, info] of nodes.entries()) {
    console.log(node)
    console.log(info)
    if (!color_map.has(node)) {
      let bipartision = dfs(node, info, 0)
      console.log(bipartision)
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