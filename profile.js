var svg = d3.select("#stackChart"),
    margin3 = {top: 20, right: 60, bottom: 30, left: 40},
    width3 = +svg.attr("width") - margin3.left - margin3.right,
    height3 = +svg.attr("height") - margin3.top - margin3.bottom,
    g3 = svg.append("g").attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

var x3 = d3.scaleBand()
    .rangeRound([0, width3])
    .padding(0.1)
    .align(0.1);

var y3 = d3.scaleLinear()
    .rangeRound([height3, 0]);

var z3 = d3.scaleOrdinal()
    .range(["#395D96", "#799DD6", "#BFD3F4", "#F9C2BA", "#E88C7F", "#E26D5C"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

/* Data verzamelen uit CSV */
d3.csv("profile.csv", type, function(error, data) {
  if (error) throw error;

  data.sort(function(a, b) { return b[data.columns[1]] / b.total - a[data.columns[1]] / a.total; });

  x3.domain(data.map(function(d) { return d.Gender; }));
  z3.domain(data.columns.slice(1));

/* Maakt grafiek */
  var serie = g3.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z3(d.key); });

  serie.selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x3(d.data.Gender); })
      .attr("y", function(d) { return y3(d[1]); })
      .attr("height", function(d) { return y3(d[0]) - y3(d[1]); })
      .attr("width", x3.bandwidth());

/* Maakt X as */
  g3.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height3 + ")")
      .call(d3.axisBottom(x3));

/* Maakt Y as incl label*/
  g3.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y3).ticks(10, "%"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Percentage");

/* Aanmaken legenda */
  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { var d = d[d.length - 1]; return "translate(" + (x3(d.data.Gender) + x3.bandwidth()) + "," + ((y3(d[0]) + y3(d[1])) / 2) + ")"; });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

/* Tekst van legenda */
  legend.append("text")
      .attr("x", 13)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.key; });
});

function type(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}
