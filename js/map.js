

var animateOpening = false, //not true
	padding = 0,
	// width = 960 - padding,
	// height = 500 - padding - 75,
	// width = window.innerWidth - padding,
	width = window.outerWidth - padding,
	height = window.innerHeight - padding-200,
	centered,     // centered variable holds zoom state
	initialZoom = 190,
	maxZoom = 1000,
	hoverbox,
	hoverboxMinWidth = 450,
	// hoverboxHeight = 190,
	hoverboxHeight = 110,
	hoverBoxPortScaleMax = 500000000,
	hoverBoxPathScaleMax = 120000000,
	portGroups,	//Needs to be global
	pathGroups,
	storiesOpen = false,
	aboutOpen = false,
	introTextLength = 7000,
	introDelay1 = 0,
	introDelay2 = 7000,
	introDelay3 = 10000,
	introDelay4 = 16500,
	introDelay5 = 20500,
	introDelay6 = 27500,
	introDelay7 = 29500,
	maxMet = 493829170,
	minMet = 0,
	radiusSmall = 3,
	portOnOpacity = .7,
	margin = {top: 20, right: 30, bottom: 30, left: 40},
	widthChart = 960- margin.left - margin.right,
	heightChart = 500- margin.top - margin.bottom;

var formatThousands = d3.format(",");

//Metric tons
var energyBarsData = [
		[ "Crude Petroleum", 	1650000000 ],
		[ "Refined Petroleum", 	490000000 ],
		[ "Gasoline", 			250000000 ],
		[ "Residual Fuel Oil", 	110000000 ],
		[ "Other", 				210000000 ]
	];
var proj = d3.geo.naturalEarth()
    .scale(initialZoom)
    .translate([width / 2, height / 2]);
// var proj = d3.geo.mercator()
//     .scale(initialZoom)
//     .translate([width / 2, height / 2]);

d3.select("#reset").on("click", resetZoom);

var scaleVolume = d3.scale.linear()
		.domain([0, maxMet])
		.range([1, 100]);

var colorMap = d3.scale.linear()
		.domain([minMet, maxMet/10]) //493829169.9 is max
		.range([180, 360]);


var lightMap = d3.scale.linear()
		.domain([minMet, maxMet/10]) //493829169.9 is max
		.range([5, 50]);

var strokeMap = d3.scale.linear()
		.domain([minMet, maxMet/10]) //493829169.9 is max
		.range([1, 5]);

var zoom = d3.behavior.zoom()
	.translate(proj.translate())
	.scale(proj.scale())
	.scaleExtent([initialZoom, maxZoom])
	.on("zoom", function(){
		var t = d3.event.translate;
		var s = d3.event.scale;

		//console.log(t);
		//console.log(s);
		
		zoomInOut(t, s);
	})
var showReset = false;
var zoomInOut = function(t, s) {
if (showReset==true){
	$('#reset').fadeIn( "slow", function() {
})
}
if (showReset==false){
	$('#reset').fadeOut( "slow", function() {
})	
}
	// storiesOpen
if (s>initialZoom+10){

showReset = true;
console.log(s+"s is greater than orig");
console.log(t+"thisis T whenzooming")
// 711.6868545292956,122.64377570353645thisis T whenzooming 
// 662.5608946774215,139.51809552037798thisis T nozoom 
	zoom.translate(t);
	proj.translate(t).scale(s);

	// Reproject everything in the map
	map.selectAll("path")
		 .attr("d", path);

	portGroups.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];

		return "translate(" + x + "," + y + ")";
	 });

		pathGroups.selectAll("path")
			.transition()
			.duration(1000)
			.attrTween("stroke-dasharray", function() {
				var l = this.getTotalLength();
				var i = d3.interpolateString("0," + l, l + "," + l);
				return function(t) {
					return i(t);
				};
			})
			.attr("stroke-dashoffset",.1);

}
if (s<initialZoom+10){
	resetZoom();
showReset = false;

}
if (s<initialZoom+10){
	console.log(t+"thisis T nozoom")

	showReset = false;

console.log(s+"s less than orig");

	// Reproject everything in the map
	map.selectAll("path")
		 .attr("d", path);

	portGroups.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];
		return "translate(" + x + "," + y + ")";
	 });
}

};



// path generator - interprets any geo coordinates passed to it using the specific projection (.projection(proj))
var path = d3.geo.path()
			 .projection(proj)
			 .pointRadius(1.5);

// graticule data generator - creates geoJSON objects that d3.geo.path() can interpret
var graticule = d3.geo.graticule();

// create the svg
var svg = d3.select("#container").append("svg")
  .attr({
    "width": "100%",
    "height": "100%"
  })
  .attr("viewBox", "0 0 " + width + " " + height )
  .attr("preserveAspectRatio", "xMinYMin")
  .attr("pointer-events", "all")
			.call(zoom);

console.log(width+"thisiswidth");

// append a group to the svg to hold the map
var map = svg.append("g")
			.attr("class","map")
			// .attr("width", width)
			// .attr("height", height)
			// .attr("clip-path", "url(#map-area)");


// load data files; pass the results to ready() when everything is finished.
queue()
	.defer(d3.json, "data/world-110m.json")
	.defer(d3.json, "data/ports.json")
	.defer(d3.json, "data/paths.json")
	.defer(d3.tsv, "data/ports_data.tsv")
	.defer(d3.tsv, "data/paths_data.tsv")
	.await(ready);



