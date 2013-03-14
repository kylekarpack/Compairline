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

	if (type !== "heat") {
		$labels = $("#brushing .labels label");
		$labels.show();
		$labels.each(function() {
			if ($.inArray($(this).attr("class"), target) === -1) {
				$(this).hide();
			} else {
				$(this).show();
			}
		});
	
		var yOffset = type === "plot" ? 40 : -20
		
		d3.select("svg > g").append("text")
				.attr("x", width / 2 - airstring.split("'+'").length * 10 - 50)
				.attr("y", yOffset)
				.attr("class", "title") 
				.text("Average Delay Times for " + returnTitle(airstring))
	}
}

//UTILITY FUNCTIONS

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

function returnTitle(input) {
	input = input.split("'+'");
	var len = input.length;
	if (len < 5) {
		return input.join(", ").split("'").join("");
	} else {
		input = input.slice(0,4);
		return input.join(", ").split("'").join("") + " and " + (len - 4) + " more";
	}
}

// localized for performance, less API calls
function fullCarrier(abbrev) {
	var map = {
		"DL": "Delta",
		"UA": "United",
		"WN": "Southwest",
		"AA": "American",
		"US": "US Airways",
		"B6": "JetBlue",
		"AS": "Alaska",
		"WS": "WestJet",
		"F9": "Frontier",
		"HA": "Hawaiian",
		"MQ": "American Eagle",
		"OO": "SkyWest",
		"EV": "Atlantic SE",
		"FL": "AirTran",
		"VX": "Virgin America",
		"YV": "Mesa",
		"NK": "Spirit",
		"G4": "Allegiant",
		"PA": "Pinnacle Air",
		"CO": "Continental",
		"DH": "Independence",
		"HP": "America West",
		"KH": "Aloha Air",
		"NW": "Northwest",
		"OH": "Comair",
		"TW": "TransWorld",
		"TZ": "ATA Airlines",
		"XE": "ExpressJet"
	}
	return map[abbrev];
}