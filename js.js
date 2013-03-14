var airstring;

//THIS IS ALL FRONT END CODE
$(document).ready(function() {	
	
	// deferred load the stylesheet (for performance)
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
		//type of request
		var type = this.id;
		
		if ($("#airlines input[type=checkbox]:checked").length < 1) { // user didn't select any airlines
			alert("Please select at least one airline");
		} else if ($('#airlines input:checked').length > 3 && type === "heat") {
			alert("Please only use three or less airlines for heatmaps");
		} else { // we're good! let's go
			var dateSlider = $(".dateSlider");
			
			if (type === "plot") {
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
		
			$("#controls").slideUp(function() { 
				$("img.tools").fadeIn();
			});
			
			$("#loading").fadeIn();
			
			airstring = kyleSerialize($('#airlines input'));		
			
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
					doStuff(response, type);
				},
				//error handling
				error: function(response) {
					if (type === "bar") { // it wasn't json, but it was CSV!
						response = d3.csv.parse(response.responseText); // this was a nightmare
						draw(response,type); 
						doStuff(response, type);
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