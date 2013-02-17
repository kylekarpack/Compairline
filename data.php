<?php
header('Content-type: application/json'); //set it to return json

include("functions.php");
$host = get("host");
$username = get("username");
$password = get("password");
$con = mysql_select_db("flights", mysql_connect($host, $username, $password));

$airlines = returnCarriers();

//find out what type of plot we are returning
$request_type = $_GET["type"];

if ($request_type == "plot") {
	$delays = array();
	
	//This is a bit hacky. Allows limiting number of airlines to ones in the list
	//Array to list for SQL query
	$airString = "WHERE CARRIER = '" . implode("' OR CARRIER = '", $airlines) . "'";
	$query = mysql_query("SELECT DISTINCT DAY_OF_MONTH, CARRIER, avg(DEP_DELAY_NEW) as DELAY FROM prototype " . $airString . " GROUP BY CARRIER, DAY_OF_MONTH;");
	
	//create delays array with empty array for each airline
	foreach ($airlines as $airline) {
		$delays[$airline] = array();
	}
	//ineffecient loop. could use help. $x not used
	for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
		$row = mysql_fetch_array($query);
		array_push($delays[$row["CARRIER"]], array("day" => (int) $row["DAY_OF_MONTH"], "delay" => (float) $row["DELAY"]));
	}
	
	echo ( json_encode($delays) );
//It's a request for a heat map!!	
} elseif ($request_type == "heat") { // DO SOMETHING BETTER THAN TRUNCATING 24 values!!!
	$query = mysql_query("SELECT DAY_OF_WEEK, FLOOR(DEP_TIME/100) AS HOUR_ROUND, avg(DEP_DELAY) AS DELAY FROM heat WHERE FLOOR(DEP_TIME/100) != 24 GROUP BY DAY_OF_WEEK, FLOOR(DEP_TIME/100)");
	$delays = array();
	for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
		$row = mysql_fetch_array($query);
		//typecasting ints and floats
		$day = (int) $row["DAY_OF_WEEK"];
		$time = (int) $row["HOUR_ROUND"];
		$timeXY = array($time, $day);
		array_push($delays, array($timeXY, (float) $row["DELAY"]));
	}
	
	echo (json_encode($delays));
		
} else {
	echo ("Error");
}
// foreach ($query as $row) {
	// echo $row["DepDelay"];
// }

?>