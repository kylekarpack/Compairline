//THIS IS ALL FRONT END CODE
$(document).ready(function() {	
	$.ajax({
		url:"colors.php",
		data: {},
		success: function(data) {
			console.log("I werked");
			$("head").append("<style>TESTTTTTTT" + data + "</style>");
		}
	});	
	
	$(".slider").dateRangeSlider();
	
	$('.dropdown-menu').click(function(event){
		 event.stopPropagation();
	 });
	 
	 // Attach handler for the "Done" button
	$(".dropdown-menu .btn-success").bind("click", function() {
		$(this).parent().parent().toggleClass("open");
	});
	 
	 // Handler for the reset button
	$(".dropdown-menu .btn-warning").bind("click", function() {
		$(this).parent().find("input").prop("checked",true);
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
	
	
	$("img.tools").click(function() {
		$("#controls").slideDown();
		$(this).fadeOut();
	});
	
	$("#go").bind("click", function() {
		
		$("#controls").slideUp(function() { $("img.tools").fadeIn() });
		var type = $(".btn-group button.btn-primary")[0].id,
            query = "data.php?type=" + type + "&" + $("input").serialize();
		
		$("#loading").fadeIn();
		
		$.ajax({
			url: query,
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