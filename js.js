//THIS IS ALL FRONT END CODE
$(window).load(function() {
	$(".btn-group button").bind("click", function() {
		$("#loading").fadeIn(); //ajax loading
		$("button").removeClass("btn-success"); //button highlighting
		$(this).addClass("btn-success"); //button highlighting
		$("body svg").fadeOut(function() {this.remove()}); //remove the old viz
		
		var type = this.id;
		if (type === "plot") {
			$("#controls button").removeAttr("disabled");
		}
		
		var query = "data.php?type=" + type;

		$.ajax({
			url: query,
			dataType: 'json',
			success: function(response) {
				draw(response, type);
			},
			error: function(response) {
				console.warn("There was an error receiving your data.");
				$("#loading").fadeOut(); //ajax loading
				$("#error").modal(); //launch the error box
			}
		});
	});

	
	$('input.data').change(function() {
		$('input.airline').prop("disabled",!$('input.airline').prop("disabled"))
	});
	
	//button branching logic needs help
	$('#controls button').bind("click", function() {
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
	$('#controls button.data').click(function() {
		//type selector code here
	});

});