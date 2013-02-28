<?php

// This file contains all functions for PHP and may soon contain a JS api

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

// Return an array of carriers
function returnCarriers() {
	//get relevant carriers
	$max = 15;
	$getCarriers = mysql_query("SELECT DISTINCT CARRIER FROM flight_data LIMIT " . $max);
	$airlines = array();
	for ($x = 0, $numrows = mysql_num_rows($getCarriers); $x < $numrows; $x++) {
		$row = mysql_fetch_array($getCarriers);
		$airlines[] = $row[0];
	}
	return $airlines;
}

// Return an array of airports
function returnAirports() {
	$max = 15;
	$getAirports = mysql_query("SELECT DISTINCT ORIGIN FROM flight_data LIMIT " . $max);
	$airports = array();
	for ($x = 0, $numrows = mysql_num_rows($getAirports); $x < $numrows; $x++) {
		$row = mysql_fetch_array($getAirports);
		$airports[] = $row[0];
	}
	return $airports;	
}

// Return the full name from an abbreviation
function fullName($abbrev) {
	$file = file("lookup.json");
	$json = json_decode($file, true); // true for assoc
	try {
		return $json[$abbrev]["name"];
	} catch {
		return "";
	}
}

echo fullName("AA");

//mysql_close($con);

?>