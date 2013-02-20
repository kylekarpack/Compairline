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

function returnCarriers() {
	$max = 6; //set max returned
	//get relevant carriers
	$getCarriers = mysql_query("SELECT DISTINCT CARRIER FROM flight_data LIMIT " . $max);
	$airlines = array();
	for ($x = 0, $numrows = mysql_num_rows($getCarriers); $x < $numrows; $x++) {
		$row = mysql_fetch_array($getCarriers);
		$airlines[] = $row[0];
	}
	return $airlines;
}

//mysql_close($con);

?>