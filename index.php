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
	<script type="text/javascript">less = { env: "production" } </script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/jquery-ui.min.js"></script>	
	<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.0.1/d3.v3.min.js"></script>
	<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/js/bootstrap.min.js"></script>
	<script src="jquery.svgdom.min.js"></script>
	<script src="jQDateRangeSlider-min.js"></script>
	<script src="jquery-svgpan.js"></script>
	<script src="js.js"></script>
	<script src="viz.js"></script>
</head>

<body>
<?php require_once("functions.php"); ?>

<div id="brushing">
	<div id="cust1">
		<h3>Customize</h3>
		<label class="checkbox"><input id="change" type="checkbox"></input>Toggle Sorting</label>		
		<p></p>
		<span class="closeLeft">&times;</span>
		<ul class="labels">
		<?php foreach (returnCarriers() as $a) { ?>
			<li><label class="<?php echo $a ?>"><?php echo fullName($a) ?><span class="closeLabel close">&times;</span></label></li>
		<?php } ?>
		<ul>
	</div>
	<div class="detail">
		<h3>Selected:</h3>
		<div class="local-data"></div>
	</div>
</div>

<div id="controls">
	<span class="close">&times;</span>
	<div class="inner">
	<div class="row-fluid show-grid">
		<div class="span9">
			<h1>1. Set Your Parameters</h1>
			<!-- Airlines Selector -->
			<div class="btn-group">
			  <a class="btn btn-large dropdown-toggle" data-toggle="dropdown" href="#">Airlines <i class="icon-chevron-down"></i></a>
			  <div class="dropdown-menu">
				<ul id="airlines">
				<?php foreach (returnCarriers() as $a) { ?>
					<li><label class="<?php echo $a ?> checkbox noBG"><?php echo fullName($a) ?><input type="checkbox" name="<?php echo $a ?>"></input></label></li>
				<?php } ?>
				</ul>
				<a class="btn btn-primary">Select All</a>
				<a class="btn btn-success">Done</a>
				<!--<em><b>CTRL + Click</b> to select just one airline</em>-->
			  </div>
			</div>
			
			<!-- date slider -->
			<div class="dateContainer">
				<div class="dateSlider"></div>
			</div>
			<div class="clear"></div>

		</div>
		<div class="span3">
			<h1>2. Select Your Visualization</h1>
			<div class="btn-group">
				<button class="btn btn-large type" id="plot">Plot</button>
				<button class="btn btn-large type" id="bar">Bars</button>
				<button class="btn btn-large type" id="heat">Heatmap</button>
				<!--<button class="btn btn-large type" id="map">Map</button>-->
			</div>
		</div>
	</div>
	</div>
</div>
<img src="drop.png" class="tools top">

<div class="clear"></div>

<div id="info">
	<div id="loading">
		<img alt="Loading" src="ajax-loader.gif">
		<h3 style="text-align:center">Processing <?php echo number_format(mysql_result(mysql_query("SELECT count(CARRIER) as total FROM plot_data"), 0)); ?> rows of data.</h3>
		<h4 style="text-align:center">Sorry for the long loading times!<br />Have a cat:</h2>
		<img src="compairline.gif" />
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

<div id="vizualization">
<!--VISUALIZATIONS GO HERE -->
</div>

<img src="table.png" class="tools bottom">

<div id="table">
	<span class="close">&times;</span>
	<table class="table table-striped table-hover table-bordered table-condensed">
		
	</table>
</div>
</body>
</html>