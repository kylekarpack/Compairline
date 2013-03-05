<?php
header('Content-type: application/json'); //set it to return json

include("functions.php"); //include the credentials grabber function

//$airlines = returnCarriers();

// get GET variables
$startMonth = $_GET["startMonth"];
$startYear = $_GET["startYear"];
$endMonth = $_GET["endMonth"];
$endYear = $_GET["endYear"];

// return time range
function timeRange() {
	$yearDiff = $endYear - $startYear;
	$monthDiff = $endMonth - $startMonth;
	$dayRange = 365 * $yearDiff + 30 * $monthDiff;
	return $dayRange;
}

function granularity() {
	$days = timeRange();
	
}

//find out what type of plot we are returning
$request_type = $_GET["type"];

if ($request_type == "plot") {
	$delays = array();
	
	$arr = $_GET["airlines"];
	//for sql query
	$airstring = "(". str_replace("+", ", ", $arr) . ")";
	//for output array
	$arr = str_replace("'", "", $arr);
	$arr = explode("+", $arr);
	

	//$airstring = "('" . implode("' , '", $arr) . "')";

	// foreach ($_GET as $key => $value) {
		// echo $key;
	// }
	
	//This is a bit hacky. Allows limiting number of airlines to ones in the list
	//Array to list for SQL query
	//$airString = "WHERE CARRIER = '" . implode("' OR CARRIER = '", $airlines) . "'"; //yipes. do this with a join instead?
	
	$stSQL = microtime(true);
	$query = mysql_query("SELECT DISTINCT DAY_OF_MONTH, MONTH, YEAR, CARRIER, avg(DEP_DELAY) as DELAY FROM flight_data WHERE CARRIER IN " . $airstring . " GROUP BY CARRIER, DAY_OF_MONTH, MONTH, YEAR;");
	
	$endSQL = microtime(true);
	
	//create delays array with empty array for each airline
	foreach ($arr as $airline) {
		$delays[$airline] = array();
	}
	//ineffecient loop. could use help. $x not used
	for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
		$row = mysql_fetch_array($query);
		$date = mktime(0, 0, 0, (int) $row["MONTH"], (int) $row["DAY_OF_MONTH"], (int) $row["YEAR"]);
		array_push($delays[$row["CARRIER"]], array("date" => $date, "delay" => (float) $row["DELAY"]));
	}
	echo ( json_encode($delays) );
	
//It's a request for a heat map!!	
} elseif ($request_type == "heat") { // DO SOMETHING BETTER THAN TRUNCATING 24 values!!!
	$stSQL = microtime(true);
	$query = mysql_query("SELECT DAY_OF_WEEK, FLOOR(CRS_DEP_TIME/100) AS HOUR_ROUND, avg(DEP_DELAY) AS DELAY FROM flight_data WHERE FLOOR(CRS_DEP_TIME/100) != 24 GROUP BY DAY_OF_WEEK, FLOOR(CRS_DEP_TIME/100)");
	$endSQL = microtime(true);
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

// $time = round($end - $st, 3);
// $time2 = round($endSQL - $stSQL, 3);

//header("Kyle's SQL Query Time: " . $time2 . " seconds");
//header("Kyle's Total Execution Time: " . $time . " seconds");
//mysql_close($con);
?>