function ready(error, world, ports, paths, ports_data, paths_data) {

	//MERGE DATA SETS

	var i, j, nameA, nameB;



	//Ports

	//console.log(ports);
	//console.log(ports_data);

	//Loop through once for each port
	for (i = 0; i < ports.features.length; i++) {

		nameA = ports.features[i].properties.port.toUpperCase();

		//Look for this port's info in ports_data
		for (j = 0; j < ports_data.length; j++) {

			nameB = ports_data[j].Name.toUpperCase();

			//If this is a match…
			if (nameA == nameB) {

				ports.features[i].properties.MetricTons		= parseFloat(ports_data[j].MetricTons);
				ports.features[i].properties.ImportMetTons	= parseFloat(ports_data[j].ImportMetTons);
				ports.features[i].properties.ExportMetTons	= parseFloat(ports_data[j].ExportMetTons);
				// ports.features[i].properties.Comm1			= ports_data[j].Comm1;
				// ports.features[i].properties.Comm2			= ports_data[j].Comm2;
				// ports.features[i].properties.Comm3			= ports_data[j].Comm3;
				// ports.features[i].properties.Ship1			= ports_data[j].Ship1;
				// ports.features[i].properties.Ship2			= ports_data[j].Ship2;
				// ports.features[i].properties.Ship3			= ports_data[j].Ship3;

			}

		}

	}




	//Paths

	//console.log(paths);
	//console.log(paths_data);

	//Loop through once for each path
	for (i = 0; i < paths.features.length; i++) {

		nameAStart = paths.features[i].properties.start.toUpperCase();
		nameAEnd = paths.features[i].properties.end.toUpperCase();

		//Look for this path's info in paths_data
		for (j = 0; j < paths_data.length; j++) {

			nameBStart = paths_data[j].USPt.toUpperCase();
			nameBEnd = paths_data[j].FgnPort.toUpperCase();

			//If this is a match…
			if (nameAStart == nameBStart && nameAEnd == nameBEnd) {

				paths.features[i].properties.USPt			= paths_data[j].USPt;
				paths.features[i].properties.FgnPort		= paths_data[j].FgnPort;
				paths.features[i].propzoom

				paths.features[i].properties.MetricTons		= parseFloat(paths_data[j].MetricTons);
				paths.features[i].properties.ImportMetTons	= parseFloat(paths_data[j].ImportMetTons);
				paths.features[i].properties.ExportMetTons	= parseFloat(paths_data[j].ExportMetTons);
				// paths.features[i].properties.Comm1			= paths_data[j].Comm1;
				// paths.features[i].properties.Comm2			= paths_data[j].Comm2;
				// paths.features[i].properties.Comm3			= paths_data[j].Comm3;
				// paths.features[i].properties.Ship1			= paths_data[j].Ship1;
				// paths.features[i].properties.Ship2			= paths_data[j].Ship2;
				// paths.features[i].properties.Ship3			= paths_data[j].Ship3;

			}

		}

	}

var noVolume = false;
var doPaths = false;
var animatePaths = false;
var backgroundFade = false;
var sizeAll = false;
var sizeExp = false;
var sizeImp = false;
$('#eBars').click(function(){
	backgroundFade = !backgroundFade;
	if (backgroundFade){
		fadeBackground();
	}
	else {
		unfadeBackground();
	}
	$('#otherBars').fadeToggle( "slow", function() {
})
  $('#energyBars').fadeToggle( "slow", function() {
})
});

$('.toggleVolume').click(function(){
	noVolume = !noVolume;
if (noVolume){
showPorts();
hidePaths();
}
else {
// unsizeAllVolumes();
showPaths();
}

	$('#animPaths').fadeToggle("fast",function(){
	});
	$('.volAll').slideToggle("slow", function(){
	});
	$('.volExp').slideToggle("slow", function(){
	});
	$('.volImp').slideToggle("slow", function(){
	});
})

$('.volAll').click(function(){
		sizeAllVolumes();
	    $(this).animate().css('background-color', 'white')
	    // $(this).animate().css('opacity', '1')
			$('.volImp').animate().css('background-color', 'black')
			$('.volExp').animate().css('background-color', 'black')
})
$('.volExp').click(function(){
		sizeExpVolumes();
		$(this).animate().css('background-color', 'white')
	    // $(this).animate().css('opacity', '1')
			$('.volAll').animate().css('background-color', 'black')
			$('.volImp').animate().css('background-color', 'black')
})
$('.volImp').click(function(){
		sizeImpVolumes();
		$(this).animate().css('background-color', 'white')
	    // $(this).animate().css('opacity', '1')
			$('.volAll').animate().css('background-color', 'black')
			$('.volExp').animate().css('background-color', 'black')
})

var pathAll = false;
// var pathExp = false;
// var pathImp = false;

$('#animPaths').click(function(){
pathAll = !pathAll;
if (pathAll){
showPaths();
 unsizeAllVolumes();
}
else {
 resizeAllVolumes();
showPaths();
}



// unsizeAllVolumes();
// showPaths();
// hidePorts();

	$('.pathAll').slideToggle("slow", function(){
	});
	$('.pathExp').slideToggle("slow", function(){
	});
	$('.pathImp').slideToggle("slow", function(){
	});
	// if (animatePaths){
	// 	changePaths();
	// }
	// else {
	// 	returnPaths();
	// }
})
$('.pathAll').click(function(){
	// pathAll = !pathAll;
	// if (pathAll){
		pathAllVolumes();
	    $(this).animate().css('background-color', 'white')
	    // $(this).animate().css('opacity', '1')
			$('.pathImp').animate().css('background-color', 'black')
			$('.pathExp').animate().css('background-color', 'black')
	// }
	// else {
	// 	returnPaths();
	// 	$(this).animate().css('background-color', 'black')
	// 	$(this).animate().css('opacity', '1')
	// }
})
$('.pathExp').click(function(){
	// pathExp = !pathExp;
	//  if (pathExp){
		pathExpVolumes();
		$(this).animate().css('background-color', 'white')
	    // $(this).animate().css('opacity', '1')
			$('.pathAll').animate().css('background-color', 'black')
			$('.pathImp').animate().css('background-color', 'black')
	// }
	// else {
	// 	returnPaths();
	// 	$(this).animate().css('background-color', 'black')
	// 	$(this).animate().css('opacity', '1')
	// }
})
$('.pathImp').click(function(){
	// pathImp = !pathImp;
	// if (pathImp){
		pathImpVolumes();
		$(this).animate().css('background-color', 'white')
	    // $(this).animate().css('opacity', '1')
	   		$('.pathAll').animate().css('background-color', 'black')
			$('.pathExp').animate().css('background-color', 'black')
	// }
	// else {
	// 	returnPaths();
	// 	$(this).animate().css('background-color', 'black')
	// 	$(this).animate().css('opacity', '1')
	// }
})



function fadeBackground(){
	map.attr("opacity", .3)
}

function unfadeBackground(){
	map.attr("opacity", 1)
}



	//START DRAWING

	// use the graticule generator to make a map background and gridlines
	map.append("path")
		.datum(graticule.outline)
		.attr("class", "background")
		.attr("d", path);

	map.append("path")
		.datum(graticule)
		.attr("class", "graticule noclicks")
		.attr("d", path);

	// append landforms from world-110m.json
	map.append("path")
		.datum(topojson.feature(world, world.objects.land))
		.attr("class", "land")
		.attr("d", path);

	//Shipping Paths

	// var pathGroups = map.append("g")
	pathGroups = map.append("g")
		.attr("class", "paths")
		.selectAll("g")
		.data(paths.features)
		.enter()
		.append("g")
		.on("mouseover", function(d) {
			updateHoverbox(d.properties, "path");
			d3.select(this).each(moveToFront);
		})
		.on("mouseout", function(d) {
			hideHoverbox();
		});

	//Create background paths (for hover purposes)
	pathGroups.append("path")
		.attr("class", "background")
		.attr("d", path)
		.attr("stroke-dasharray", "0, 0.1");  //Initially, line is not visible

	//Create visible paths
	pathGroups.append("path")
		.attr("class", "visible")
		.attr("stroke","#307074")
		.attr("opacity",1)
		.attr("stroke-width", ".75")
		.attr("d", path)
		.attr("stroke-dasharray", "0, 0.1");  //Initially, line is not visible

		d3.selectAll("path")
			.attr("stroke-dasharray", "none");

	//Ports

	// Make a group for each port
	portGroups = map.append("g")
		.attr("class", "ports")
		.selectAll("g")
		.data(ports.features)
		.enter()
		.append("g")
		.attr("class", "port")
		.classed("clickable", function(d) {
			// console.log(maxMet+"maxmetrictons");
			// if (d.properties.scalerank == 1) {
				return true;
			// }
			// return false;
		})
		.attr("transform", function(d) {
			var x = proj([d.properties.lon,d.properties.lat])[0];
			var y = proj([d.properties.lon,d.properties.lat])[1];
			return "translate(" + x + "," + y + ")";
		});


	// Clickable ports get the click handler
	// d3.selectAll('.port.clickable')
	d3.selectAll('.port')
		.on('click', click)
		.on("mouseover", function(d) {
			updateHoverbox(d.properties, "port");
			d3.select(this).each(moveToFront);
				d3.select(this).append("text")
				.attr("class", "label")
				.attr("x", "-8")
				.attr("y", "-3")
				.attr("opacity", 1)
				.attr("text-anchor", "end")
				.text(function(d) { 
					// return d.properties.port;
				});
		})
		.on("mouseout", function(d) {
			hideHoverbox();
			d3.selectAll('.label')
			.remove();
		});
	// In each group, add a circle

		portGroups.append("circle")
			.attr("class", "point")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", radiusSmall)
			// .attr("stroke", "none")
			.attr("opacity", portOnOpacity);

function sizeAllVolumes(){
		console.log("in all")
		portGroups.selectAll("circle")
		.attr("class", "circleAll")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				return Math.sqrt(parseInt(d.properties.MetricTons)/1000000);
			});	
}
function resizeAllVolumes(){
		console.log("return circles")

		portGroups.selectAll("circle")
			.transition()
			.duration(500)
			.attr("r", radiusSmall)
}
function unsizeAllVolumes(){
		console.log("return circles")

		portGroups.selectAll("circle")
			.transition()
			.duration(500)
			.attr("r", .5)
			.attr("opacity", ".2");
}
function sizeExpVolumes(){
		console.log("in export")

		portGroups.selectAll("circle")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				return Math.sqrt(parseInt(d.properties.ExportMetTons)/1000000);
			});	
}
function sizeImpVolumes(){
		console.log("in import")

		portGroups.selectAll("circle")
		// .attr("class", "hidden")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				return Math.sqrt(parseInt(d.properties.ImportMetTons)/1000000);
			});	
}
function pathAllVolumes(){
	console.log("in paths")
		pathGroups.selectAll("path")
			.transition()
			.duration(1000)
		.attr("stroke", function(d){
			return "hsl(180,100,"+lightMap(d.properties.MetricTons)+")"
			});
}
function pathExpVolumes(){
	console.log("in paths")
		pathGroups.selectAll("path")
			.transition()
			.duration(1000)
		.attr("stroke", function(d){
			return "hsl(180,100,"+lightMap(d.properties.ExportMetTons)+")"
			});
}
function pathImpVolumes(){
	console.log("in path imports")
		pathGroups.selectAll("path")
			.transition()
			.duration(1000)
			.attr("stroke", function(d){
			return "hsl(180,100,"+lightMap(d.properties.ImportMetTons)+")"
			});
}



