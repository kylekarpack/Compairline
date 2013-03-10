// JavaScript Document

$(document).ready(function() {
	var graphicElements
	$('#brushing label').mouseenter(function() {
		console.log(this);
		var className = $(this).attr('class');
		graphicElements = $('circle:not(.' + className + '), path.trend:not(.' + className + ')');
		graphicElements.css({"opacity": .05, "fill":"grey", "stroke":"grey"});
	}).mouseleave(function() {
		graphicElements.css({"opacity": "", "fill":"", "stroke":""});
	});
 });