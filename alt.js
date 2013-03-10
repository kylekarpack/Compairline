function f(data) {

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1, 1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var svg = d3.select("body").append("svg")
    .attr("width", width + margin + margin)
    .attr("height", height + margin + margin)
  .append("g")
	.attr("id", "viewport")
    .attr("transform", "translate(" + margin + "," + margin + ")");

d3.csv(data, function(error, data) {

  data.forEach(function(d) {
    d.delay = +d.delay;
  });

  x.domain(data.map(function(d) { return d.airline; }));
  y.domain([0, d3.max(data, function(d) { return d.delay; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text("Dekay Time");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", function(d) { return d.airline })
	  .classed("bar", true)
      .attr("x", function(d) { return x(d.airline); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.delay); })
      .attr("height", function(d) { return height - y(d.delay); });

  d3.select("input").on("change", change);

  $("input#change").click(change);

  function change() {

    // Copy-on-write since tweens are evaluated after a delay.
    var x0 = x.domain(data.sort(this.checked
        ? function(a, b) { return b.delay - a.delay; }
        : function(a, b) { return d3.ascending(a.airline, b.airline); })
        .map(function(d) { return d.airline; }))
        .copy();

    var transition = svg.transition().duration(750),
        delay = function(d, i) { return i * 50; };

    transition.selectAll(".bar")
        .delay(delay)
        .attr("x", function(d) { return x0(d.airline); });

    transition.select(".x.axis")
        .call(xAxis)
      .selectAll("g")
        .delay(delay);
  }
});
}