function hidePorts(){
	console.log("hide ports")
		portGroups.selectAll("circle")
			.transition()
			.duration(100)
			.attr("r", radiusSmall)
			.attr("opacity",.1);
}
function showPorts(){
	console.log("showports")
		portGroups.selectAll("circle")
			.transition()
			.duration(100)
			.attr("r", radiusSmall)
			.attr("opacity",portOnOpacity);
}
function hidePaths(){
	console.log("hide paths")
		pathGroups.selectAll("path")
			.transition()
			.duration(100)
			.attr("opacity",.1)
}
function showPaths(){
		console.log("show paths")
		pathGroups.selectAll("path")
			.transition()
			.duration(2000)
			.attr("stroke","#307074")
			.attr("opacity",.8)
		// pathGroups.selectAll("path")
		// 	.transition()
		// 	.duration(2000)
			.attrTween("stroke-dasharray", function() {
				var l = this.getTotalLength();
				var i = d3.interpolateString("0," + l, l + "," + l);
				return function(t) {
					return i(t);
				};
			});
			// .attr("stroke-dashoffset",.1);

			// .attrTween("stroke-dasharray", function() {
			// 	var l = this.getTotalLength();
			// 	var i = d3.interpolateString("0," + l, l + "," + l);
			// 	return function(t) {
			// 		return i(t);
			// 	};
			// })
			// .attr("stroke-dashoffset",.1);

}

	//Clip path and energy bars
	var mapHeight = d3.select(".map").node().getBBox().height;

	var mapWidth = d3.select(".map").node().getBBox().width;
	var barsLeftEdge = (width - mapWidth) / 2;

	// map.append("defs")
	// 	.append("clipPath")
	// 	.attr("id", "map-area")
	// 	.append("rect")
	// 	// .attr("x", barsLeftEdge)
	// 	.attr("x",0)
	// 	.attr("y", 0)
	// 	.attr("width", mapWidth)
	// 	.attr("height", height);

