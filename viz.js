// dimensions. relative to window size
// these should be made more robust
var margin = $(window).width() / 20;
var width = $(window).width() - margin * 5;
var height = $(window).height() - 150;
var count = 0; // track the number of vizualizations asked for

// Deprecated responsive code
// $(window).on("resize", function() {
	// var chart = $("svg");
	// if (chart.length !== 0) {
		// margin = $(window).width() / 20;
		// width = $(window).width() - margin * 5;
		// height = $(window).height() - 150;
		// chart.attr("width", width+margin);
		// chart.attr("height", height+margin);
	// }
// });
	
//Draw function. This is where the money is at
function draw(data, flag) {	
	$('svg').remove();
	$("#cust1").show(); //bugfix
	$("#brushing .checkbox").hide(); //bugfix
	$("#brushing .checkbox").hide();
	
	if (flag === "bar") {
		$("#brushing .checkbox").fadeIn();
		var x = d3.scale.ordinal()
			.rangeRoundBands([0, width], .1, .1);

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
				.attr("transform", "rotate (90, " + -margin + ", 0)")
				.attr("x", height / 2 - margin)
				.attr("y", -15)
				.style("text-anchor", "end")
				.text("Delay Time");

		  svg.selectAll(".bar")
			  .data(data)
			.enter().append("rect")
			  .attr("class", function(d) { return d.airline })
			  .classed("bar", true)
			  .attr("x", function(d) { return x(d.airline); })
			  .attr("width", x.rangeBand())
			  .attr("y", function(d) { return y(d.delay); })
			  .attr("data-delay", function(d) { return d.delay; })
			  .attr("height", function(d) { return (height - y(d.delay)) > 0 ? height - y(d.delay) : 0; });

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
	} else if (flag === "plot") {

		//.append('<li><a href="#tab"' + count + ' data-toggle="tab">Viz ' + count + '</a></li>')

		var svg = d3.select("#vizualization")
			.append("svg")
			.attr("width", width+margin) 
			.attr("height", height+margin)
			//.attr("viewBox", "0 0 " + width + " " + (height + margin))
			.attr("preserveAspectRatio", "xMidYMid")
		
		var g = svg.append('g')
			.attr('id', 'viewport');
		
		
		// Takes parameters: data, name of the airline
		// Does: Draws the CIRCLES ONLY for that airline
		function graphAirline(data, name) {	
			//draw pounts
			g
				.selectAll("circle." + name)
					.data(data) 
					.enter()
					.append("circle")
						.attr("class", name.toUpperCase())
						.attr("r", 3);
		}
				
		// wipe table in prep
		var table = $("#table table");
		table.children().remove();
		table.append("<tr><th>Date</th><th>Airline</th><th>Delay</th></tr>");
		function populateTable(data, name) {
			// append header row
			try {
				var d = new Date(data[0].date);
				dateStr = d.getMonth() + 1 + "/" + d.getDate() + "/" + parseInt(d.getYear() + 1900);
				//populate table
				table.append("<tr><td>" + 
										dateStr + 
										"</td><td>" + name.toUpperCase() + 
										"</td><td>" + data[0].delay + 
										"</td></tr>");
			} catch(err) {
				// remove this line for production
				console.warn("Empty object passed, accessing its fields yielded a: " + err);
			}
		}
		
		//loop through response data and plot it
		var allKeys = Object.keys(data);
		var allData = new Array();
		for (var i = 0; i < allKeys.length; i++) {
			populateTable(data[allKeys[i]], allKeys[i].toLowerCase());
			graphAirline(data[allKeys[i]], allKeys[i].toLowerCase());
			allData = allData.concat(data[allKeys[i]]);			
		}		
		
		var x_extent = d3.extent(allData, function(d){return d.date});
		var x_scale = d3.time
						.scale()
						.domain(x_extent)
						.range([margin, width]);
		
		var y_extent = d3.extent(allData, function(d){return d.delay});
		var y_scale = d3.scale
						.linear()
						.domain(y_extent)
						.range([height, margin]);

		d3.selectAll("circle")  
			.attr("cx", function(d){return x_scale(d.date) })
			.attr("data-date", function(d){return d.date })
			.attr("cy", function(d){return y_scale(d.delay) })
			.attr("data-delay", function(d){return d.delay })
		
		//Create Axes
		var x_axis = d3.svg.axis()
					.scale(x_scale)
		g
			.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height) + ")")
			.call(x_axis)
			.selectAll("text")
				.attr("text-anchor", null); // align the tick labels
		
		var y_axis = d3.svg.axis()
					.scale(y_scale)
					.orient("left");
		g
			.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + margin + ", 0 )")
			.call(y_axis);
		
		// Axis titles
		d3.select(".x.axis")
			.append("text")
			.text("Date")
			.attr("x", function(){return width / 2 })
			.attr("y", margin); 
		
		d3.select(".y.axis")
			.append("text")
			.text("Average Delay (Minutes)")
			.attr("transform", "rotate (90, " + -margin + ", 0)")
			.attr("x", height / 2 - margin)
			.attr("y", -15);
		
		//Paths
		var line = d3.svg.line().x(function(d){return x_scale(d.date)}).y(function(d){return y_scale(d.delay)}).interpolate("basis");

		for (var i = 0; i < allKeys.length; i++) {
			animate(g
				.append("path")
				.attr("d", line(data[allKeys[i]]))
				.attr("class", allKeys[i] + " trend"));
		}
		
		//smooth animations (hacky)
		function animate(path) {
			var totalLength = path.node().getTotalLength();
			path
			  .attr("stroke-dasharray", totalLength + " " + totalLength)
			  .attr("stroke-dashoffset", totalLength)
			  .transition()
				.duration(1500)
				.ease("linear")
				.attr("stroke-dashoffset", 0);
		}
		
		//focus/context 
		
		// var sortTimeout = setTimeout(function() {
			// d3.select("input.change").property("checked", true).each(change);
		  // }, 2000);
	
	} else {	//heatmap
		$("#cust1").hide();
		width = width + margin * 3; // this viz can be wider
		height = $(window).height() - margin;
		var svg = d3.select("#vizualization").append("svg")
			.attr("width", width)
			.attr("height", height)
		 
		//append viewport
		var g = svg.append("g")
			.attr("id", "viewport")
			.attr("transform", "translate(" + (margin + 20) + ", 0)");
		
		// get grid size based on width and height
		var isW = Math.floor($("svg").width() / 24);
		var isH = Math.floor($("svg").height() / 7);
		
		var gridSize = isW < isH ? isW : isH;
			h = gridSize,
			w = gridSize;

		var maxDelay = d3.extent(data, function(d) { return d[1] })[1];
		var heatMap = g.selectAll(".heatmap")
			.data(data, function(d) { return d[0][0] + ':' + d[0][1]; })
		  .enter().append("svg:rect")
			.attr("x", function(d) { return d[0][0] * w; })
			.attr("y", function(d) { return d[0][1] * h; })
			.attr("class", "heat")
			.attr("data-count", function(d) { return d[2] })
			.style("fill", function(d) { 
				// calculate colors on the fly
				var opac = Math.abs(d[1] / maxDelay),
					hMod = parseFloat(d[1] / maxDelay),
					hMin = 0,
					hMax = 60;
				var newMod = (1 - hMod) * hMax,
					l = newMod * 1.4 > 60 ? newMod * 1.4 : 60;
					color = hMod < 0 ? "rgba(0,0,255," + opac + ")" : "hsl(" + newMod + ", 90%, " + l + "%)";
				return color;
			})
			.attr("data-delay", function(d) { return d[1] })
			.attr("data-date" , function(d) { return "Time: " + d[0][0] + ":00, Day: " + d[0][1] })
			//.attr("data-content" , function(d) { return "Average Delay: " + d[1] })
			.transition()
				.delay( function(d, i) { return 5 * i; })
				.duration(1000) //animate their growth
			.attr("width", function(d) { return w; })
			.attr("height", function(d) { return h; })

		
		//fill window up after drawing
		svg.attr("width", $(window).width());
		
		var x_extent = d3.extent(data, function(d){return d[0][0]});
		x_extent = [0,24];
		var x_scale = d3.scale.linear()
							.domain(x_extent)
							.range([margin, width + margin]);
		
		//var y_extent = d3.extent(data, function(d){return d[0][1]});
		//y_extent = [0,7];
		//hardcoding this was wa easier
		var y_extent = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
		
		var y_scale = d3.scale.ordinal()
						.domain(y_extent)
						.rangeBands([0, 7 * h]);		
		
		var x_axis = d3.svg.axis()
			.scale(x_scale)
			.orient("bottom")
			.ticks(24);
		
		g.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(-" + margin + ", " + (h * 8) + ")") //not sure why the modifier was needed
			.call(x_axis);
		
		var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(8);
		g.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0, " + h + ")")
			.call(y_axis);
		
		//a xis titles
		d3.select(".x.axis").append("text").text("Time").attr("x", function(){return width / 2 }).attr("y", margin); 
		// removed y axis title to save space
		//d3.select(".y.axis").append("text").text("Day of the Week").attr("transform", "rotate (90, " + -margin + ", 0)").attr("x", 3 * h - margin).attr("y", 0);		
	}
	
	// TOOLTIPS and Brushing
	// This needs to run after the SVGs have been loaded into the DOM

	var localData = $(".local-data");
	
    d3.selectAll("circle")
		.on("mouseover", function() {
			$(this).animate({"stroke-width":"5"}, 200);
			customOver(this);
			//attributes
			
		})
        //remove them on mouseout
		.on("mouseout",  function() {
			$(this).animate({"stroke-width":""}, 200);
        });
		
		d3.selectAll(".trend, .bar")
			.on("mouseover", function() {
				customOver(this); // labeling
				var cl = $(this).attr("class").split(" ")[0];
				d3.selectAll(".trend:not(." + cl + "), .bar:not(." + cl + ")").classed("not", true);
				d3.select(this).classed("target",true);
				d3.selectAll("circle." + cl).classed("target",true);
				$(".labels label").not($(".labels label." + cl)).addClass("labelDim"); //dim others
			}).on("mouseout",  function() {
				var cl = $(this).attr("class").split(" ")[0];
				d3.selectAll(".trend, .bar").classed("not",false);
				d3.select(this).classed("target",false);
				d3.selectAll("circle." + cl).classed("target",false);
				$(".labels label").removeClass("labelDim"); //dim others
			});
		
		// Dimming for heatmap
		d3.selectAll(".heat")
			.on("mouseover", function() {
				customOver(this);
				d3.selectAll(".heat").classed("not", true);
				d3.select(this).classed("not",false);
				d3.select(this).classed("target",true);
			}).on("mouseout", function() {
				d3.selectAll(".heat").classed("not", false);
				d3.select(this).classed("target",false);
			});
			
		function customOver(target) {
			localData.removeClass("gone");
			var delay = Math.round(target.getAttribute("data-delay") * 100) / 100 // only attribute used for all three
			
			if (!d3.select(target).classed("heat")) {
				var airline = target.getAttribute("class").split(" ")[0];

				$.ajax({
					url: 'functions.php',
					data: {"abbrev":airline},
					success: function(data) { 
					//show/hide and data
						if (!d3.select(target).classed("bar")) {
							var date = new Date(parseInt(target.getAttribute("data-date"))),
							dateStr = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()

							localData
								.html("<h2 class='delay'>" + delay + "<small> minutes</small></h1><b>Airline:</b> " + data + "<br /><b>Date: </b>" + dateStr)
						} else {
							localData
								.html("<h2 class='delay'>" + delay + "<small> minutes</small></h1><b>Airline:</b> " + data + "<br />")
						}
					}
				});
			} else {
				localData
					.html("<h2 class='delay'>" + delay + "<small> minutes</small></h1>" + $(target).attr("data-date"))
			}
		}
		
		//labels BRUSHING
		//brushing
		$('#brushing .labels label').mouseenter(function() {
			$(".labels label").not($(this)).addClass("labelDim"); //dim others
			var className = $(this).attr('class');
			d3.selectAll('circle:not(.' + className + '), path.trend:not(.' + className + '), rect:not(.' + className + ')')
				.classed("not", true);
			d3.selectAll('circle.' + className + ', .trend.' + className + ', rect.' + className)
				.classed("target",true);
		}).mouseleave(function() {
			var otherLabels = $(".labels label").not($(this));
			var className = $(this).attr('class');
			d3.selectAll('circle:not(.' + className + '), path.trend:not(.' + className + '), rect:not(.' + className + ')')
				.classed("not", false);
			d3.selectAll('circle.' + className + ', .trend.' + className + ', rect.' + className)
				.classed("target",false);
			otherLabels.removeClass("labelDim");
		});
		

} //END DRAW