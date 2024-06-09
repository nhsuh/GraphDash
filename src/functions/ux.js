import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg, line } from "../graph-svg.js";
import { nodes, edges } from "./operations.js" 
import { calculateEdges } from "./properties.js";
export function dragstarted() {
  d3.select(this).classed("active", true);
}

export function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("cx", d.x).attr("cy", d.y);

  // Update edge paths
  svg
    .selectAll("path")
    .data(edges)
    .attr("d", (d) =>
      line([
        { x: nodes.get(d[0][0]).x, y: nodes.get(d[0][0]).y },
        { x: nodes.get(d[0][1]).x, y: nodes.get(d[0][1]).y },
      ])
    );
  svg
    .selectAll(".node-labels")
    .data(nodes.values())
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
calculateEdges()
  svg.selectAll(".edge-weights")
  .data(edges)
  .attr("x", (d) => ((nodes.get(d[0][1]).x + nodes.get(d[0][0]).x ) / 2) + 10)
  .attr("y", (d) => ((nodes.get(d[0][1]).y + nodes.get(d[0][0]).y) /2) -10 )
}

export function dragended(event, d) {
  d3.select(this).classed("active", false);
  const nodesObj = JSON.stringify(Object.fromEntries(nodes))
  sessionStorage.setItem("nodesData", nodesObj);
}

export function toggle(open, close) {
  document.getElementById(open).style.display = "block";
  document.getElementById(close).style.display = "none";
}

export function clear(elements) {
  for (const element of elements) {
    document.getElementById(element).value = "";
  }
}