var otherBarsScale = d3.scale.linear()
.domain([0,maxMet])
.range([mapHeight-40,0]);

var widthScale = d3.scale.linear()
	.domain([0, 900])
	.range([125, width/1.1]);

ports.features.sort(function(a,b){
	return b.properties.MetricTons - a.properties.MetricTons;
})
svg.append("g")
	.attr("id","otherBars")
	// .attr("transform","translate("+barsLeftEdge+",0)");

var otherBars = d3.select("#otherBars")
.selectAll("g")
.data(ports.features)
.enter()
.append("g")
.attr("transform", function(d,i){
	var yOtherScale = otherBarsScale(d.properties.MetricTons)
	return "translate("+widthScale(i)+","+0+")";
});

otherBars.append("rect")
		.attr("x", function(d,i){
			// return widthScale(i);
			return 0;
		})
		// .attr("y",0)
		.attr("y", function(d,i){
			return mapHeight-otherBarsScale(d.properties.MetricTons)
		})
		.attr("width", 3)
		.attr("fill","gray")
		.attr("opacity",".4")
		// .style("stroke-width", 1)
		// .style("stroke","white")
.attr("height", function(d,i){
	return otherBarsScale(d.properties.MetricTons);
});
		// .style("opacity", 1);


	var energyBarsScale = d3.scale.linear()
		.domain([0, d3.sum(energyBarsData, function(d) { return d[1]; }) ])
		.range([0, mapWidth+100]);

	svg.append("g")
		.attr("id", "energyBars")
		.attr("transform", "translate(0,0)");

	var energyBars = d3.select("#energyBars")
		.selectAll("g")
		.data(energyBarsData)
		.enter()
		.append("g")
		.classed("rollover", function(d, i) {

			if (i == 0) {
				return false;
			} else {
				return true;
			}

		})
		.attr("transform", function(d, i) {

			var x =0;

			for (var j = 0; j < i; j++) {
				x += energyBarsData[j][1];
			}

			return "translate(" + energyBarsScale(x) + ",0)";

		});

	energyBars.append("rect")
		.attr("x", 140)
		.attr("y", 0)
		.attr("width", function(d) {
			return energyBarsScale(d[1]);
		})
		.style("stroke-width", 4)
		.attr("height", 30)
		.style("opacity", function(d, i) {
			return 1.0 - (i / energyBarsData.length);
		});

	
	var bars = d3.selectAll("#energyBars g")
		.filter(function(d, i) {
			if (i > 0) {
				return true;
			}
			return false;
		});

	bars.append("line")
		.attr("x1", function(d) {
			return 140+energyBarsScale(d[1]);
		})
		.attr("y1", 0)
		.attr("x2", function(d) {
			return 140+energyBarsScale(d[1]);
		})
		.attr("y2", 50);

	

	energyBars.append("text")
		.attr("x", function(d, i) {

			if (i == 0) {
				return 143;
			} else {
				return 140+energyBarsScale(d[1]);
			}

		})
		.attr("y", function(d, i) {

			if (i == 0) {
				// return 45;
				return 20;
			} else {
				// return 75;
				return 20;
			}

		})
		.text(function(d, i) {
			return d[0] + " " + formatThousands(d[1]) + " million tons";
		})
		.style("fill", function(d, i) {

			if (i == 0) {
				return "black";
			} else {
				return "black";
			}

		})
		.style("text-anchor", function(d, i) {

			if (i == 0) {
				return "start";
			} else {
				return "end";
			}

		});



	//Setup hover box
	hoverbox = svg.append("g")
		.attr("id", "hoverbox")
		.attr("class", "hidden")
		.attr("transform", "translate(0,0)");

	hoverbox.append("rect")
		.attr("class", "background")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", hoverboxMinWidth)
		.attr("height", hoverboxHeight);

	hoverbox.append("text")
		.attr("class", "title")
		.attr("x", 10)
		.attr("y", 24)
		.text("Port: Houston to NYC");

	hoverbox.append("rect")
		.attr("class", "imports")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("x", 10)
		.attr("y", 50)
		.attr("width", 50)
		.attr("height", 20)
		.attr("opacity", .7);

	hoverbox.append("rect")
		.attr("class", "exports")
		.attr("stroke", "white")
		.attr("stroke-width", 1)
		.attr("x", 50)
		.attr("y", 50)
		.attr("width", 50)
		.attr("height", 20)
		.attr("opacity", .7);


	hoverbox.append("rect")
		.attr("class", "total")
		.attr("stroke", "none")
		.attr("fill", "none")
		.attr("stroke-width", 0)
		.attr("x", 10)
		.attr("y", 50)
		.attr("width", 50)
		.attr("height", 20);


	hoverbox.append("text")
		.attr("class", "imports")
		.attr("x", 0)
		.attr("y", 0)
		.text("imports")
		.attr("opacity", .7);

	hoverbox.append("text")
		.attr("class", "exports")
		.attr("x", 0)
		.attr("y", 0)
		.text("exports")
		.attr("opacity", .7);


	hoverbox.append("text")
		.attr("class", "total")
		.attr("x", 0)
		.attr("y", 0)
		.text("total");

	if (animateOpening) {

		d3.select("#intro1")
			.style("display", "block")
			.transition()
			.delay(introDelay1)
			.duration(1500)
			.style("opacity", 1.0)
			.each("end", function() {
				d3.select(this)
					.transition()
					.delay(4000)
					.duration(1500)
					.style("opacity", 0.0)
					.each("end", function() {
						d3.select(this).style("display", "none");
					});
			});

		d3.select("#intro2")
			.style("display", "block")
			.transition()
			.delay(introDelay3)
			.duration(1500)
			.style("opacity", 1.0)
			.each("end", function() {
				d3.select(this)
					.transition()
					.delay(4000)
					.duration(1500)
					.style("opacity", 0.0)
					.each("end", function() {
						d3.select(this).style("display", "none");
					});
			});

		d3.select("#intro3")
			.style("display", "block")
			.transition()
			.delay(introDelay5)
			.duration(1500)
			.style("opacity", 1.0)
			.each("end", function() {
				d3.select(this)
					.transition()
					.delay(4000)
					.duration(1500)
					.style("opacity", 0.0)
					.each("end", function() {
						d3.select(this).style("display", "none");
					});
			});

		d3.select("#storyContainer")
			.transition()
			.delay(introDelay6)
			.each("start", function() {
				d3.select(this)
					.select(".thumb")
					.classed("selected", true);
				openStories();
			});

		d3.select("#intro4")
			.on("click", function() {

				d3.select(this)
					.transition()
					.duration(1500)
					.style("opacity", 0.0)
					.each("end", function() {
						d3.select(this).style("display", "none");
					});

				closeStories();

				//Slow reveal of port names
				portGroups.selectAll("text.label")
					.transition()
					.delay(2000)
					.duration(2000)
					.attr("opacity", 1.0);

			})
			.style("display", "block")
			.transition()
			.delay(introDelay7)
			.duration(1500)
			.style("opacity", 1.0);

	} 







}
//End ready()


