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
	

</div>
<div id="viz">
	<div id="loading"><img alt="Loading" src="ajax-loader.gif"><h4 style="text-align:center">Sorry for the long loading times!<br />Have a cat:</h2><img src="http://thecatapi.com/api/images/get?format=src&type=gif"></div>  
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