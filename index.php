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
	<!--<link rel="stylesheet" href="style.css">-->
	<link rel="stylesheet/less" type="text/css" href="style.less">
	<link rel="stylesheet" href="colors.php">
	<link rel="shortcut icon" href="favicon.ico" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.0.1/d3.v3.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/js/bootstrap.min.js"></script>
	<script src="jquery.svgdom.min.js"></script>
	<script src="js.js"></script>
	<script src="viz.js"></script>
</head>

<body>
<?php include("functions.php"); ?>
<div id="controls">
	<h3>Airline:</h3>
	<table>
	<?php 
	foreach (returnCarriers() as $airline) { ?>
			<tr>
				<td>
					<label class="<?= $airline ?>">&nbsp;</label>
					<span><?= $airline ?></span>
				</td>
				<td>
					<button type="button" class="btn airline mute" name="<?= $airline ?>" disabled="disabled">Hide</button>
					<button type="button" class="btn airline solo" name="<?= $airline ?>" disabled="disabled">Solo</button>
				</td>
			</tr>
	<?php } ?>
	</table>
	<hr/>
	<h3>Toggle Data:</h3>
	<button class="data btn" id="trend">Trend Lines</button>
	<button class="data btn" id="data">Data Points</button>
</div>
<div id="viz">
	<div class="btn-group">
	  <button id="plot" class="btn">Draw me a plot!</button>
	  <button id="heat" class="btn">Draw me a heatmap!</button>
	</div>
	<div id="loading"><img src="ajax-loader.gif"></div>  
	<div id="error" class="modal hide fade" tabindex="-1" role="dialog">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">x</button>
			<h3>An Error Has Occurred</h3>
		</div>
		<div class="modal-body">
			<p>We're sorry. An error has occurred. It may have been something you did, but it's more likely a problem with our data service. Please try again later.</p>
			<p>Please <a href="mailto:kkarpack@uw.edu">contact Kyle</a> if you have a moment to let him know.</p>
		</div>
		<div class="modal-footer">
			<button class="btn btn-primary" data-dismiss="modal">Close</button>
		</div>
	</div>
</div>
</body>
</html>