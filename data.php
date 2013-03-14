<?php
require_once("functions.php"); //include the credentials grabber function and others

//$airlines = returnCarriers();
$startMonth = $_GET["startMonth"];
$startYear = $_GET["startYear"];
$endMonth = $_GET["endMonth"];
$endYear = $_GET["endYear"];
$airlineList = $_GET["airlines"];

	
// return time range
function timeRange() {
	// get GET variables
	$startMonth = $_GET["startMonth"];
	$startYear = $_GET["startYear"];
	$endMonth = $_GET["endMonth"];
	$endYear = $_GET["endYear"];

	$yearDiff = $endYear - $startYear;
	$monthDiff = $endMonth - $startMonth;
	
	$dayRange = (365 * $yearDiff) + (30 * $monthDiff);
	return $dayRange;
}

function floorDate($year, $month) {
	return 12 * $year + $month;
}

// function granularity() {
	// $days = timeRange();
	// if ($days < 366) {
		// return "day";
	// } elseif ($days < 1500) {
		// return "month";
	// } else {
		// return "year";
	// }
// }

// better way of doing it?
function granularity() {
	$days = timeRange();
	$gran = ceil(log10($days) - 1) > 1 ? ceil(log10($days) - 1) : 1;
	return $gran * 3;
}

function airstring() {
	$airlineList = $_GET["airlines"];
	//for sql query
	return "(". str_replace("+", ", ", $airlineList) . ")";
}

// function filterString() {
	// if (granularity() == "day") {
		// return "DAY_OF_MONTH, MONTH, YEAR";
	// } elseif (granularity() == "month") {
		// return "MONTH, YEAR";
	// } else {
		// return "YEAR";
	// }
// }

//find out what type of plot we are returning
$request_type = $_GET["type"];
	
//for output array
$delays = array();
$airlineList = str_replace("'", "", $airlineList);
$airlineList = explode("+", $airlineList);

if ($request_type == "plot" || $request_type == "bar") {
	if ($request_type == "plot") {
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
						. "WHERE CARRIER IN " . airstring() . " "
						. "AND (12 * YEAR + MONTH) "
							. "BETWEEN " . floorDate($startYear, $startMonth) . " "
							. "AND " . floorDate($endYear, $endMonth) . " "
						//. "GROUP BY CARRIER, " . filterString() . ";");
						. "GROUP BY CARRIER, DAY_OF_MONTH, MONTH, YEAR "
						. "ORDER BY CARRIER, YEAR, MONTH, DAY_OF_MONTH;");
		
		//create delays array with empty array for each airline
		foreach ($airlineList as $airline) {
			$delays[$airline] = array();
		}
		//ineffecient loop. could use help. $x not used
		for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
			$row = mysql_fetch_array($query);
			if ($row["DAY_OF_MONTH"] % granularity() == 0) {
				//debug:
				// var_dump($row);
				// echo("\n...........................................\n");
				//print_r($row);
				$date = mktime(0, 0, 0, (int) $row["MONTH"], (int) $row["DAY_OF_MONTH"], (int) $row["YEAR"]);
				array_push($delays[$row["CARRIER"]], array("date" => (int) $date * 1000, "delay" => (float) $row["DELAY"])); // rounding delays for compression over network
			}
		}
		header('Content-type: application/json'); //set it to return json
		// delete empty nodes
		foreach($delays as $key=>$val){
			if(empty($val)) {
				unset($delays[$key]);
			}
		}
		echo ( json_encode($delays) );
		
	} else { //bar
		
		header("Content-Type: text/plain");
	
		$query = mysql_query("select CARRIER, avg(dep_delay) as DELAY "
						. "from plot_data "
						. "WHERE CARRIER IN " . airstring() . " "
						. "AND (12 * YEAR + MONTH) "
							. "BETWEEN " . floorDate($startYear, $startMonth) . " "
							. "AND " . floorDate($endYear, $endMonth) . " "
						. "GROUP BY CARRIER;");
		
		$csv = "airline,delay\n";
		for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
			$row = mysql_fetch_array($query);
			$csv .= $row["CARRIER"] . "," . $row["DELAY"] . "\n";
		}
		echo $csv;
	}
	
//It's a request for a heat map!!	
} elseif ($request_type == "heat") {
	header('Content-type: application/json'); //set it to return json
	$stSQL = microtime(true);
	$query = mysql_query("SELECT DAY_OF_WEEK, HOUR, avg(delay) as DELAY, count(*) AS NUMBER, CARRIER "
						. "FROM heatmap_data "
						. "WHERE CARRIER in " . airstring() . " "
						. "AND (12 * YEAR + MONTH) "
							. "BETWEEN " . floorDate($startYear, $startMonth) . " "
							. "AND " . floorDate($endYear, $endMonth) . " "
						. "GROUP BY CARRIER, day_of_week, hour "
						. "ORDER BY CARRIER, day_of_week, hour");

	for ($x = 0, $numrows = mysql_num_rows($query); $x < $numrows; $x++) {
		$row = mysql_fetch_array($query);
		//typecasting ints and floats
		$day = (int) $row["DAY_OF_WEEK"];
		$time = (int) $row["HOUR"];
		$timeXY = array($time, $day);
		$delays[$row["CARRIER"]][] = array($timeXY, (float) $row["DELAY"], (int) $row["NUMBER"]);
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