function click(d) {


	// if there is data, and if you aren't already zoomed onto the object clicked
	if (d && centered !== d) {
		
		centered = d;

		var newScale = maxZoom;
console.log(newScale+"newscale");
		zoom.scale(newScale);
		proj.scale(newScale);
		
		var coords = proj([d.properties.lon, d.properties.lat]);

		var translate = proj.translate();

		var newTranslate = [];

		newTranslate[0] = translate[0] - coords[0] + width / 2;

		if (storiesOpen) {
			//Story panel is open, so subtract the 500px height of that panel
			newTranslate[1] = translate[1] - coords[1] + (height - 500) / 2;
		} else {
			//Story panel is closed
			newTranslate[1] = translate[1] - coords[1] + height / 2;	
		}

		zoom.translate(newTranslate);
		proj.translate(newTranslate);

	} else {
		
		// otherwise, just reset the zoom

		centered = null;
	 
		zoom.translate([width / 2, height / 2]).scale(initialZoom);
		proj.translate([width / 2, height / 2]).scale(initialZoom);
	
	}

	// Reproject everything in the map
	map.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);

	portGroups.transition()
		.duration(500)
		.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];
		return "translate(" + x + "," + y + ")";
	 });

	d3.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);

};







function position_labels() {

	var centerPos = proj.invert([width/2,height/2]);
	var arc = d3.geo.greatArc();

	svg.selectAll(".label")
		.attr("text-anchor",function(d) {
			//var x = proj(d.geometry.coordinates)[0];
			var x = proj([d.properties.lon,d.properties.lat])[0];
			return x < width/2-20 ? "end" :
			x < width/2+20 ? "middle" :
			"start"
		})
		.attr("x",function(d){ 
			//var x = proj(d.geometry.coordinates)[0];
			var x = proj([d.properties.lon,d.properties.lat])[0];
			var offset = x < width/2 ? -5 : 5;
			return x+offset;
		})
		.attr("y",function(d){ 
			//var y = proj(d.geometry.coordinates)[1];
			var y = proj([d.properties.lon,d.properties.lat])[1];    
			return y-2;
		});
}



