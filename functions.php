<?php
// This file contains all utility functions for PHP

// Server credentials offline
function get($param) {
	$file = file("foobar.config");
	if ($param == "host") { return trim($file[0]);
	} elseif ($param == "username") { return trim($file[1]);
	} elseif ($param == "password") { return trim($file[2]);
	} else { return false; }
}

$host = get("host");
$username = get("username");
$password = get("password");

$con = mysql_select_db("kkarpack_flights", mysql_connect($host, $username, $password));
if (!$con) {
   die('Could not connect: ' . mysql_error());
}

// Return an array of carriers
function returnCarriers() {
	//get relevant carriers
	// $max = 30;
	// $getCarriers = mysql_query("SELECT DISTINCT CARRIER FROM plot_data LIMIT " . $max);
	// $airlines = array();
	// for ($x = 0, $numrows = mysql_num_rows($getCarriers); $x < $numrows; $x++) {
		// $row = mysql_fetch_array($getCarriers);
		// $airlines[] = $row[0];
	// }
	
	// Do it without database:
	$file = file_get_contents("airlines.json");
	$json = json_decode($file, true); // true for assoc
	$airlines = array_keys($json);
	
	return $airlines;
}

// Return an array of airports
function returnAirports() {
	// $max = 15;
	// $getAirports = mysql_query("SELECT DISTINCT ORIGIN FROM flight_data LIMIT " . $max);
	// $airports = array();
	// for ($x = 0, $numrows = mysql_num_rows($getAirports); $x < $numrows; $x++) {
		// $row = mysql_fetch_array($getAirports);
		// $airports[] = $row[0];
	// }
	$file = utf8_decode(file_get_contents("airports.json"));
	$json = json_decode($file, true); // true for assoc
	$airports = array_keys($json);
	//$airports = array_slice($airports, 0 , 15);
	
	return $airports;	
}

// Pretty much deprecated, but scared to take it out
// Return the full name from an abbreviation
function fullName($abbrev) {
	$file = file_get_contents("airlines.json");
	$json = json_decode($file, true); // true for assoc
	if (isset($json[$abbrev])) {
		return $json[$abbrev];
	} else { // temporary error handling
		return $abbrev;
	}
}

// BEGIN API

// abbreviation to full name API
if (isset($_GET["abbrev"])) {
	echo fullName($_GET["abbrev"]);
}

?>