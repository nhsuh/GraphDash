import { nodes, edges } from "./operations.js";

export function calculateEdges() {
  for (const [node, info] of nodes.entries()) {
    console.log(node)
    for (const neighbor of info.adj) {
      const sortedEdge = [node, neighbor].sort();
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
    console.log(color)
    console.log(color_map)
    console.log(node_name, node_prop)
    color_map.set(node_name, color)
    for (const neighbor of node_prop.adj) {
      if (color_map.has(neighbor) ){
        console.log(node_name, neighbor)
        console.log(color_map)
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
  for (const [node, info] of nodes.entries()) {
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
  /*let color_map = new Map()
  console.log(nodes)
  for (const [node, info] of nodes.entries()) {
    console.log(node)
    console.log(color_map)
    if (!color_map.has(node)) {
      if (!dfs(node, info, 0)) {
       
        return false
      }
    }
  }
  if (document.getElementById("bipartite")) document.getElementById("bipartite").textContent = "Is Bipartite"
  return true*/
}