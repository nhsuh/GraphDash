import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const nodes = [
    { name: "A", x: 500, y: 500 },
    { name: "B", x: 300, y: 300 },
    { name: "C", x: 400, y: 450 },
]

const edges = [
    { first: nodes[0], second: nodes[1] }, 
    { first: nodes[1], second: nodes[2] }, 
    { first: nodes[2], second: nodes[0] }, 
]

/*const links = [
    { source: {x: 250, y: 250 }, target: {x: 200, y: 200} },
    { source: {x: 200, y: 200}, target: {x: 100, y: 300}},
    { source: {x: 100, y: 300}, target: {x: 250, y: 250} }
  ];*/
const svg = d3.select("graph")
  .append("svg")
  .attr("class", "bg-gray-800 rounded-xl")
  .attr("width", 1000)
  .attr("height", 800);

d3.select("graph").attr("class", "flex justify-center ")


const line = d3.line()
  .x((d) => d.x)
  .y((d) => d.y);

svg.selectAll("path")
  .data(edges)
  .enter()
  .append("path")
  .attr("d", (d) => line([{ x: d.first.x, y: d.first.y }, { x: d.second.x, y: d.second.y }]))
  .style("stroke", "white");

const node_svg = svg.selectAll("circle")
  .data(nodes) // Bind data to circles using links
  .enter()
  .append("circle")
  .attr("cx", (d) => d.x) // Position based on source node
  .attr("cy", (d) => d.y)
  .attr("r", 30) // Set radius
  .style("fill", "steelblue");

svg.selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .text((d) => d.name)
  .style("text-anchor", "middle") // Center text horizontally
  .style("dominant-baseline", "middle")
  .style("font-size", 12)
  .style("fill", "black");

node_svg.call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
);

function dragstarted(event, d) {
    d3.select(this).classed("active", true);
}

function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
    d3.select(this).attr("cx", d.x).attr("cy", d.y);
  
    // Update edge paths
    svg.selectAll("path")
      .data(edges)
      .attr("d", (d) => line([{ x: d.first.x, y: d.first.y }, { x: d.second.x, y: d.second.y }]));
    svg.selectAll("text")
      .data(nodes)
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
}

function dragended(event, d){
    d3.select(this).classed("active", false);
}
