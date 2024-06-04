import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { nodes, edges } from "./operations.js"
import { svg, line } from "../graph-svg.js";
import { dragstarted, dragged, dragended } from "./ux.js";

export function refresh() {
    svg.selectAll("path").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("text").remove();
    
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
  .selectAll("text")
  .data(Array.from(nodes.entries()))
  .enter()
  .append("text")
  .attr("x", (d) => d[1].x)
  .attr("y", (d) => d[1].y)
  .text((d) => d[0])
  .style("text-anchor", "middle") // Center text horizontally
  .style("dominant-baseline", "middle")
  .style("font-size", 12)
  .style("fill", "white");

svg
  .selectAll("circle")
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );
}

export function updateColor() {
  console.log(nodes)
  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  svg
    .selectAll("circle")
    .data(nodes.values()) // Bind data to circles using links
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x) // Position based on source node
    .attr("cy", (d) => d.y)
    .attr("r", 30) // Set radius
    .style("fill", (d) => 
      d.color);
  svg
    .selectAll("circle")
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
  svg
    .selectAll("text")
    .data(nodes.entries())
    .enter()
    .append("text")
    .attr("x", (d) => d[1].x)
    .attr("y", (d) => d[1].y)
    .text((d) => d[0])
    .style("text-anchor", "middle") // Center text horizontally
    .style("dominant-baseline", "middle")
    .style("font-size", 12)
    .style("fill", "white");
}