import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const nodes = [
  { name: "A", x: 500, y: 500 },
  { name: "B", x: 300, y: 300 },
  { name: "C", x: 400, y: 450 },
];

const edges = [
  { first: nodes[0], second: nodes[1] },
  { first: nodes[1], second: nodes[2] },
  { first: nodes[2], second: nodes[0] },
];
const svg = d3
  .select("graph")
  .append("svg")
  .attr("class", "bg-gray-800 rounded-xl")
  .attr("width", 1000)
  .attr("height", 800);

const line = d3
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
      { x: d.first.x, y: d.first.y },
      { x: d.second.x, y: d.second.y },
    ])
  )
  .style("stroke", "white");

svg
  .selectAll("circle")
  .data(nodes) // Bind data to circles using links
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x) // Position based on source node
  .attr("cy", (d) => d.y)
  .attr("r", 30) // Set radius
  .style("fill", "steelblue");

svg
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .text((d) => d.name)
  .style("text-anchor", "middle") // Center text horizontally
  .style("dominant-baseline", "middle")
  .style("font-size", 12)
  .style("fill", "white");

svg
  .selectAll("circle")
  .call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );

document.getElementById("add-node").addEventListener("click", () => {
  document.getElementById("node-form").style.display = "block";
  document.getElementById("add-node").style.display = "none";
});

document.getElementById("node-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  const nodeName = document.getElementById("node-name").value;
  const nodeX = parseFloat(document.getElementById("node-x").value);
  const nodeY = parseFloat(document.getElementById("node-y").value);

  addNode(nodeName, nodeX, nodeY);

  document.getElementById("node-name").value = ""
  document.getElementById("node-x").value = null
  document.getElementById("node-y").value = null
  document.getElementById("node-form").style.display = "none";
  document.getElementById("add-node").style.display = "block";
});

document.getElementById("cancel").addEventListener("click", () => {
  document.getElementById("node-name").value = ""
  document.getElementById("node-x").value = null
  document.getElementById("node-y").value = null
  document.getElementById("node-form").style.display = "none";
  document.getElementById("add-node").style.display = "block";

})

function dragstarted(event, d) {
  d3.select(this).classed("active", true);
}

function dragged(event, d) {
  d.x = event.x;
  d.y = event.y;
  d3.select(this).attr("cx", d.x).attr("cy", d.y);

  // Update edge paths
  svg
    .selectAll("path")
    .data(edges)
    .attr("d", (d) =>
      line([
        { x: d.first.x, y: d.first.y },
        { x: d.second.x, y: d.second.y },
      ])
    );
  svg
    .selectAll("text")
    .data(nodes)
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y);
}

function dragended(event, d) {
  d3.select(this).classed("active", false);
}

function addNode(name, x, y) {
  const new_node = {
    name: name,
    x: x,
    y: y,
  };
  nodes.push(new_node);
  svg
    .selectAll("circle")
    .data(nodes) // Bind data to circles using links
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x) // Position based on source node
    .attr("cy", (d) => d.y)
    .attr("r", 30) // Set radius
    .style("fill", "steelblue");
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
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .text((d) => d.name)
    .style("text-anchor", "middle") // Center text horizontally
    .style("dominant-baseline", "middle")
    .style("font-size", 12)
    .style("fill", "white");
}
