//THIS IS ALL FRONT END CODE
$(window).load(function() {
	$(".btn-group button").bind("click", function() {
		$("#loading").fadeIn(); //ajax loading
		$("button").removeClass("btn-success"); //button highlighting
		$(this).addClass("btn-success"); //button highlighting
		$("body svg").fadeOut(function() {this.remove()}); //remove the old viz
		d3.json("data.php?type=" + this.id, draw); //draw the new one
	});
	
	$('input.data').change(function() {
		$('input.airline').prop("disabled",!$('input.airline').prop("disabled"))
	});
	
	//button branching logic needs help
	$('#sel button').bind("click", function() {
		var btn = $(this);
		if (btn.hasClass("mute")) { //if it's a do one button
			if (btn.hasClass("hid")) {
				btn.toggleClass("hid").toggleClass("btn-danger");
			} else {
				btn.toggleClass("hid").toggleClass("btn-danger");
			}
			$("circle." + btn.attr("name") + ", path." + btn.attr("name")).fadeToggle();
			console.log("circle." + btn.attr("name") + ", path." + btn.attr("name"));
		} else { //it's a "toggle others" button ("solo")
			if (btn.hasClass("hid")) {
				btn.toggleClass("hid").toggleClass("btn-warning");
			} else {
				btn.toggleClass("hid").toggleClass("btn-warning");
				$("circle." + btn.attr("name") + ", path." + btn.attr("name")).fadeIn();
			}
			$("circle:not(." + btn.attr("name") + "), path.trend:not(." + btn.attr("name") + ")").fadeOut(); //buggy
		}
	});
	
	//data type toggle on plot
	$('#sel button.data').click(function() {
		if (this.id === "trend") {
			$("path.trend").fadeToggle();
			if (!($("#" + sel).is(":checked"))) {
				$("circle").animate({"opacity":1});
				$("circle").attr({"r":5});
			} else {
				$("circle").animate({"opacity":.3});
				$("circle").attr({"r":3});
			}
			
		} else {
			$("circle").fadeToggle();
		}
	});

});