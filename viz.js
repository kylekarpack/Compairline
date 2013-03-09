// dimensions. relative to window size
// these should be made more robust
var margin = $(window).width() / 20;
var width = $(window).width() - margin * 5;
var height = $(window).height() - 150;
var count = 0; // track the number of vizualizations asked for


// Implemented but buggy
$(window).on("resize", function() {
	var chart = $("svg");
	if (chart.length !== 0) {
		margin = $(window).width() / 20;
		width = $(window).width() - margin * 5;
		height = $(window).height() - 150;
		chart.attr("width", width+margin);
		chart.attr("height", height+margin);
	}
});
	
//Draw function. This is where the money is at
function draw(data, flag) {
	count++;
	
	if (flag === "plot") {

		// show brushing
		$("#brushing").show("slide", { direction: "right" }, 500);

		//.append('<li><a href="#tab"' + count + ' data-toggle="tab">Viz ' + count + '</a></li>')

		d3.select("#vizualization")
			.append("svg")
			.attr("class", "viz" + count)
			.attr("width", width+margin) 
			.attr("height", height+margin)
			.attr("viewBox", "0 0 " + width + " " + (height + margin))
			.attr("preserveAspectRatio", "xMidYMid");
		
		
		var svg = d3.select("svg.viz" + count);
		// Takes parameters: data, name of the airline
		// Does: Draws the CIRCLES ONLY for that airline
		function graphAirline(data, name) {	
			//draw pounts
			svg
				.selectAll("circle." + name)
					.data(data) 
					.enter()
					.append("circle")
						.attr("class", name.toUpperCase())
						.attr("r", 4);
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
		svg
			.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (height) + ")")
			.call(x_axis)
			.selectAll("text")
				.attr("text-anchor", null); // align the tick labels
		
		var y_axis = d3.svg.axis()
					.scale(y_scale)
					.orient("left");
		svg
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
			.attr("y", 0);
		
		//Paths
		var line = d3.svg.line().x(function(d){return x_scale(d.date)}).y(function(d){return y_scale(d.delay)}).interpolate("basis");

		for (var i = 0; i < allKeys.length; i++) {
			animate(d3.select("svg").append("path").attr("d", line(data[allKeys[i]])).attr("class", allKeys[i] + " trend"));
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
	} else {	//heatmap
		var svg = d3.select("body").append("svg")
			.attr("width", width + margin)
			.attr("height", height + margin)
		  .append("g")
			.attr("transform", "translate(" + margin + "," + margin + ")");
		
		var isW = Math.floor($("svg").width() / 25);
		var isH = Math.floor($("svg").height() / 7);
		
		var gridSize = isW < isH ? isW : isH;
			h = gridSize,
			w = gridSize,
			rectPadding = 60;

		var heatMap = svg.selectAll(".heatmap")
			.data(data, function(d) { return d[0][0] + ':' + d[0][1]; })
		  .enter().append("svg:rect")
			.attr("x", function(d) { return d[0][0] * w; })
			.attr("y", function(d) { return d[0][1] * h; })
			.style("fill", function(d) { 
				var opac = Math.abs(d[1] / 20) < 1 ? Math.abs(d[1] / 20) : 1;
				var color = d[1] < 0 ? "rgba(0,0,255," + opac + ")" : "rgba(255,0,0," + opac + ")"
				return color;
			})
			//.style("border", $(windo
			.attr("value", function(d) { return d[1] })
			.attr("data-original-title" , function(d) { return "Time: " + d[0][0] + ":00, Day: " + d[0][1] })
			.attr("data-content" , function(d) { return "Average Delay: " + d[1] })
			.transition().delay( function(d, i) { return 5 * i; }).duration(1000) //animate their growth
			.attr("width", function(d) { return w; })
			.attr("height", function(d) { return h; });
		

		var x_extent = d3.extent(data, function(d){return d[0][0]});
		x_extent = [0, 24];
		var x_scale = d3.scale.linear().domain(x_extent).range([.5 * margin, width]);
		
		var y_extent = d3.extent(data, function(d){return d[0][1]});
		var y_scale = d3.scale.linear().domain(y_extent).range([margin, 8 * h]);		
		
		var x_axis = d3.svg.axis().scale(x_scale);
		d3.select("svg").append("g").attr("class", "x axis").attr("transform", "translate(" + margin / 2 + "," + (margin + h * 8) + ")").call(x_axis);
		
		var y_axis = d3.svg.axis().scale(y_scale).orient("left").ticks(8);
		d3.select("svg").append("g").attr("class", "y axis").attr("transform", "translate(" + margin + ", " + margin + " )").call(y_axis);
		
		//axis titles
		d3.select(".x.axis").append("text").text("Time").attr("x", function(){return width / 2 }).attr("y", margin); 
		d3.select(".y.axis").append("text").text("Day of the Week").attr("transform", "rotate (90, " + -margin + ", 0)").attr("x", 3 * h - margin).attr("y", 0);		
	}
	
	//TOOLTIPS
	
	var localData = d3.select("body")
        .append("div")
        .attr("class", "local-data hiddenPop");

    d3.selectAll("circle")
		.on("mouseover", function(d,i) {
			$(this).animate({"stroke-width":"6"}, 200);
			$(this).attr("r", 6);

			var off = $('svg').offset();
			var mouse = d3.mouse(this);
			//attributes
			var delay = Math.round(this.getAttribute("data-delay") * 100) / 100,
				date = new Date(parseInt(this.getAttribute("data-date"))),
				dateStr = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear(),
				airline = this.getAttribute("class");
			
			$.ajax({
				url: 'functions.php',
				data: {"abbrev":airline},
				success: function(data) { 
				//show/hide and data
					localData
						.classed("hiddenPop", false)
						.attr("style", "left:" + mouse[0] + "px;top:" + mouse[1] + "px")
						.html("<h2 class='delay'>" + delay + "<small> minutes</small></h1><b>Airline:</b> " + data + "<br /><b>Date: </b>" + dateStr)
				}
			});
		})
        //remove them on mouseout
		.on("mouseout",  function() {
			$(this).animate({"stroke-width":0}, 200);
			$(this).attr("r", 4);
			localData.classed("hiddenPop", true);
        });

} //END DRAW