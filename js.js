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
	

	$(".dateSlider").dateRangeSlider({
		
		arrows: false,
		formatter: function(val) {
			var month = val.getMonth() + 1,
				year = val.getYear() + 1900;
			return month + " / " + year;
		},
		bounds: {
				min: new Date(1987, 0, 1),
				max: new Date(2012, 12, 31)
				},
		 defaultValues: {
				min: new Date(2008, 0, 1),
				max: new Date(2011, 12, 31)
				},
		
	});
	
	$('.dropdown-menu').click(function(e) {
		 e.stopPropagation();
	 });
	 
	 // alt clicking for select only 1
	 $('.dropdown-menu input').click(function(e) {
		$(this).parent().toggleClass("noBG");

		if (e.ctrlKey) {
			// this is really slow
			$(this).parent().parent().parent().find("input").prop("checked",false).parent().addClass("noBG");
			$(this).prop("checked",true).parent().removeClass("noBG");
		}
	 });
		
	 // Attach handler for the "Done" button
	$(".dropdown-menu .btn-success").bind("click", function() {
		$(this).parent().parent().toggleClass("open");
	});
	 
	 // Handler for the reset button
	$(".dropdown-menu .btn-warning").bind("click", function() {
		$(this).parent().find("input").prop("checked",true).parent().removeClass("noBG");
	 });
	 
	// Close menu handler
	$(".close").bind("click", function() {
		$("#controls").slideUp(function() { $("img.tools").fadeIn() })
	});
	
	$("#controls .btn-group button").bind("click", function() {
		$(".btn-group button").removeClass("btn-primary"); //button highlighting
		$(this).addClass("btn-primary"); //button highlighting
		$("#go").removeAttr("disabled");
	});
	
	// slide down the controls on click
	$("img.tools").click(function() {
		$("#controls").slideDown();
		$(this).fadeOut();
	});
	
	// execute the query with paramaters
	$("#go").bind("click", function() {
	
		var dateSlider = $(".dateSlider");
		
		$("#controls").slideUp(function() { $("img.tools").fadeIn() });
		var type = $(".btn-group button.btn-primary")[0].id;
		
		$("#loading").fadeIn();
		
		//stringify airlines
		var airstring = "";
		$('#airlines input').each(function () {
			airstring += "'" + this.name + "'+";
		});
		airstring = airstring.substring(0, airstring.length - 1);
				
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
				$("body svg").fadeOut(function() {this.remove();}); //remove the old viz
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

	//button branching logic needs help
	// $('#controls button').bind("click", function() {
		// var btn = $(this);
		// if (btn.hasClass("mute")) { //if it's a do one button
			// if (btn.hasClass("hid")) {
				// btn.toggleClass("hid").toggleClass("btn-danger");
			// } else {
				// btn.toggleClass("hid").toggleClass("btn-danger");
			// }
			// $("circle." + btn.attr("name") + ", path." + btn.attr("name")).fadeToggle();
			// console.log("circle." + btn.attr("name") + ", path." + btn.attr("name"));
		// } else if (btn.hasClass("solo")) { //it's a "toggle others" button ("solo")
			// if (btn.hasClass("hid")) {
				// btn.toggleClass("hid").toggleClass("btn-warning");
			// } else {
				// btn.toggleClass("hid").toggleClass("btn-warning");
				// $("circle." + btn.attr("name") + ", path." + btn.attr("name")).fadeIn();
			// }
			// $("circle:not(." + btn.attr("name") + "), path.trend:not(." + btn.attr("name") + ")").fadeOut(); //buggy
		// }
	// });

	//data type toggle on plot
	// $('#controls button.data').bind("click", function() {
		// var type = this.id;
		// if (type === "data") { //data points
			// if ($(this).hasClass("hid")) {
				// $(this).toggleClass("hid").toggleClass("btn-danger");
				// $("circle").fadeIn(800);
				// $("path.trend").animate({"stroke-width":2},1000);

			// } else {
				// $(this).toggleClass("hid").toggleClass("btn-danger");
				// $("circle").fadeOut(800);
				// $("path.trend").animate({"stroke-width":3},1000);
			// }
		// } else { //trend lines
			// if ($(this).hasClass("hid")) {
				// $(this).toggleClass("hid").toggleClass("btn-danger");
				// $("path.trend").fadeIn(800);
				// $("circle").animate({"opacity":.5, "stroke-width":0},800);
			// } else {
				// $(this).toggleClass("hid").toggleClass("btn-danger");
				// $("path.trend").fadeOut(800);
				// $("circle").animate({"opacity":1, "stroke-width":4},800);
			// }
		// }
	// });	

});