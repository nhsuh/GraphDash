import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


const nodes = [
  { name: "A", x: 500, y: 500, adj: [] },
  { name: "B", x: 300, y: 300, adj: [] },
  { name: "C", x: 400, y: 450, adj: [] },
];

const edges = [
  { first: nodes[0], second: nodes[1] },
  { first: nodes[1], second: nodes[2] },
  { first: nodes[2], second: nodes[0] },
];

if (checkEulerian()) {
  document.getElementById("eulerian").textContent = "Is Eulerian";
}
else {
  document.getElementById("eulerian").textContent = "Is NOT Eulerian";
}
const svg = d3
  .select("graph")
  .append("svg")
  .attr("class", "bg-gray-800 rounded-xl")
  .attr("width", 800)
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

calculateAdj();

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

  document.getElementById("node-name").value = "";
  document.getElementById("node-x").value = null;
  document.getElementById("node-y").value = null;
  document.getElementById("node-form").style.display = "none";
  document.getElementById("add-node").style.display = "block";
});

document.getElementById("cancel-nodes").addEventListener("click", () => {
  document.getElementById("node-name").value = "";
  document.getElementById("node-x").value = null;
  document.getElementById("node-y").value = null;
  document.getElementById("node-form").style.display = "none";
  document.getElementById("add-node").style.display = "block";
});

document.getElementById("add-edge").addEventListener("click", () => {
  document.getElementById("edge-form").style.display = "block";
  document.getElementById("add-edge").style.display = "none";
});
document.getElementById("edge-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  const fromNode = document.getElementById("from-node").value;
  const toNode = document.getElementById("to-node").value;

  addEdge(fromNode, toNode);

  document.getElementById("from-node").value = "";
  document.getElementById("to-node").value = "";
  document.getElementById("edge-form").style.display = "none";
  document.getElementById("add-edge").style.display = "block";
});

document.getElementById("cancel-edges").addEventListener("click", () => {
  document.getElementById("node-name").value = "";
  document.getElementById("node-x").value = null;
  document.getElementById("node-y").value = null;
  document.getElementById("edge-form").style.display = "none";
  document.getElementById("add-edge").style.display = "block";
});

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
    adj: []
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

function calculateAdj() {
  for (const edge of edges){
    edge.first.adj.push(edge.second)
    edge.second.adj.push(edge.first)
  }
  console.log(nodes)
}

function addEdge(from, to) {
  const from_i = nodes.findIndex((node) => node.name === from);
  const to_i = nodes.findIndex((node) => node.name === to);
  edges.push({ first: nodes[from_i], second: nodes[to_i] });

  nodes[from_i].adj.push(nodes[to_i])

  nodes[to_i].adj.push(nodes[from_i])
  console.log(nodes)
  if (checkEulerian()) {
    document.getElementById("eulerian").textContent = "Is Eulerian";
  }
  else {
    document.getElementById("eulerian").textContent = "Is NOT Eulerian";
  }

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
  svg.selectAll("circle").raise()
  svg.selectAll("text").raise()
}

function checkEulerian() {
  for (const node of nodes) {
    if (node.adj.length % 2) {
      return false
    }
  }
  return true
}
