<?php

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

$max = 3; //set max returned

function returnCarriers() {
	//get relevant carriers
	$max = 3;
	$getCarriers = mysql_query("SELECT DISTINCT CARRIER FROM flight_data LIMIT " . $max);
	$airlines = array();
	for ($x = 0, $numrows = mysql_num_rows($getCarriers); $x < $numrows; $x++) {
		$row = mysql_fetch_array($getCarriers);
		$airlines[] = $row[0];
	}
	return $airlines;
}

function returnAiports() {
	$getAirports = mysql_query("SELECT DISTINCT ORIGIN FROM flight_data LIMIT " . $max);
	$airports = array();
	for ($x = 0, $numrows = mysql_num_rows($getAirports); $x < $numrows; $x++) {
		$row = mysql_fetch_array($getAirports);
		$airports[] = $row[0];
	}
	return $airports;	
}

//mysql_close($con);

?>