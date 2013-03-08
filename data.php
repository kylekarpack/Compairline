<?php
header('Content-type: application/json'); //set it to return json

require_once("functions.php"); //include the credentials grabber function and others

//$airlines = returnCarriers();
$startMonth = $_GET["startMonth"];
$startYear = $_GET["startYear"];
$endMonth = $_GET["endMonth"];
$endYear = $_GET["endYear"];
	
// return time range
function timeRange() {
	// get GET variables
	$startMonth = $_GET["startMonth"];
	$startYear = $_GET["startYear"];
	$endMonth = $_GET["endMonth"];
	$endYear = $_GET["endYear"];

	$yearDiff = $endYear - $startYear;
	$monthDiff = $endMonth - $startMonth;
	$dayRange = 365 * $yearDiff + 30 * $monthDiff;
	return $dayRange;
}

function floorDate($year, $month) {
	return 12 * $year + $month;
}

function granularity() {
	$days = timeRange();
	if ($days < 62) {
		return "day";
	} elseif ($days < 730) {
		return "month";
	} else {
		return "year";
	}
}

function filterString() {
	if (granularity() == "day") {
		return "DAY_OF_MONTH, MONTH, YEAR";
	} elseif (granularity() == "month") {
		return "MONTH, YEAR";
	} else {
		return "YEAR";
	}
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
		
	$stSQL = microtime(true);
	// $query = mysql_query("SELECT DISTINCT DAY_OF_MONTH, MONTH, YEAR, CARRIER, avg(DEP_DELAY) as DELAY "
						// . "FROM flight_data "
						// . "WHERE CARRIER IN " . $airstring . " "
						// . "AND (12 * YEAR + MONTH) "
							// . "BETWEEN " . floorDate($startYear, $startMonth) . " "
							// . "AND " . floorDate($endYear, $endMonth) . " "
						// . "GROUP BY CARRIER, " . filterString() . " "
						// . "LIMIT 365;");
				
	// redone with condensed table
	$query = mysql_query("SELECT DISTINCT DAY_OF_MONTH, MONTH, YEAR, CARRIER, DEP_DELAY as DELAY "
					. "FROM plot_data "
					. "WHERE CARRIER IN " . $airstring . " "
					. "AND (12 * YEAR + MONTH) "
						. "BETWEEN " . floorDate($startYear, $startMonth) . " "
						. "AND " . floorDate($endYear, $endMonth) . " "
					//. "GROUP BY CARRIER, " . filterString() . ";");
					. "GROUP BY CARRIER, DAY_OF_MONTH, MONTH, YEAR;");
	
	$endSQL = microtime(true);
	//create delays array with empty array for each airline
	foreach ($arr as $airline) {
		$delays[$airline] = array();
	}
	//ineffecient loop. could use help. $x not used
	for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
		$row = mysql_fetch_array($query);
		$date = mktime(0, 0, 0, (int) $row["MONTH"], (int) $row["DAY_OF_MONTH"], (int) $row["YEAR"]);
		array_push($delays[$row["CARRIER"]], array("date" => (int) $date * 1000, "delay" => round((float) $row["DELAY"], 2))); // rounding delays for compression over network
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