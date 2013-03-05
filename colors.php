<?php

$st = microtime(true);

//This file generates a stylesheet for the document based on Airline names
require_once("functions.php");

header("Content-type: text/css");

echo("/*Auto-generated colors for each airline*/\n");

// foreach (returnCarriers() as $carrier) {
	// $c = colorGen($carrier);
	// echo ("." . $carrier . " {fill: " . $c . ";}\n");
	// echo ("label." . $carrier . " {background: " . $c . ";}\n");
	// echo ("path." . $carrier . ", circle." . $carrier . " {stroke: " . $c . ";}\n");
// }

//calculate based on hashes (random)
// function colorGen($str) {
	// return "#" . substr(md5($str), 8, 3);
// }

// Less random, equidistant color wheel method
for ($i = 0; $i < count(returnCarriers()); $i++) {
	$carrier = returnCarriers();
	$carrier = $carrier[$i];
	$c = colorGen($i / count(returnCarriers()));
	echo ("." . $carrier . " {fill: " . $c . ";}\n");
	echo ("label." . $carrier . " {background: " . $c . ";}\n");
	echo ("path." . $carrier . ", circle." . $carrier . " {stroke: " . $c . ";}\n");
}

//returns exqidistant HSL values
function colorGen($per) {
	$per =  360 * $per; //HSL colors are WEIRD. 360 wut?
	return "hsl(" . $per . ", 90%, 35%)";
}

$end = microtime(true);

echo ("/* Generated in " . round($end - $st, 2) . " seconds */");

?>