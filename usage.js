var svgUsage = d3.select("#barChart"),
    margin2 = {top: 20, right: 20, bottom: 30, left: 40},
    width2 = +svgUsage.attr("width") - margin2.left - margin2.right,
    height2 = +svgUsage.attr("height") - margin2.top - margin2.bottom,
    g2 = svgUsage.append("g").attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width2])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height2, 0]);

var z = d3.scaleOrdinal()
    .range(["#395D96", "#799DD6", "#BFD3F4", "#F9C2BA", "#E88C7F", "#E26D5C"]);

/* Data verzamelen uit CSV */
d3.csv("usage.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.Gender; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    
/* Maakt de chart */    
  g2.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Gender) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height2 - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

/* X as */
  g2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height2 + ")")
      .call(d3.axisBottom(x0));

/* Y as incl label*/
  g2.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Aantal tieners");

/* Legenda */
  var legend2 = g2.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 9)
      .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice())
        .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend2.append("rect")
      .attr("x", width2 + 5)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", z);

  legend2.append("text")
      .attr("x", width2 - 1)
      .attr("y", 8)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});