//THIS IS ALL FRONT END CODE
$(document).ready(function() {	
	
	// deferred load the stylesheet
	$.ajax({
		url:"colors.php",
		data: {},
		success: function(data) {
			$("head").append("<style>" + data + "</style>");
		}
	});	
	
	// reload handler for errors
	$(".modal-footer button").click(function() {
		location.reload();
	});
	
	// construct date range slider
	$(".dateSlider").dateRangeSlider({	
		arrows: false,
		formatter: function(val) {
			var month = val.getMonth() + 1,
				year = val.getYear() + 1900;
			return month + "/" + year;
		},
		bounds: {
				min: new Date(2000, 0, 1),
				max: new Date(2012, 12, 31)
				},
		 defaultValues: {
				min: new Date(2011, 0, 1),
				max: new Date(2012, 12, 31)
				},
	});
	
	// prevent default behavior (important!)
	$('.dropdown-menu').click(function(e) {
		 e.stopPropagation();
	 });
	 
	 // alt clicking for selecting only 1
	 // $('.dropdown-menu input').click(function(e) {
		// $(this).parent().toggleClass("noBG");
		// var cl = $(this).attr("name").toUpperCase();
		// if (e.ctrlKey || e.altKey) {
			// $(this).parent().parent().parent().find("input").prop("checked",false).parent().addClass("noBG");
			// $(this).prop("checked",true).parent().removeClass("noBG");
			// $("#brushing label").not("." + cl).toggle();			
		// } else {
			// $("#brushing label." + cl).toggle();
		// }
	 // });
		
		
	// toggle background
	$('.dropdown-menu input').click(function() {
		var cl = $(this).attr("name");
		$(this).parent().toggleClass("noBG");
		$("#brushing .labels label." + cl).toggle();
		
	});
	 // Attach handler for the "Done" button
	$(".dropdown-menu .btn-success").bind("click", function() {
		$(this).parent().parent().toggleClass("open");
	});
	 
	 // Handler for the select all button
	$(".dropdown-menu .btn-primary").bind("click", function() {
		$(this).toggleClass("first").toggleClass("btn-danger");
		if ($(this).hasClass("first")) {
			$(this).text("Select None");
			$(this).parent().find("input").prop("checked",true).parent().removeClass("noBG");
			$("#brushing label").show();
		} else {
			$(this).text("Select All");
			$("#brushing label").hide();
			$(this).parent().find("input").prop("checked",false).parent().addClass("noBG");
		}
	 });
	 
	// Close menu handler
	$("div > .close").bind("click", function() {
		$(this).parent().slideUp(function() { $("img.tools").fadeIn() })
		$("#brushing").show("slide", { direction: "right" }, 500);		
	});
	
	$(".closeLabel").bind("click", function() {
		$(this).parent().slideUp();
		var cl = $(this).parent().attr("class");
		$("svg ." + cl).fadeOut();
	});
	
	
	$(".closeLeft").bind("click", function() {
		$(this).parent().hide("slide", { direction: "right" }, 500);
	});
	
	// slide down the controls on click
	$("img.tools.top").click(function() {
		$("#controls").slideDown();
		$("#brushing").hide("slide", {direction: "right"}, 500);
		$(this).fadeOut();
	});
	
	$("img.tools.bottom").click(function() {
		$("#table").show("slide", {direction: "down"}, 500);
		$("#brushing").hide("slide", {direction: "right"}, 500);		
		$(this).fadeOut();
	});
	
	// Deprecated
	// $("#controls .btn-group button").bind("click", function() {
		// $(".btn-group button").removeClass("btn-primary"); //button highlighting
		// $(this).addClass("btn-primary"); //button highlighting
		// $("#go").removeAttr("disabled");
	// });
	
	//zooming and panning
	// $("#brushing").bind("click", function(evt) {
		// console.log($(this));
		// $(this).zoomTo({targetsize:.55, duration:600});
		// evt.stopPropagation();
    // });
	
	// execute the query with paramaters
	$(".btn-group button").bind("click", function() {		
		
		if ($("#airlines input[type=checkbox]:checked").length < 1) { // user didn't select any airlines
			alert("Please select at least one airline");
		} else { // we're good! let's go
		
			//type of request
			var type = this.id;
		
			var dateSlider = $(".dateSlider");
			
			if (type !== "bar") {
				// check for massive query
				var rng = Math.round((dateSlider.dateRangeSlider("max") - dateSlider.dateRangeSlider("min")) / (24*60*60*1000)) * $('#airlines input:checked').length;
				if (rng > 20000) {
					var r = confirm("Heads up! That query is going to draw at least " + rng + " elements to the DOM. It will make your machine run slowly. Continue?");
					if (r !== true) {
						//do nothing
					} else {
						go(); // user choose to override prompt
					}
				} else {
					go(); // not too big
				}
			} else {
				go(); // not a plot query
			}
		}
		
		function go() {	
			//brushing
			$('#brushing .labels label').mouseenter(function() {
				var otherLabels = $(".labels label").not($(this));
				var className = $(this).attr('class');
				graphicElements = $('circle:not(.' + className + '), path.trend:not(.' + className + '), rect:not(.' + className + ')');
				targetElements = $('circle.' + className + ', path.trend.' + className + 'rect.' + className);
				graphicElements.css({"opacity": .2, "fill":"grey", "stroke":"grey"});
				targetElements.css({"opacity":1}).filter("path").css({"stroke-width":5});
				otherLabels.addClass("labelDim");
			}).mouseleave(function() {
				var otherLabels = $(".labels label").not($(this));
				var className = $(this).attr('class');
				graphicElements = $('circle:not(.' + className + '), path.trend:not(.' + className + '), rect:not(.' + className + ')');
				graphicElements.css({"opacity": "", "fill":"", "stroke":"", "stroke-width":""});
				targetElements.css({"opacity":""}).filter("path").css({"stroke-width":""});
				otherLabels.removeClass("labelDim");
			});
		
			$("#controls").slideUp(function() { 
				$("img.tools").fadeIn();
			});
			
			$("#loading").fadeIn();
			
			var airstring = kyleSerialize($('#airlines input'));		
			
			$.ajax({
				// airlines
				url: "data.php",
				data: {
					// type
					"type": type,
					// airlines
					"airlines":airstring,
					// date bounds
					"startMonth": dateSlider.dateRangeSlider("min").getMonth() + 1,
					"startYear": dateSlider.dateRangeSlider("min").getYear() + 1900,
					"endMonth": dateSlider.dateRangeSlider("max").getMonth() + 1,
					"endYear": dateSlider.dateRangeSlider("max").getYear() + 1900,
				},
				isModified: true,
				dataType: 'json',
				success: function(response) {
					//$("body svg").fadeOut(function() {this.remove();}); //remove the old viz. Deprecated for new UI!
				
					draw(response, type);
					doStuff(response, "plot");
				},
				//error handling
				error: function(response) {
					if (type === "bar") { // it wasn't json, but it was CSV!
						response = d3.csv.parse(response.responseText); // this was a nightmare
						draw(response,type); 
						doStuff(response, "bar");
					} else {
						console.warn("There was an error receiving your data: " + response.responseText);
						$("#loading").fadeOut(); //ajax loading
						$("#error").modal(); //launch the error box
					}
				}
			});
		}
	});
});

// for code organization
// constructs ui on completion of query
function doStuff(response, type) {
	$("#loading").fadeOut();
	$('svg').svgPan('viewport');
	// show brushing
	$("#brushing").show("slide", { direction: "right" }, 500);
	
	var keep = [];
	if (type === "bar") {
		for (var i = 0; i < response.length; i++) {
			keep.push(response[i].airline);
		}
	}
	
	var target = (type === "plot") ? Object.keys(response) : keep;

	$labels = $("#brushing .labels label");
	$labels.each(function() {
		if ($.inArray($(this).attr("class"), target) === -1) {
			$(this).remove();
		} else {
			$(this).show();
		}
	});
}

//stringify airlines (hacky alternative to passing two arrays to the api)
//a special serialization technique to separate airlines
function kyleSerialize(inputs) {	
	var airstring = "";
	inputs.each(function () {
		if ($(this).prop("checked")) {
			airstring += "'" + this.name + "'+";
		}
	});
	return airstring.substring(0, airstring.length - 1);
}