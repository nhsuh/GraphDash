import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { svg, line } from "../graph-svg.js";
import { nodes, edges } from "./operations.js" 
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
        { x: nodes.get(d[0]).x, y: nodes.get(d[0]).y },
        { x: nodes.get(d[1]).x, y: nodes.get(d[1]).y },
      ])
    );
  svg
    .selectAll("text")
    .data(nodes.values())
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y);
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
