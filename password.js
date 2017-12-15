var svgAge = d3.select("#pieChart"),
    width1 = +svgAge.attr("width"),
    height1 = +svgAge.attr("height"),
    radius1 = Math.min(width1, height1) / 2,
    g1 = svgAge.append("g").attr("transform", "translate(" + width1 / 2 + "," + height1 / 2 + ")");

/* Kleuren */
var color1 = d3.scaleOrdinal(["#BFD3F4", "#E88C7F", "#395D96", "#799DD6", "#F9C2BA", "#E26D5C"]);

var pie1 = d3.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var path1 = d3.arc()
    .outerRadius(radius1 - 10)
    .innerRadius(0);

/*Labels */
var label1 = d3.arc()
    .outerRadius(radius1 - 40)
    .innerRadius(radius1 - 40);

/* Data uit CSV verzamelen  */
d3.csv("password.csv", function(d) {
  d.population = +d.population;
  return d;
}, function(error, data) {
  if (error) throw error;

  var arc1 = g1.selectAll(".arc1")
      .data(pie1(data))
      .enter().append("g")
      .attr("class", "arc1");

/* Maakt de pie chart */
  arc1.append("path")
      .attr("d", path1)
      .attr("fill", function(d) { return color1(d.data.shared); });

/* Tekst in de pie chart */
  arc1.append("text")
      .attr("transform", function(d) { return "translate(" + label1.centroid(d) + ")"; })
      .attr("dy", "0.35em")
      .text(function(d) { return d.data.shared; });
});



