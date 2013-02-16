<?php
  header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT"); // Date in the past
?>

<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html" charset="utf-8">
	<title>Compairline</title>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap-combined.min.css" rel="stylesheet">
	<link rel="stylesheet" href="style.css">
	<link rel="stylesheet" href="colors.php">
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.0.1/d3.v3.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/js/bootstrap.min.js"></script>
	<script src="jquery.svgdom.min.js"></script>
	<script src="js.js"></script>
</head>

<body>
<?php include("functions.php"); ?>
<div id="sel">
	<h3>Airline:</h3>
	<form>
	<?php 
	foreach (returnCarriers() as $airline) { ?>
		<label class="<?= $airline ?> checkbox"><input class="airline" id="<?= $airline ?>" name="<?= $airline ?>" type="checkbox" checked="checked"><?= $airline ?></input></label>
	<?php } ?>
	</form>
	<hr/>
	<h3>Data:</h3>
	<label class="checkbox"><input class="data" id="trend" type="checkbox" checked="checked"></input>Trend Lines</label>
	<label class="checkbox"><input class="data" id="data" type="checkbox" checked="checked"></input>Data Points</label>
	
</div>
<div id="bg">
</div>
<div class="btn-group">
  <button id="plot" class="btn">Draw me a plot!</button>
  <button id="heat" class="btn">Draw me a heatmap!</button>
</div>
<div id="loading"><img src="ajax-loader.gif"></div>  
</body>
</html>