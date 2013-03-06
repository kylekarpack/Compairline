<html lang="en">
<head>
	<meta http-equiv="content-type" content="text/html" charset="utf-8">
	<title>Compairline</title>
	<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
	<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap-combined.min.css" rel="stylesheet">
	<link href="iThing-min.css" rel="stylesheet">
	<link rel="stylesheet/less" type="text/css" href="style.less">
	<link rel="shortcut icon" href="favicon.png" />
	<script src="//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min.js"></script>	
	<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.0.1/d3.v3.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/js/bootstrap.min.js"></script>
	<script src="jquery.svgdom.min.js"></script>
	<script src="jQDateRangeSlider-min.js"></script>
	<script src="js.js"></script>
	<script src="viz.js"></script>
</head>

<body>
<?php require_once("functions.php"); ?>
<div id="brushing">
	<ul>
	<?php foreach (returnCarriers() as $a) { ?>
		<li><label class="<?= $a ?> checkbox"><?= fullName($a) ?></label></li>
	<?php } ?>
	<ul>
</div>
<div id="controls">
	<span class="close">&times;</span>
	<div class="inner">
	<div class="row-fluid show-grid">
		<div class="span7">
			<h1>1. Set Your Parameters</h1>
			<!-- Airlines Selector -->
			<div class="btn-group">
			  <a class="btn btn-large dropdown-toggle" data-toggle="dropdown" href="#">Airlines <i class="icon-chevron-down"></i></a>
			  <div class="dropdown-menu">
				<ul id="airlines">
				<?php foreach (returnCarriers() as $a) { ?>
					<li><label class="<?= $a ?> checkbox"><?= fullName($a) ?><input type="checkbox" checked="true" name="<?= $a ?>"></input></label></li>
				<?php } ?>
				</ul>
				<a class="btn btn-warning">Reset</a>
				<a class="btn btn-success">Done</a>
				<em><b>CTRL + Click</b> to select just one airline</em>
			  </div>
			</div>
			
			<!-- Airport Selector -->			
			<div class="btn-group">
			  <a class="btn btn-large dropdown-toggle" data-toggle="dropdown" href="#">Airports <i class="icon-chevron-down"></i></a>
			  <div class="dropdown-menu airports">
				<ul id="airports">
				<?php foreach (returnAirports() as $a) { ?>
					<li><label class="<?= $a ?> checkbox"><?= $a ?><input type="checkbox" checked="true" name="<?= $a ?>"></input></label></li>
				<?php } ?>
				</ul>
				<a class="btn btn-warning">Reset</a>
				<a class="btn btn-success">Done</a>
			  </div>
			</div>
			<!-- date slider -->
			<div class="clear"></div>
			<div class="dateSlider"></div>

		</div>
		<div class="span4">
			<h1>2. Select Your Visualization</h1>
			<div class="btn-group">
				<button class="btn btn-large type" id="plot">Plot</button>
				<button class="btn btn-large type" id="heat">Heatmap</button>
				<button class="btn btn-large type" id="map">Map</button>
			</div>
		</div>
		<div class="span1">
			<h1>3. Go</h1>
			<button id="go" class="btn btn-success btn-large" type="button" disabled="disabled">Go</button>
		</div>
	</div>
	</div>
</div>
<img src="drop.png" class="tools">

<div class="clear"></div>
<div id="viz">
	<div id="loading">
		<img alt="Loading" src="ajax-loader.gif">
		<h3 style="text-align:center">Processing <?= number_format(mysql_fetch_assoc(mysql_query("SELECT count(CARRIER) as total FROM flight_data"))["total"]) ?> rows of data.</h3>
		<h4 style="text-align:center">Sorry for the long loading times!<br />Have a cat:</h2>
		<img src="http://thecatapi.com/api/images/get?format=src&type=gif">
	</div>  
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

<div id="table">
	<table class="table table-striped table-hover">
		<tr>
			<th>Date</th><th>Airline</th><th>Delay</th>
		</tr>
	</table>
</div>

</body>
</html>