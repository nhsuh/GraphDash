import { nodes, edges } from "./operations.js";
export function calculateAdj() {
  for (const edge of edges) {
    edge.first[1].adj.push(edge.second[0]);
    edge.second[1].adj.push(edge.first[0]);
  }
}

export function calculateEdges() {
  for (const node of nodes) {
    for (const adjNode of node[1].adj) {
      console.log(edges)
      const exists = edges.some(edge =>  {
        (edge.first == [node[0], node[1]] && edge.second == [adjNode, nodes.get(adjNode)]) || (edge.second == [node[0], node[1]] && edge.first == [adjNode, nodes.get(adjNode)]) 
      })
      if (!exists) {
        edges.push({first: [node[0], node[1]], second:[adjNode, nodes.get(adjNode)] })
      }
    }
  }
}
export function checkEulerian() {
  for (const node of nodes) {
    console.log(node[1].adj)
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