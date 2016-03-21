var radius = 110,
    padding = 110;

var color = d3.scale.ordinal()
    .range(["#801515", "#D46A6A"]);

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 45)

var outerRadius = radius,
    innerRadius = radius - 35;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.percent; })
    
d3.csv("data.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Team" && key !=="Record"; } ));

  data.forEach(function(d) {
    d.percent = color.domain().map(function(Team) {
      return {Team: Team, percent: +d[Team], };
    });
  });

  var legend = d3.select(".donut").append("svg")
      .attr("class", "legend")
      .attr("width", radius * 1.5)
      .attr("height", radius * 2)
    .selectAll("g")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 45 + ")"; });

  legend.append("rect")
      .attr("width", 40)
      .attr("height", 40)
      .style("fill", color);

  legend.append("text")
      .attr("x", 55)
      .attr("y", 6)
      .attr("dy", "1.75em")
      .attr("class", "body")
      .text(function(d) { return "% " + d; });

  var svg = d3.select(".donut").selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 2.05)
      .attr("height", radius * 2.2)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  svg.selectAll(".arc")
      .data(function(d) { return pie(d.percent); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.Team); });
         
  svg.append("text")
      .attr("dy", "-.5em")
      .attr("class", "body")
      .style("text-anchor", "middle")
      .text(function(d) { return d.Team; });

        svg.append("text")
      .attr("dy", "1.5em")
      .attr("class", "body")
      .style("text-anchor", "middle")
      .text(function(d) { return "Record: "+ d.Record});

  var g = svg.selectAll("g")
      .data(function (d) { return pie(d.percent); })
      .enter().append("g");

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("class", "arcLabel")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.percent == 0 ? "" : d.data.percent.toFixed(1) + "%" ; });


});