var updateHoverbox = function(d, type) {

	//Type is "port" or "path"

	//console.log(d);

	//Special handling for ports
	if (type == "port") {

		var xy = proj([d.lon, d.lat]);
		hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");

		hoverbox.select(".title").text("Port: "+d.port);

		var hoverBoxScaleMax = hoverBoxPortScaleMax;
	
	}
	//Special handling for paths
	else {

		var xy = d3.mouse(svg.node());
		hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");

		hoverbox.select(".title").text(d.USPt + " ↔ " + d.FgnPort);

		var hoverBoxScaleMax = hoverBoxPathScaleMax;

	}

	//Calculate relative proportions for the import/export rects
	var totalWidth = hoverboxMinWidth - 20;

////////////////////////////////////////////////////


var impexbar = totalWidth;
var importScale = d3.scale.linear()
	.domain([0, d.MetricTons]) //fix this later and make it the real nice max
	.range([0, impexbar]);
var exportScale = d3.scale.linear()
	.domain([0, d.MetricTons]) //fix this later and make it the real nice max
	.range([0, impexbar]);

	var importsWidth = importScale (d.ImportMetTons);
	var exportsWidth = exportScale (d.ExportMetTons);

////////////////////////////////////////////////////

	hoverbox.select("rect.total").attr("width", impexbar);
	hoverbox.select("rect.imports").attr("width", importsWidth);
	hoverbox.select("rect.exports").attr("x", 10 + importsWidth).attr("width", exportsWidth);


	var exportsText = "Exports: ";
	var exportsPerc = makePercentage(d.ExportMetTons, d.MetricTons);
	var importsLabelWidth = hoverbox.select("text.imports").node().getBBox().width;
	var exportsLabelWidth = hoverbox.select("text.exports").node().getBBox().width;
		exportsText += exportsPerc+"%";

if (exportsPerc<10){
var exIs = totalWidth-70;
}
else {
var exIs = totalWidth-80;
}
	var exportsLabelX = exIs;
	var exportsLabelY = 85;


		/////////////////////////////////////////////
var imIs = 	10;
	var importsLabelX = imIs;
	var importsLabelY = exportsLabelY;
	var importsText = "Imports: ";
		function makePercentage(number1, number2){
		return Math.floor((number1 / number2) * 100);
		}
		importsText += makePercentage(d.ImportMetTons, d.MetricTons)+"%";
		/////////////////////////////////////////////
	var totalLabelX = imIs;
	var totalLabelY = 40;
	var totalText = "Total: ";
		function makeNormal(number){
			if (number>1000000){
			var newNum = number/1000000;
				return Math.round(newNum);
			}
			else {
			var newNum = number/1000;
				return Math.round(newNum);
			}
		}
		if (d.MetricTons>1000000){
			totalText += makeNormal(d.MetricTons)+"mil";
		}
		else {
			totalText += makeNormal(d.MetricTons)+"k";			
		}
		////////////////////////////////////////////



	hoverbox.select("text.exports")
		.attr("x", exportsLabelX)
		.attr("y", exportsLabelY)
		.text(exportsText);

	hoverbox.select("text.imports")
		.attr("x", importsLabelX)
		.attr("y", importsLabelY)
		.text(importsText);
		//////////////////
	hoverbox.select("text.total")
		.attr("x", totalLabelX)
		.attr("y", totalLabelY)
		.text(totalText);
		//////////////////


	// hoverbox.select("#ship1").text(d.Ship1.toUpperCase());
	// hoverbox.select("#ship2").text(d.Ship2.toUpperCase());
	// hoverbox.select("#ship3").text(d.Ship3.toUpperCase());
	// hoverbox.select("#comm1").text(d.Comm1.toUpperCase());
	// hoverbox.select("#comm2").text(d.Comm2.toUpperCase());
	// hoverbox.select("#comm3").text(d.Comm3.toUpperCase());

	hoverbox.classed("hidden", false);

};



var hideHoverbox = function() {
	hoverbox.classed("hidden", true);
};

var showCities = function(){
	city.classed("hidden", false);
}
var hideCities = function(){
	city.classed("hidden", true);
}

//Move SVG elements to the end of their container,
//so they appear "on top".
var moveToFront = function() { 
	this.parentNode.appendChild(this); 
}







//Story div behavior
d3.select("#storyContainer .nav #closeStories")
	.on("click", function() {
		closeStories();
	});


