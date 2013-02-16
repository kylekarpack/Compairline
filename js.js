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
	
	$('input[type="checkbox"]').click(function() {
		var sel = this.id;
		var selc = $(this).attr("class");
		if (selc === "airline") {
			$("circle." + sel + ", ." + sel + "Path").fadeToggle();
		} else { //selc === "data"
			if (sel === "trend") {
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
		}
	});

});