<?php
//This file generates a stylesheet for the document based on Airline names
include("functions.php");

header("Content-type: text/css");

echo("/*Auto-generated colors for each airline*/\n");

foreach (returnCarriers() as $carrier) {
	$c = colorGen($carrier);
	echo ("." . $carrier . " {fill: " . $c . ";}\n");
	echo ("." . strtolower($carrier) . "Path {stroke: " . $c . ";}\n");
	echo ("label." . $carrier . " {background: " . $c . ";}\n");
}

function colorGen($str) {
	return "#" . substr(md5($str), 2, 3);
}
?>