d3.selectAll(".thumb")
	.on("mouseover", function(d,i){
		//Unhighlight all paths and ports
		d3.selectAll("path.selected").classed("selected", false);
		d3.selectAll(".port.selected").classed("selected", false);

		//Get associated data
		var source = d3.selectAll(".story")[0][i + 1];
		var start = source.getAttribute("data-start-port");
		var end = source.getAttribute("data-end-port");
		var port = source.getAttribute("data-port");

		//Is this story associated with a specific port?
		if (port) {
			//console.log(port);

			port = port.toUpperCase();

			//Highlight associated port
			d3.selectAll(".ports .port")
				.filter(function(d) {
					if (d.properties.port.toUpperCase() == port) {
						return true;
					}
					return false;
				})
				.classed("selected", true)
				.each(function(d) {
					// tuckMapUp(d);
				})
				.each(moveToFront);
		}

		//Is this story associated with a path?
		else {
			//console.log(start + ", " + end);

			start = start.toUpperCase();
			end = end.toUpperCase();

			//Highlight associated path
			d3.selectAll(".paths path")
				.filter(function(d) {
					//console.log(d);
					if (d.properties.USPt.toUpperCase() == start &&
						d.properties.FgnPort.toUpperCase() == end) {
						return true;
					}
					return false;
				})
				.classed("selected", true)
				.each(moveToFront);

			//Highlight associated port(s)
			d3.selectAll(".ports .port")
				.filter(function(d) {
					if (d.properties.port.toUpperCase() == start ||
						d.properties.port.toUpperCase() == end) {
						return true;
					}
					return false;
				})
				.classed("selected", true)
				.each(function(d) {
					if (d.properties.port.toUpperCase() == start) {
						// tuckMapUp(d);
					}
				})
				.each(moveToFront);

		}	

		//Update thumbs' selected status
		// d3.selectAll(".thumb.selected").classed("selected", false);
		// d3.select(this).classed("selected", true);

	})
.on("mouseout", function(d,i){
	d3.selectAll("path.selected").classed("selected", false);
	d3.selectAll(".port.selected").classed("selected", false);
});






d3.selectAll(".thumb")
	.on("click", function(d, i) {

		stopVideos();

		//Open story panel, if needed
		if (!storiesOpen) {
			openStories();
		}

		//Jump to whatever story is associated with this thumb
		$("#stories").cycle("goto", i);

		//Jump to the first image for this story
		$(".slides").cycle("goto", 0);

		//Unhighlight all paths and ports
		d3.selectAll("path.selected").classed("selected", false);
		d3.selectAll(".port.selected").classed("selected", false);

		//Get associated data
		var source = d3.selectAll(".story")[0][i + 1];
		var start = source.getAttribute("data-start-port");
		var end = source.getAttribute("data-end-port");
		var port = source.getAttribute("data-port");

		//Is this story associated with a specific port?
		if (port) {
			//console.log(port);

			port = port.toUpperCase();

			//Highlight associated port
			d3.selectAll(".ports .port")
				.filter(function(d) {
					if (d.properties.port.toUpperCase() == port) {
						return true;
					}
					return false;
				})
				.classed("selected", true)
				.each(function(d) {
					tuckMapUp(d);
				})
				.each(moveToFront);
		}

		//Is this story associated with a path?
		else {
			//console.log(start + ", " + end);

			start = start.toUpperCase();
			end = end.toUpperCase();

			//Highlight associated path
			d3.selectAll(".paths path")
				.filter(function(d) {
					//console.log(d);
					if (d.properties.USPt.toUpperCase() == start &&
						d.properties.FgnPort.toUpperCase() == end) {
						return true;
					}
					return false;
				})
				.classed("selected", true)
				.each(moveToFront);

			//Highlight associated port(s)
			d3.selectAll(".ports .port")
				.filter(function(d) {
					if (d.properties.port.toUpperCase() == start ||
						d.properties.port.toUpperCase() == end) {
						return true;
					}
					return false;
				})
				.classed("selected", true)
				.each(function(d) {
					if (d.properties.port.toUpperCase() == start) {
						tuckMapUp(d);
					}
				})
				.each(moveToFront);

		}	

		//Update thumbs' selected status
		d3.selectAll(".thumb.selected").classed("selected", false);
		d3.select(this).classed("selected", true);

	});



var closeStories = function() {

	//Close stories
	d3.select("#storyContainer")
		.transition()
		.duration(2000)
		.style("height", "100px");

	d3.selectAll(".thumb.selected").classed("selected", false);

	//Unhighlight all paths and ports
	d3.selectAll("path.selected").classed("selected", false);
	d3.selectAll(".port.selected").classed("selected", false);

	//Stop videos
	stopVideos();

	// d3.selectAll("#prevStory, #nextStory")
	// 	.transition()
	// 	.duration(1000)
	// 	.style("opacity", 0.0)
	// 	.each("end", function() {
	// 		d3.select(this).style("display", "none");
	// 	});

	d3.selectAll("#closeStories")
		.transition()
		.duration(1000)
		.style("opacity", 0.0)
		.each("end", function() {
			d3.select(this).style("display", "none");
		});

	resetMap();

	storiesOpen = false;

};


var openStories = function() {

	//Open stories
	d3.select("#storyContainer")
		.transition()
		.duration(2000)
		.style("height", "500px");

	// d3.selectAll("#prevStory, #nextStory")
	// 	.transition()
	// 	.delay(1000)
	// 	.duration(1000)
	// 	.each("start", function() {
	// 		d3.select(this).style("display", "inline-block");
	// 	})
	// 	.style("opacity", 1.0);

	d3.selectAll("#closeStories")
		.transition()
		.delay(1000)
		.duration(1000)
		.each("start", function() {
			d3.select(this).style("display", "inline-block");
		})
		.style("opacity", 1.0);

	tuckMapUp();

	storiesOpen = true;

};




var resetMap = function() {
	//Reset map
	zoom.translate([width / 2, height / 2]).scale(initialZoom);
	proj.translate([width / 2, height / 2]).scale(initialZoom);

	map.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);

	portGroups.transition()
		.duration(500)
		.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];
		return "translate(" + x + "," + y + ")";
	 });

	d3.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);

};

