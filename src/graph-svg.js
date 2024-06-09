import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {
  addNode,
  addEdge,
  removeEdge,
  removeNode,
  contractEdge,
  nodes,
  edges,bfs
} from "./functions/operations.js";
import {
  dragstarted,
  dragged,
  dragended,
  toggle,
  clear,
} from "./functions/ux.js";
import {
  checkEulerian,
  checkBipartite,
  calculateEdges,
} from "./functions/properties.js";

export const svg = d3
  .select("graph")
  .append("svg")
  .attr("class", "bg-gray-800 rounded-xl")
  .attr("width", 800)
  .attr("height", 800);

export const ecdSvg = d3
  .selectAll("ecd")
  .append("svg")
  .attr("class", "bg-gray-800 rounded-xl")
  .attr("width", 1200)
  .attr("height", 700);

export const play_button = ecdSvg
  .append("text")
  .attr("x", 600)
  .attr("y", 350)
  .text("Play")
  .attr("class", "fill-gray-300").attr("font-size", 24)

export const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

svg
  .selectAll("path")
  .data(edges)
  .enter()
  .append("path")
  .attr("d", (d) =>
    line([
      { x: nodes.get(d[0][0]).x, y: nodes.get(d[0][0]).y },
      { x: nodes.get(d[0][1]).x, y: nodes.get(d[0][1]).y },
    ])
  )
  .style("stroke", "white");
svg
  .selectAll("circle")
  .data(Array.from(nodes.values())) // Bind data to circles using links
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x) // Position based on source node
  .attr("cy", (d) => d.y)
  .attr("r", 30) // Set radius
  .style("fill", (d) => d.color);

svg
  .selectAll(".node-labels")
  .data(Array.from(nodes.entries()))
  .enter()
  .append("text")
  .attr("class", "node-labels")
  .attr("x", (d) => d[1].x)
  .attr("y", (d) => d[1].y)
  .text((d) => d[0])
  .style("text-anchor", "middle") // Center text horizontally
  .style("dominant-baseline", "middle")
  .style("font-size", 12)
  .style("fill", "white");

calculateEdges()

  svg
  .selectAll(".edge-weights")
  .data(edges)
  .enter()
  .append("text")
  .attr("class", "edge-weights")
  .attr("x", (d) => ((nodes.get(d[0][1]).x + nodes.get(d[0][0]).x ) / 2) + 10)
  .attr("y", (d) => ((nodes.get(d[0][1]).y + nodes.get(d[0][0]).y) /2) -10)
  .text((d) => d[1])
  .style("font-size", 12)
  .style("fill", "white");


svg
  .selectAll("circle")
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

checkBipartite();

play_button.on("mouseover", () => {

  play_button.style("cursor", "pointer");
}).on("mouseout", () => {
  play_button.style("cursor", "default");

})

play_button.on("click", () => {
  bcEcd();
})
document.getElementById("add-node")?.addEventListener("click", () => {
  toggle("node-form", "add-node");
});

document.getElementById("node-form")?.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  const nodeName = document.getElementById("node-name").value;
  const nodeX = parseFloat(document.getElementById("node-x").value);
  const nodeY = parseFloat(document.getElementById("node-y").value);

  addNode(nodeName, nodeX, nodeY, true);

  clear(["node-name", "node-x", "node-y"]);
  toggle("add-node", "node-form");
});

document.getElementById("cancel-nodes")?.addEventListener("click", () => {
  clear(["node-name", "node-x", "node-y"]);
  toggle("add-node", "node-form");
});

document.getElementById("add-edge")?.addEventListener("click", () => {
  toggle("edge-form", "add-edge");
});
document.getElementById("edge-form")?.addEventListener("submit", (event) => {
  event.preventDefault(); 
  const fromNode = document.getElementById("from-node").value;
  const toNode = document.getElementById("to-node").value;

  addEdge(fromNode, toNode, true);

  clear(["from-node", "to-node"]);
  toggle("add-edge", "edge-form");
});

document.getElementById("cancel-edges")?.addEventListener("click", () => {
  clear(["from-node", "to-node"]);
  toggle("add-edge", "edge-form");
});

document.getElementById("rm-edge")?.addEventListener("click", () => {
  toggle("rm-edge-form", "rm-edge");
});

document.getElementById("rm-edge-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fromNode = document.getElementById("rm-from-node").value;
  const toNode = document.getElementById("rm-to-node").value;

  removeEdge(fromNode, toNode, true);

  clear(["rm-from-node", "rm-to-node"]);

  toggle("rm-edge", "rm-edge-form");
});

document.getElementById("cancel-rm-edges")?.addEventListener("click", () => {
  clear(["rm-from-node", "rm-to-node"]);
  toggle("rm-edge", "rm-edge-form");
});

document.getElementById("rm-node")?.addEventListener("click", () => {
  toggle("rm-node-form", "rm-node");
});

document.getElementById("cancel-rm-node")?.addEventListener("click", () => {
  clear(["rm-node"]);
  toggle("rm-node", "rm-node-form");
});

document.getElementById("rm-node-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const nodeName = document.getElementById("rm-node-name").value;
  removeNode(nodeName, true);

  clear(["rm-node"]);
  toggle("rm-node", "rm-node-form");
});
document.getElementById("ct-edge")?.addEventListener("click", () => {
  toggle("ct-edge-form", "ct-edge")
})
document.getElementById("cancel-ct-edge")?.addEventListener("click", () => {
  clear(["ct-edge-1", "ct-edge-2"])
  toggle("ct-edge", "ct-edge-form")
})

document.getElementById("ct-edge-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fromNode = document.getElementById("ct-edge-1").value;
  const toNode = document.getElementById("ct-edge-2").value;
  const nodeName = document.getElementById("ct-node-name").value;
  contractEdge(fromNode, toNode, nodeName);

  clear(["ct-edge-1", "ct-edge-2", "ct-node-name"])
  toggle("ct-edge", "ct-edge-form")
});

document.getElementById("bfs")?.addEventListener("click", () => {
  toggle("bfs-form", "bfs")
})
document.getElementById("cancel-bfs")?.addEventListener("click", () => {
  clear(["bfs-start"])
  toggle("bfs", "bfs-form")
})
document.getElementById("bfs-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  bfs(document.getElementById("bfs-start").value)
})
