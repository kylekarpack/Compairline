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
				min: new Date(2008, 0, 1),
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
		console.log($(this));
		$(this).parent().toggleClass("noBG");
		
	});
	 // Attach handler for the "Done" button
	$(".dropdown-menu .btn-success").bind("click", function() {
		$(this).parent().parent().toggleClass("open");
	});
	 
	 // Handler for the select all button
	$(".dropdown-menu .btn-warning").bind("click", function() {
		$(this).toggleClass("first");
		if ($(this).hasClass("first")) {
			$(this).parent().find("input").prop("checked",true).parent().removeClass("noBG");
			$("#brushing label").show();
		}
	 });
	 
	// Close menu handler
	$(".close").bind("click", function() {
		$(this).parent().slideUp(function() { $("img.tools").fadeIn() })
		$("#brushing").show("slide", { direction: "right" }, 500);		
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
	
	// execute the query with paramaters
	$(".btn-group button").bind("click", function() {		
	
		var dateSlider = $(".dateSlider");
		
		$("#rezSlider").slider({
						  value:100,
						  min: 0,
						  max: 500,
						  step: 50,
						  slide: function( event, ui ) {
							$( "#amount" ).val( "$" + ui.value );
						  }
						});
		
		// check for massive query
		var rng = dateSlider.dateRangeSlider("max") - dateSlider.dateRangeSlider("min");
		rng = Math.round(rng / (24*60*60*1000));
		console.log(rng);
		rng = rng * $('#airlines input').length;
		alert("Heads up! That query is going to draw at least " + rng + " elements to the DOM. It will make your machine run slowly!");
		
		$("#controls").slideUp(function() { 
			$("img.tools").fadeIn();
		});
		var type = this.id;
		
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
				$("#loading").fadeOut();
				draw(response, type);
			},
			//error handling
			error: function(response) {
				console.warn("There was an error receiving your data: " + response.responseText);
				$("#loading").fadeOut(); //ajax loading
				$("#error").modal(); //launch the error box :)
			}
		});
	});
});

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