var tuckMapUp = function(d) {

	//If 'd' is passed in here, then center the view on that port.
	//If 'd' is not passed in, then use a default pan/zoom.

	if (d) {
		console.log("inside d")
		centered = d;
		
		var coords = proj([d.properties.lon, d.properties.lat]);

		var translate = proj.translate();

		var newTranslate = [];
		newTranslate[0] = width / 2;
		// newTranslate[0] = proj([d.properties.lon,d.properties.lat])[0];
		newTranslate[1] = translate[1] - coords[1] + (height - 500) / 2;

		zoom.translate(newTranslate).scale(initialZoom);
		proj.translate(newTranslate).scale(initialZoom);

	} else {
		console.log("inside else not d")

		zoom.translate([width / 2, height / 3]).scale(initialZoom);
		proj.translate([width / 2, height / 3]).scale(initialZoom);

	}

	map.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);

	portGroups.transition()
		.duration(500)
		.attr("transform", function(d) {
			var x = proj([d.properties.lon,d.properties.lat])[0];
			var y = proj([d.properties.lon,d.properties.lat])[1];
			return "translate(" + x + "," + y + ")";
		});

	d3.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);

};
function resetZoom(){
zoom.translate([width / 2, height / 2]).scale(initialZoom);
proj.translate([width / 2, height / 2]).scale(initialZoom);

	// map.selectAll("path")
	// 	.transition()
	// 	.duration(500)
	// 	.attr("d", path);

	portGroups.transition()
		.duration(500)
		.attr("transform", function(d) {
			var x = proj([d.properties.lon,d.properties.lat])[0];
			var y = proj([d.properties.lon,d.properties.lat])[1];
			return "translate(" + x + "," + y + ")";
		});

	d3.selectAll("path")
		.transition()
		.duration(500)
		.attr("d", path);
	$('#reset').fadeOut( "slow", function() {
})			
}

d3.selectAll("#prevImage, #nextImage")
	.on("click", function() {
		//d3.selectAll("video").node().pause();
	});


var openAbout = function() {
	d3.select("#aboutContent")
		.style("display", "block")
		.transition()
		.duration(500)
		.style("opacity", 1.0);
};
var closeAbout = function() {
	d3.select("#aboutContent")
		.transition()
		.duration(500)
		.style("opacity", 0.0)
		.each("end", function() {
			d3.select(this).style("display", "none");
		});

};

d3.select("#aboutLink")
	.on("click", function() {
		if (aboutOpen) {
			closeAbout();
			aboutOpen = false;
		} else {
			openAbout();
			aboutOpen = true;
		}
	});
d3.select("#aboutContent")
	.on("click", function() {
		closeAbout();
		aboutOpen = false;
	});




//Stop all videos
var stopVideos = function() {

	//List one line here for any videos that are added to the project
	//For some reason, d3.select().node() doesn't work to pause video,
	//so we have to use document.getElementById…

	document.getElementById("vid1").pause()

};


function draw(){
		//START DRAWING

	// use the graticule generator to make a map background and gridlines
	// map.append("path")
	// 	.datum(graticule.outline)
	// 	.attr("class", "background")
	// 	.attr("d", path);

	// map.append("path")
	// 	.datum(graticule)
	// 	.attr("class", "graticule noclicks")
	// 	.attr("d", path);

	// append landforms from world-110m.json
	map.append("path")
		.datum(topojson.feature(world, world.objects.land))
		.attr("class", "land")
		.attr("d", path);

	//Shipping Paths

	var pathGroups = map.append("g")
		.attr("class", "paths")
		.selectAll("g")
		.data(paths.features)
		.enter()
		.append("g")
		.on("mouseover", function(d) {
			updateHoverbox(d.properties, "path");
			d3.select(this).each(moveToFront);
		})
		.on("mouseout", function(d) {
			hideHoverbox();
		});

	//Create background paths (for hover purposes)
	pathGroups.append("path")
		.attr("class", "background")
		.attr("d", path)
		.attr("stroke-dasharray", "0, 0.1");  //Initially, line is not visible

	//Create visible paths
	pathGroups.append("path")
		.attr("class", "visible")
		.attr("d", path)
		.attr("stroke-dasharray", "0, 0.1");  //Initially, line is not visible

		d3.selectAll("path")
			.attr("stroke-dasharray", "none");

// function drawPorts(){
	//Ports
	// Make a group for each port
	portGroups = map.append("g")
		.attr("class", "ports")
		.selectAll("g")
		.data(ports.features)
		.enter()
		.append("g")
		.attr("class", "port")
		.classed("clickable", function(d) {
			// if (d.properties.scalerank == 1) {
				return true;
			// }
			// return false;
		})
		.attr("transform", function(d) {
			var x = proj([d.properties.lon,d.properties.lat])[0];
			var y = proj([d.properties.lon,d.properties.lat])[1];
			return "translate(" + x + "," + y + ")";
		});

	portGroups
		.on('click', click)
		.on("mouseover", function(d) {
			updateHoverbox(d.properties, "port");
			d3.select(this).each(moveToFront);
				d3.select(this).append("text")
				.attr("class", "label")
				.attr("x", "-8")
				.attr("y", "-3")
				.attr("opacity", 1)
				.attr("text-anchor", "end")
				.text(function(d) { 
					// return d.properties.port;
				});
		})
		.on("mouseout", function(d) {
			hideHoverbox();
			d3.selectAll('.label')
			.remove();
			// .attr("opacity", 0);
		});
	// In each group, add a circle

		portGroups.append("circle")
			.attr("class", "point")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", radiusSmall)
			// .attr("stroke", "none")
			.attr("opacity", portOnOpacity)
}

d3.selectAll("#nextImage, #prevImage")
	.on("click", function() {
		stopVideos();
	});


