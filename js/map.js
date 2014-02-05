
// $('.vim').hide();

var animateOpening = true, //not true
			readyForPorts = false,
			readyForPaths = false,
	padding = 0,
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
	// pathGroups,
	storiesOpen = false,
	aboutOpen = false,
	introTextLength = 7000,
	introDelay1 = 0,
	introDelay2 = 14000,
	introDelay3 = 18000,
	introDelay4 = 23500,
	introDelay5 = 27500,
	introDelay6 = 36500,
	introDelay7 = 36500,
	maxMet = 493829170,
	minMet = 0,
	radiusSmall = 2,
	radiusTiny = 1,
	radiusLarge = 30,
	portOnOpacity = .7,
	margin = {top: 20, right: 30, bottom: 30, left: 40},
	widthChart = 960- margin.left - margin.right,
	heightChart = 500- margin.top - margin.bottom;




var num = Math.floor(Math.random() * 5); // 0...6
    if (num>0){
document.getElementById("thumb1").src="stories/0/"+num+".jpg";
document.getElementById("thumb2").src="stories/1/"+num+".jpg";
document.getElementById("thumb3").src="stories/2/"+num+".jpg";
document.getElementById("thumb4").src="stories/3/"+num+".jpg";
document.getElementById("thumb5").src="stories/4/"+num+".jpg";
document.getElementById("thumb6").src="stories/5/"+num+".jpg";
}
else {
	num = 1;
document.getElementById("thumb1").src="stories/0/"+num+".jpg";
document.getElementById("thumb2").src="stories/1/"+num+".jpg";
document.getElementById("thumb3").src="stories/2/"+num+".jpg";
document.getElementById("thumb4").src="stories/3/"+num+".jpg";
document.getElementById("thumb5").src="stories/4/"+num+".jpg";
document.getElementById("thumb6").src="stories/5/"+num+".jpg";	
}





var formatThousands = d3.format(",");
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
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
		
		zoomInOut(t, s);
	})
var showReset = false;

var zoomInOut = function(t, s) {
if (showReset==true){
	$('#reset').slideDown( "slow", function() {
})
}
if (showReset==false){
	$('#reset').slideUp( "slow", function() {
})	
}
if (s>initialZoom+10){
showReset = true;
console.log(s+"s is greater than orig");
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
}

};



// path generator - interprets any geo coordinates passed to it using the specific projection (.projection(proj))
var path = d3.geo.path()
			 .projection(proj)
			 .pointRadius(radiusSmall);

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

















svg.append("g")
	.attr("id","legendPorts")

var legendPorts = d3.select("#legendPorts")
// .selectAll("g")
// .append("g");

var legendX = 65;
var legendY = 500;
legendPorts.append("circle")
		.attr("class","legendB")
		.attr("cx", legendX)
		.attr("cy",legendY)
		.attr("r", radiusLarge)
		.attr("fill","gray")
		.attr("opacity",".4");
legendPorts.append("circle")
		.attr("class","legendS")
		.attr("cx", legendX)
		.attr("cy",legendY)
		.attr("r", radiusSmall)
		.attr("fill","gray")
		.attr("opacity",".4");
legendPorts.append("text")
		.attr("class","legendText")
		.attr("x", legendX+5)
		.attr("y", legendY-5)
		.attr("fill", "gray")
		.text("Scale: 0 - "+ numberWithCommas(Math.round(466786572/1000000))+"mil"); 
	//draw three circles and text to say how big they are in the bottom left corner
	//activated when port volumes clicked
























// append a group to the svg to hold the map
var map = svg.append("g")
			.attr("class","map")
			// .attr("width", width)
			// .attr("height", height)
			.attr("clip-path", "url(#map-area)");


// load data files; pass the results to ready() when everything is finished.
queue()
	.defer(d3.json, "data/world-110m.json")
	.defer(d3.json, "data/ports.json")
	.defer(d3.json, "data/updated_paths.json")
	.defer(d3.tsv, "data/ports_data.tsv")
	.defer(d3.csv, "data/updated_paths_data.csv")
	// .defer(d3.tsv, "data/paths_data.tsv")
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
			}

		}

	}


	// console.log(paths);
	// console.log(paths_data);

	for (j = 0; j < paths_data.length; j++) {

			nameBStart = paths_data[j].USPt.toUpperCase();
			nameBEnd = paths_data[j].FgnPort.toUpperCase();
	//Loop through once for each path
	// console.log(nameBStart);

	for (i = 0; i < paths.features.length; i++) {

		nameAEnd = paths.features[i].properties.start.toUpperCase();
		nameAStart = paths.features[i].properties.end.toUpperCase();

			//If this is a match…
			if (nameAStart == nameBStart && nameAEnd == nameBEnd) {
				// console.log("yes");
				paths.features[i].properties.USPt			= paths_data[j].USPt;
				paths.features[i].properties.FgnPort		= paths_data[j].FgnPort;
				paths.features[i].properties.MetricTons		= parseFloat(paths_data[j].MetricTons);
				paths.features[i].properties.ImportMetTons	= parseFloat(paths_data[j].ImportMetTons);
				paths.features[i].properties.ExportMetTons	= parseFloat(paths_data[j].ExportMetTons);
			}

		}

	}


var eBars = false;
var backgroundFade = false;
var allTotal = false;
var oilTotal = false;
var productTotal = false;
var byPort = false;

var usPorts = false;
var usYearly = false;
var foreignPorts = false;
var foreignYearlyPorts = false;
$('#animation').click(function(){
	           //  d3.select('.section')
            // .text('D3 was here');
	// d3.select('#animation').text('CLOSE')
	$('.vim').toggle();
	// d3.select(".thumb").animate().css('margin-bottom','-30%');
	$('#closeVid').toggle();
	$('.fadeBottom').toggle();

})
$('#closeVid').click(function(){
	$('.vim').fadeOut("fast");
$('#closeVid').fadeOut("fast");
	$('.fadeBottom').fadeOut("fast");
})


$('#eBars').click(function(){
	eBars = !eBars;
	if (eBars){
		$('.pathAll, .pathExp, .pathImp, .pathFreq, .volAll, .volExp, .volImp, .volFreq').slideUp("fast", function(){
noVolume = false;
pathAll = false;
	});


		$('#eBars').animate().css('background-color','white')
		$('#eBars').animate().css('opacity','.7')

$('.toggleVolume, #animPaths, .volAll, .volExp, .volImp, .volFreq, .pathAll, .pathExp, .pathImp').animate().css('margin-top', '101px')
$('.toggleVolume, #animPaths, .volAll, .volExp, .volImp, .volFreq, .pathAll, .pathExp, .pathImp').animate().css('background-color', 'black')


		totalFadeBackground();
		// fadeStories(); //improve this
		$('#storyContainer').hide("fast", function(){
		})
		$('.map').hide("fast", function(){
		})
		//show the toggle to show all total graphs
		$('.allTotal, .productTotal, .byPort, .oilTotal').show("fast", function(){
		// allTotal=true;
		//move down
		$('.productTotal, .byPort').animate().css('margin-top', '26px')

		//volume is autoselected
		$('.allTotal').animate().css('background-color', 'white')
		//show the firstgraph
		$('.firstGraph').slideDown( "fast", function() {
			// allTotal = true;
		})
		})
	}
	else {
		$('#eBars').animate().css('background-color','black')
		// $('#eBars').animate().css('opacity','1')

		$('.map').show("fast", function(){
		})

		$('.toggleVolume, #animPaths, .volAll, .volExp, .volImp, .volFreq, .pathAll, .pathExp, .pathImp').animate().css('margin-top', '0px')

		$('.allTotal, .productTotal, .byPort, .oilTotal, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts, .firstGraph, .secondGraph, .thirdGraph, .fourthGraph, .fifthGraph, .sixthGraph, .seventhGraph').hide("fast", function(){
		})

		unfadeBackground();
		$('#storyContainer').show("fast", function(){
		})
		// unfadeStories(); 
		//hide all toggles and graphs
		$('.allTotal, .productTotal, .byPort, .oilTotal, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color','black')
	}

	$('.allTotal').click(function(){
		//if show all total graphs is clicked
		allTotal = !allTotal;
		console.log(allTotal+"allTotal value")
		if (allTotal){
			$('.allTotal').animate().css('background-color', 'white')
			$('.firstGraph').slideDown( "slow", function() {
			//show the firstgraph
			})
			$('.oilTotal, .productTotal, .byPort, .usPorts, .foreignYearlyPorts, .foreignPorts, .usYearlyPorts').animate().css('background-color', 'black')
allTotal = false;			
			$('.secondGraph, .thirdGraph, .fourthGraph, .fifthGraph, .sixthGraph, .seventhGraph').slideUp( "fast", function() {
			})
		}
		else{
			$('.allTotal').animate().css('background-color', 'black')
			$('.firstGraph').slideUp( "slow", function() {
			//hide the firstgraph
			})
		}
	})

		$('.oilTotal').click(function(){
			oilTotal = !oilTotal;
			console.log(oilTotal+"oilTotal value")
				if (oilTotal){
					$('.oilTotal').animate().css('background-color', 'white')
					$('.allTotal, .productTotal, .byPort, .usPorts, .foreignYearlyPorts, .foreignPorts, .usYearlyPorts').animate().css('background-color', 'black')
					// allTotal, productTotal, usPorts, foreignPorts, foreignYearlyPorts, usYearlyPorts = false;		
oilTotal = false;
					$('.firstGraph, .thirdGraph, .fourthGraph, .fifthGraph, .sixthGraph, seventhGraph').slideUp( "fast", function() {
					})
					$('.secondGraph').slideDown( "slow", function() {
					})
				}
				else {
					$('.oilTotal').animate().css('background-color', 'black')
					$('.secondGraph').slideUp( "fast", function() {
					//hide the oilgraph
					})
				}
			})

$('.productTotal').click(function(){
	productTotal = !productTotal;
	if (productTotal){
		//hide all associated stuff with all volume graph etc.
		$('.allTotal, .oilTotal, .byPort, .usPorts, .foreignYearlyPorts, .foreignPorts, .usYearlyPorts').animate().css('background-color', 'black')
		// oilTotal, allTotal, usPorts, foreignPorts, foreignYearlyPorts, usYearlyPorts = false;
productTotal = false;
		$('.firstGraph, .secondGraph, .fourthGraph, .fifthGraph, .sixthGraph, .seventhGraph').slideUp( "fast", function() {
		})
		//show all associated stuff with product graph etc.
		$('.thirdGraph').slideDown("slow", function(){
			//show product graph
		})
		$('.productTotal').animate().css('background-color','white')
	}
	else {
		$('.thirdGraph').slideUp("slow", function(){
			//show product graph
		})
		$('.productTotal').animate().css('background-color','black')		
	}
})

	$('.byPort').click(function(){
		//if show all total graphs is clicked
		byPort = !byPort;

		if (byPort){
			$('.toggleVolume, #animPaths, .volAll, .volExp, .volImp, .volFreq, .pathAll, .pathExp, .pathImp').animate().css('margin-top', '201px')

			$('.usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').show("fast", function(){
					//show all the port option tabs
				})
			// oilTotal, allTotal, productTotal, foreignPorts, foreignYearlyPorts, usYearlyPorts = false;
byPort = false;
			$('.byPort').animate().css('opacity', '.7')
			$('.byPort, .usPorts').animate().css('background-color', 'white')
			$('.allTotal, .oilTotal, .productTotal, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color', 'black')

			$('.fourthGraph').slideDown( "slow", function() {
				usPorts = false;
				$('.firstGraph, .secondGraph, .thirdGraph, .fifthGraph, .sixthGraph, .seventhGraph').slideUp( "fast", function() {
				})
			})
		}
		else{
			$('.toggleVolume, #animPaths, .volAll, .volExp, .volImp, .volFreq, .pathAll, .pathExp, .pathImp').animate().css('margin-top', '101px')

			$('.byPort').animate().css('opacity', '1')
			$('.usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').hide("fast", function(){
				})
			$('.byPort, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color', 'black')
			$('.fourthGraph, .fifthGraph, .sixthGraph, .seventhGraph').slideUp( "slow", function() {
			//hide the firstgraph
			})
		}
	})
		$('.usPorts').click(function(){
			usPorts = !usPorts;
				if (usPorts){
					$('.usPorts').animate().css('background-color', 'white')
			$('.allTotal, .oilTotal, .productTotal, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color', 'black')
					$('.firstGraph, .secondGraph, .thirdGraph, .fifthGraph, .sixthGraph, .seventhGraph').slideUp( "fast", function() {
					})
					$('.fourthGraph').slideDown( "slow", function() {
					})
usPorts = false;
					// oilTotal, allTotal, productTotal, foreignPorts, foreignYearlyPorts, usYearlyPorts = false;
				}
				else {
					$('.usPorts').animate().css('background-color', 'black')
					$('.fourthGraph').slideUp( "fast", function() {
					})
				}
			})
		$('.usYearlyPorts').click(function(){
			usYearly = !usYearly;
				if (usYearly){
					$('.usYearlyPorts').animate().css('background-color', 'white')
					$('.allTotal, .oilTotal, .productTotal, .usPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color', 'black')
					$('.firstGraph, .secondGraph, .thirdGraph, .fourthGraph, .sixthGraph, .seventhGraph').slideUp( "fast", function() {
					})
					$('.fifthGraph').slideDown( "slow", function() {
					})
usYearly = false;
					// oilTotal, allTotal, productTotal, foreignPorts, usPorts, foreignYearlyPorts = false;
				}
				else {
					$('.usYearlyPorts').animate().css('background-color', 'black')
					$('.fifthGraph').slideUp( "fast", function() {
					//hide the us yearly ports graph
					})
				}
			})
		$('.foreignPorts').click(function(){
			foreignPorts = !foreignPorts;
				if (foreignPorts){
					$('.foreignPorts').animate().css('background-color', 'white')
					$('.allTotal, .oilTotal, .productTotal, .usPorts, .usYearlyPorts, .foreignYearlyPorts').animate().css('background-color', 'black')
					$('.firstGraph, .secondGraph, .thirdGraph, .fourthGraph, .fifthGraph, .seventhGraph').slideUp( "fast", function() {			
					})
					$('.sixthGraph').slideDown( "slow", function() {
					})
foreignPorts = false;
					// oilTotal, allTotal, productTotal, foreignYearlyPorts, usPorts, usYearlyPorts = false;
				}
				else {
					$('.foreignPorts').animate().css('background-color', 'black')
					$('.sixthGraph').slideUp( "fast", function() {
					})
				}
			})
		$('.foreignYearlyPorts').click(function(){
			foreignYearlyPorts = !foreignYearlyPorts;
				if (foreignYearlyPorts){
					$('.foreignYearlyPorts').animate().css('background-color', 'white')
			$('.allTotal, .oilTotal, .productTotal, .usPorts, .usYearlyPorts, .foreignPorts').animate().css('background-color', 'black')
					$('.firstGraph, .secondGraph, .thirdGraph, .sixthGraph, .fourthGraph, .fifthGraph').slideUp( "fast", function() {
					})
					$('.seventhGraph').slideDown( "slow", function() {
					})
foreignYearlyPorts = false; 
					// oilTotal, allTotal, productTotal, foreignPorts, usPorts, usYearlyPorts = false;
				}
				else {
					$('.foreignYearlyPorts').animate().css('background-color', 'black')
					$('.seventhGraph').slideUp( "fast", function() {
					})
				}
			})
});






var noVolume = false;
var doPaths = false;
var animatePaths = false;
var sizeAll = false;
var sizeExp = false;
var sizeImp = false;
$('.toggleVolume').click(function(){
	noVolume = !noVolume;
	   		$('.pathAll, .pathExp, .pathImp, .pathFreq').animate().css('background-color', 'black')

	if (noVolume){
			$('#legendPorts').fadeIn("fast");
eBars = false;
		$('#eBars').animate().css('background-color','black')
		$('#eBars').animate().css('opacity','1')

		$('.map').show("fast", function(){
		})

		$('.toggleVolume, #animPaths, .volAll, .volExp, .volImp, .volFreq').animate().css('margin-top', '0px')

		$('.allTotal, .productTotal, .byPort, .oilTotal, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts, .firstGraph, .secondGraph, .thirdGraph, .fourthGraph, .fifthGraph, .sixthGraph, .seventhGraph').hide("fast", function(){
		})

		unfadeBackground();
		$('#storyContainer').show("fast", function(){
		})
		// unfadeStories(); 
		//hide all toggles and graphs
		$('.allTotal, .productTotal, .byPort, .oilTotal, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color','black')

		$('.toggleVolume').animate().css('background-color', 'white')
		showPorts();
		hidePaths();
	    $('#animPaths, .pathAll, .pathExp, .pathImp, .pathFreq').animate().css('margin-top', '117px')
	}
	if (noVolume && pathAll){
		showPaths();
		$('#legendPorts').fadeIn("fast");
	}
	else if (!noVolume){
		$('.toggleVolume').animate().css('background-color', 'black')
		$('.volImp, .volExp, .volFreq, .volAll').animate().css('background-color', 'black')
		showPaths();
		normalizeAllVolumes();
	    $('#animPaths, .pathAll, .pathExp, .pathImp, .pathFreq').animate().css('margin-top', '0px')

	    	$('#legendPorts').fadeOut("fast");
	}



	$('.volAll, .volExp, .volImp, .volFreq').slideToggle("fast", function(){
	});
})

$('.volAll').click(function(){
		sizeAllVolumes();
	    $(this).animate().css('background-color', 'white')
			$('.volImp, .volExp, .volFreq').animate().css('background-color', 'black')
})
$('.volExp').click(function(){
		sizeExpVolumes();
		$(this).animate().css('background-color', 'white')
			$('.volAll, .volImp, .volFreq').animate().css('background-color', 'black')
})
$('.volImp').click(function(){
		sizeImpVolumes();
		$(this).animate().css('background-color', 'white')
			$('.volAll, .volExp, .volFreq').animate().css('background-color', 'black')
})
$('.volFreq').click(function(){
		sizeFreqVolumes();
		$(this).animate().css('background-color', 'white')
			$('.volAll, .volExp, .volImp').animate().css('background-color', 'black')
})




var pathAll = false;

$('#animPaths').click(function(){
	pathAll = !pathAll;
	if (pathAll){

console.log("pathall")
eBars = false;
		$('#eBars').animate().css('background-color','black'); $('#eBars').animate().css('opacity','1'); $('.map').show("fast", function(){})
		$('.allTotal, .productTotal, .byPort, .oilTotal, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts, .firstGraph, .secondGraph, .thirdGraph, .fourthGraph, .fifthGraph, .sixthGraph, .seventhGraph').hide("fast", function(){
		})
		unfadeBackground();
		$('#storyContainer').show("fast", function(){
		})
		// unfadeStories(); 
		//hide all toggles and graphs
		$('.allTotal, .productTotal, .byPort, .oilTotal, .usPorts, .usYearlyPorts, .foreignPorts, .foreignYearlyPorts').animate().css('background-color','black')



			$('.volAll, .volImp, .volExp, .volFreq').animate().css('background-color', 'black');



		$('.toggleVolume, .volAll, .volExp, .volImp, .volFreq, .pathAll, .pathExp, .pathImp').animate().css('margin-top', '0px')
		$('#animPaths').animate().css('margin-top', '0px')

		$('#animPaths').animate().css('background-color', 'white')
		console.log("showing paths dropdown is true")
		// $('.pathAll, .pathExp, .pathImp, .pathFreq').animate().css('margin-top', '117px')
		
		$('.pathAll, .pathExp, .pathImp, .pathFreq').slideDown("fast", function(){
		});
 		// unOpAllVolumes();	
		portGroups.selectAll("circle")
			.attr("class", "newclass")
			.transition()
			.duration(500)
			// .attr("fill", "grey")
			// .attr("r", radiusSmall)
			.attr("opacity", ".2");
	}
	if (pathAll && noVolume){
					$('.volAll, .volImp, .volExp, .volFreq').animate().css('background-color', 'black')

		$('#animPaths').animate().css('background-color', 'white')
		console.log("portsvolume is true")
 		showPaths();
 		unOpAllVolumes();	
 		$('#animPaths, .pathAll, .pathExp, .pathImp, .pathFreq').animate().css('margin-top', '117px')	
		$('.pathAll, .pathExp, .pathImp, .pathFreq').slideDown("fast", function(){
		});
	}

	else if (!pathAll){
		console.log("ports volumes is false.")
							$('.volAll, .volImp, .volExp, .volFreq').animate().css('background-color', 'black')
		$('#animPaths').animate().css('background-color', 'black')
	    $('.pathAll, .pathExp, .pathImp, .pathFreq').animate().css('background-color', 'black')
 		normalizeAllVolumes(); 
		showPaths();
		$('.pathAll, .pathExp, .pathImp, .pathFreq').slideUp("fast", function(){
	});
	}

})
$('.pathAll').click(function(){
		pathAllVolumes();
	    $(this).animate().css('background-color', 'white')
			$('.pathImp, .pathExp, .pathFreq').animate().css('background-color', 'black')
})
$('.pathExp').click(function(){
		pathExpVolumes();
		console.log("clicked exports paths")
		$(this).animate().css('background-color', 'white')
			$('.pathAll, .pathImp, .pathFreq').animate().css('background-color', 'black')
})
$('.pathImp').click(function(){
		pathImpVolumes();
		$(this).animate().css('background-color', 'white')
	   		$('.pathAll, .pathExp, .pathFreq').animate().css('background-color', 'black')
})
$('.pathFreq').click(function(){
		pathFreqVolumes();
		$(this).animate().css('background-color', 'white')
	   		$('.pathAll, .pathExp, .pathImp').animate().css('background-color', 'black')
})



	//START DRAWING
//show story container
		$('#storyContainer').show("fast", function(){
		})
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
	 // pathGroups = map.append("g")
		.attr("class", "paths")
		.selectAll("g")
		.data(paths.features)
		.enter()
		.append("g")
		.on("mouseover", function(d) {
			console.log(d.properties+"d.properties of pathgroups");
			if (animateOpening==false){
			updateHoverbox(d.properties, "path");
			d3.select(this).each(moveToFront);
		}
		})
		.on("mouseout", function(d) {
			hideHoverbox();
		});  

	//Create background paths (for hover purposes)
	pathGroups.append("path")
		.attr("class", "background")
		.attr("d", path)
		.attr("stroke-dasharray", "none");  //Initially, line is not visible

	//Create visible paths
	pathGroups.append("path")
		.attr("class", "visible")
		.attr("d", path)
		.attr("opacity",0)
		.attr("stroke", "#307074")
		.attr("stroke-dasharray", "none");

	if (readyForPaths) {

		pathGroups.selectAll("path")
			.transition()
			// .delay(introDelay4)
			.duration(500)
		.attr("opacity",1)

	} else {

		d3.selectAll(".land")
			.attr("opacity",1);
			// .attr("stroke-dasharray", "none");

	}












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
				return true;
		})
		.attr("fill", "gray")
		.attr("stroke", "white")

		.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];
			return "translate(" + x + "," + y + ")";
		});
var maxAll = d3.max(ports.features, function(d){
	return d.properties.MetricTons;
})
var maxExp = d3.max(ports.features, function(d){
	return d.properties.ExportMetTons;
})
var maxImp = d3.max(ports.features, function(d){
	return d.properties.ImportMetTons;
})
var maxFreq = d3.max(ports.features, function(d){
	return d.properties.freq;
})
// console.log("maxexpvolume"+maxExp)
console.log("maxallports"+maxAll)
// console.log("maxImpvolume"+maxImp)


	// Clickable ports get the click handler
	// d3.selectAll('.port.clickable')
	d3.selectAll('.port')
		.on('click', click)
		.on("mouseover", function(d) {
			if (animateOpening==false){
			console.log(d.properties+"thisisnormalmouseoveronport")
			updateHoverbox(d.properties, "port");
			d3.select(this).each(moveToFront);
		}
		})
		.on("mouseout", function(d) {
			hideHoverbox();
			// d3.selectAll('.label')
			// .remove();
		});
	// In each group, add a circle
	if (readyForPorts) {

		portGroups.append("circle")
			.attr("class", "point")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0.01)
			.transition()
			.duration(500)
			// .delay(function(d, i) {
			// 	return introDelay2 + i * 3;
			// })
			.attr("r", radiusSmall)
			.attr("opacity", portOnOpacity);

	} else {
		portGroups.append("circle")
			.attr("class", "point")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0)
			.attr("opacity", 0);
	
	}






function sizeAllVolumes(){
console.log("in all")


var portAllCircle = d3.scale.linear()
		.domain([0, maxAll]) //493829169.9 is max
		.range([radiusSmall, radiusLarge]);
		portGroups.selectAll("circle")
		.attr("class", "circleAll")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				// console.log(d.properties.MetricTons)
				if (d.properties.MetricTons>0){
				return portAllCircle(d.properties.MetricTons);	
			}
			});	
}

function sizeExpVolumes(){
	var portExpCircle = d3.scale.linear()
		.domain([0, maxExp]) //493829169.9 is max
		.range([radiusSmall, radiusLarge]);
		console.log("in export")
		portGroups.selectAll("circle")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				if (d.properties.ExportMetTons>0){
				return portExpCircle(d.properties.ExportMetTons);
			}
			});	
}

function sizeFreqVolumes(){
var portFreqCircle = d3.scale.linear()
		.domain([0, maxFreq]) //493829169.9 is max
		.range([radiusSmall, radiusLarge]);

		portGroups.selectAll("circle")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				return portFreqCircle(d.properties.freq);
			})
}

function sizeImpVolumes(){
console.log("in import")

var portImpCircle = d3.scale.linear()
		.domain([0, maxImp]) //493829169.9 is max
		.range([radiusSmall, radiusLarge]);

		portGroups.selectAll("circle")
			.transition()
			.duration(1000)
			.attr("r", function(d) {
				if (d.properties.ImportMetTons>0){
				return portImpCircle(d.properties.ImportMetTons);
			}
			});	
}

function unOpAllVolumes(){
		console.log("low opacity, resize circles")

		portGroups.selectAll("circle")
			.transition()
			.duration(500)
			.attr("r", radiusSmall)
			.attr("opacity", ".2");
}

function normalizeAllVolumes(){
		console.log("normalize circles")

		portGroups.selectAll("circle")
			.transition()
			.duration(500)
			.attr("r", radiusSmall)
			.attr("opacity", portOnOpacity);
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
	console.log("in export paths")

var lightExpMap = d3.scale.linear()
		.domain([0, maxExp/10]) //493829169.9 is max
		.range([5, 50]);

		pathGroups.selectAll("path")
			.transition()
			.duration(1000)
		.attr("stroke", function(d){
			return "hsl(180,100,"+lightExpMap(d.properties.ExportMetTons)+")"
			});
}
function pathFreqVolumes(){
// var lightFreqMap = d3.scale.linear()
// 		.domain([0, maxFreq]) //493829169.9 is max
// 		.range([5, 50]);

// pathGroups.exit();
// pathGroups.selectAll("path")
// .data(ports.features)
// .enter()
// .append("path")

  // pathGroups.exit().remove();



		// pathGroups.selectAll("path")
	//Shipping Paths
// 			.transition()
// 			.duration(1000)
// 		.attr("stroke", function(d){
// console.log(d.properties.freq+"d.properties.freq");
// 			return "hsl(180,100,"+lightFreqMap(d.properties.freq)+")"
// 			});
}
function pathImpVolumes(){
	console.log("in path imports")

var lightImpMap = d3.scale.linear()
		.domain([0, maxImp/10]) //493829169.9 is max
		.range([5, 50]);
// console.log(maxImp);
		pathGroups.selectAll("path")
			.transition()
			.duration(1000)
			.attr("stroke", function(d){
// console.log(d.properties.ImportMetTons)
// return "white";
			return "hsl(180,100,"+lightImpMap(d.properties.ImportMetTons)+")"
			})
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
			// .attrTween("stroke-dasharray", function() {
			// 	var l = this.getTotalLength();
			// 	var i = d3.interpolateString("0," + l, l + "," + l);
			// 	return function(t) {
			// 		return i(t);
			// 	};
			// });
}

	//Clip path and energy bars
	var mapHeight = d3.select(".map").node().getBBox().height;

	var mapWidth = d3.select(".map").node().getBBox().width;
	var barsLeftEdge = (width - mapWidth) / 2;


var otherBarsScale = d3.scale.linear()
.domain([0,maxMet])
.range([mapHeight-40,0]); //if bars are going vertical

var widthScale = d3.scale.linear()
	.domain([0, maxMet])
	.range([barsLeftEdge, mapWidth]);

var heightScale = d3.scale.linear()
	.domain([0, 900])
	.range([0, mapHeight]); //if bars are going horizontal

ports.features.sort(function(a,b){
	return b.properties.MetricTons - a.properties.MetricTons;
})
svg.append("g")
	.attr("id","otherBars")



  // $('#eBars').tipsy({ 
  //       gravity: 'w', 
  //       html: true, 
  //       delayIn: 500, 
  //       title: function() {
  // //         var d = this.__data__;
		// // var newNum = Math.round((d.properties.MetricTons) / 1000000);
		// // var niceNum = numberWithCommas(newNum)+"MT";
  //     	// return "Total Volume Shipped Since 2002: "+niceNum;         
  //     	return "Click to view detailed charts for the major ports over time.";         
  //       }
  //     });
  // $('#volPorts').tipsy({ 
  //       gravity: 'w', 
  //       html: true, 
  //        delayIn: 500, 
  //       title: function() {      
  //     	return "Click to view volume shipped projected on each port.";         
  //       }
  //     });
  //   $('#animPaths').tipsy({ 
  //       gravity: 'w', 
  //       html: true, 
  //        delayIn: 500, 
  //       title: function() {      
  //     	return "Click to view volume shipping projected on each path.";         
  //       }
  //     });
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
		.attr("transform", "translate(4,4)");

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
			// .transition()
			// .delay(introDelay1)
			// .duration(1500)
			.style("opacity", 1.0);
		d3.select(".introNav")
			.style("display","block")
			.style("opacity",1.0);
		$('#skip').fadeIn("slow");




	$('.introNav').on("click", function(){
		i++;
		if (i==201){
					d3.select("#intro1").transition().style("opacity", 0.0).style("display", "none");
					d3.select("#intro2").style("display", "block").transition().duration(1000).style("opacity", 1.0);
			portGroups.append("circle")
			.attr("class", "point")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0.01)
			.transition()
			.duration(5000)
			.attr("r", radiusSmall)
			.attr("opacity", portOnOpacity);
		}
		console.log(i+"intronav clicking")
		if (i==202){
					d3.select("#intro2").transition().style("opacity", 0.0).style("display", "none");
					d3.select("#intro3").style("display", "block").transition().duration(1000).style("opacity", 1.0);
			readyForPorts = true;
			readyForPaths = true;

		pathGroups.selectAll("path")
			.transition()
			.duration(5000)
			.attr("opacity",1)

		}
		if (i==203){
					d3.select("#intro3").transition().duration(1000).style("opacity", 0.0).style("display", "none"); 
					d3.select("#intro4").style("display", "block").transition().duration(1000).style("background-color","rgba(0,0,0,1)").style("opacity", 1.0);

				$('.fadeBottom').fadeOut("fast");
				$('.fadeLeft').hide();
			// })
			d3.select("#storyContainer")
			.transition();

				d3.select(this)
					.select(".thumb")
					.classed("selected", true);
				openStories();
				$('.introNav').fadeOut("fast");
			}
		// if (i==204){
		// 			d3.select("#intro4").style("display", "block").transition().style("opacity", 1.0);
		// }
		// if (i==205){
		// 			d3.select("").style("display", "block").transition().style("opacity", 1.0);
		// }
	})
		// d3.select(".intro .button") 
		d3.select("#intro4") 
			.on("click", function() {

				d3.select(this)
					.transition()
					.duration(1500)
					.style("opacity", 0.0)
					.each("end", function() {
						d3.select(this).style("display", "none");
					});
				$('#skip').fadeOut("fast");

				closeStories();
				animateOpening = false;
				$('.fadeBottom').fadeOut("fast");
				$('.fadeLeft').hide();

			});
			// .style("display", "block")
			// .transition()
			// .delay(introDelay7+5000)
			// .duration(1500)
			// .style("opacity", 1.0);

		d3.select("#skip") 
			.on("click", function() {
				$('.introNav').fadeOut("fast");

				$('#intro1, #intro2, #intro3, #intro4, #skip').fadeOut("fast");


				// d3.select("#intro1, #intro2, #intro3, #intro4, #skip")
				// 	.transition()
				// 	.duration(200)
				// 	.style("opacity", 0.0)
				// 	.style("display", "none");

				closeStories();
				animateOpening = false;
			readyForPorts = true;
			readyForPaths = true;

		pathGroups.selectAll("path")
			.transition()
			.duration(5000)
			.attr("opacity",1)
		
		portGroups.append("circle")
			.attr("class", "point")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 0.01)
			.transition()
			.duration(5000)
			.attr("r", radiusSmall)
			.attr("opacity", portOnOpacity);

				$('.fadeBottom').fadeOut("fast");
				$('.fadeLeft').hide();

			});
















		// d3.select("#intro2").transition().style("opacity", 1.0);
		// d3.select("#intro3").transition().style("opacity", 1.0);
		// d3.select("#intro4").transition().style("opacity", 1.0);



		// d3.select("#intro1")
		// 	.style("display", "block")
		// 	.transition()
		// 	.delay(introDelay1)
		// 	.duration(1500)
		// 	.style("opacity", 1.0)
		// 	.each("end", function() {
		// 		d3.select(this)
		// 			.transition()
		// 			.delay(12000)
		// 			.duration(1500)
		// 			.style("opacity", 0.0)
		// 			.each("end", function() {
		// 				d3.select(this).style("display", "none");
		// 			});
		// 	});

		// d3.select("#intro2")
		// 	.style("display", "block")
		// 	.transition()
		// 	.delay(introDelay3)
		// 	.duration(1500)
		// 	.style("opacity", 1.0)
		// 	.each("end", function() {
		// 		d3.select(this)
		// 			.transition()
		// 			.delay(9000)
		// 			.duration(1500)
		// 			.style("opacity", 0.0)
		// 			.each("end", function() {
		// 				d3.select(this).style("display", "none");
		// 			});
		// 	});

		// d3.select("#intro3")
		// 	.style("display", "block")
		// 	.transition()
		// 	.delay(introDelay5+3000)
		// 	.duration(1500)
		// 	.style("opacity", 1.0)
		// 	.each("end", function() {
		// 		d3.select(this)
		// 			.transition()
		// 			.delay(6000)
		// 			.duration(1500)
		// 			.style("opacity", 0.0)
		// 			.each("end", function() {
		// 				d3.select(this).style("display", "none");
		// 			});
		// 					// $('.fadeBottom').fadeOut("slow");
		// 	});


		// d3.select("#storyContainer")
		// 	.transition()
		// 	.delay(introDelay6+5000)
		// 	.each("start", function() {
		// 		$('.fadeBottom').fadeOut("fast");

		// 		d3.select(this)
		// 			.select(".thumb")
		// 			.classed("selected", true);
		// 		openStories();
		// 	});



// 		d3.select("#intro4")
// 			.on("click", function() {

// 				d3.select(this)
// 					.transition()
// 					.duration(1500)
// 					.style("opacity", 0.0)
// 					.each("end", function() {
// 						d3.select(this).style("display", "none");
// 					});

// 				closeStories();
// animateOpening = false;
// 				$('.fadeBottom').fadeOut("fast");

// 				$('.fadeLeft').hide();
// 	// d3.selectAll("path.selected").classed("selected", false);
// 	// d3.selectAll(".port.selected").classed("selected", false);
// 	// hideHoverbox();
// 				//Slow reveal of port names
// 				portGroups.selectAll("text.label")
// 					.transition()
// 					.delay(2000)
// 					.duration(2000)
// 					.attr("opacity", 1.0);

// 			})
// 			.style("display", "block")
// 			.transition()
// 			.delay(introDelay7+5000)
// 			.duration(1500)
// 			.style("opacity", 1.0);

	} 







}
//End ready()


function click(d) {
			showReset = true;
	if (showReset==true){
	$('#reset').slideDown( "slow", function() {
})
}

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
		// newTranslate[0] = translate[0] - coords[0] + width / 2;

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

	console.log(d+"updateHoverbox with d");
	console.log(type+"updatehoverbox with type");
	console.log(d.USPt+"d.USPt INSIDE general HOVERBOX");

	//Special handling for ports
	if (type == "port") {

		var xy = proj([d.lon, d.lat]);






	var mapWidth = d3.select(".map").node().getBBox().width;
	// console.log(mapWidth+"mapWidth")
		if (xy[0]>mapWidth/2){
			// console.log("mapWidth"+mapWidth+"xy[0]"+xy[0])
			hoverbox.attr("transform", "translate(" + (xy[0]-hoverboxMinWidth) + "," + xy[1] + ")");
		}
		else {
			hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");			
		}





		// hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");

		hoverbox.select(".title").text("Port: "+d.port);

		var hoverBoxScaleMax = hoverBoxPortScaleMax;
	
	}
	//Special handling for paths
	else {
		// console.log(d3.mouse(svg.node())+"svgnode");
		// console.log(xy[0]+"xy");
		// console.log()
		var xy = d3.mouse(svg.node());

			var mapWidth = d3.select(".map").node().getBBox().width;
	// console.log(mapWidth+"mapWidth")
		if (xy[0]>mapWidth/2){
			// console.log("mapWidth"+mapWidth+"xy[0]"+xy[0])
			hoverbox.attr("transform", "translate(" + (xy[0]-hoverboxMinWidth) + "," + xy[1] + ")");
		}
		else {
			hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");			
		}


		// hoverbox.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")");
			console.log(d.USPt+"d.USPt INSIDE else HOVERBOX");

		hoverbox.select(".title").text("Route: "+d.USPt + " ↔ " + d.FgnPort);

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
			totalText += makeNormal(d.MetricTons)+" Million Metric Tons";
		}
		if (d.MetricTons<1000){
			totalText+= d.MetricTons+" Metric Tons"
		}
		else if (d.MetricTons>1000&&d.MetricTons<1000000) {
			totalText += makeNormal(d.MetricTons)+" Thousand Metric Tons";			
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
d3.select("#closeStories")
	.on("click", function() {
		closeStories();
unfadeBackground();
		// $()
	});


d3.selectAll("#thumb1, #thumb2, #thumb3, #thumb4, #thumb5, #thumb6")
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
			// console.log(port+"thisistheport")

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
				// .attr("stroke-width",20)
				.each(function(d){
					if (d.properties.port.toUpperCase()==port){
					updateHoverbox(d.properties, "port");
					d3.select(this).each(moveToFront);
					}
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






				.each(function(d){
					if (d.properties.USPt.toUpperCase() == start &&
						d.properties.FgnPort.toUpperCase() == end){ 
              	d3.select(this).each(moveToFront);
                d3.select(this).select("path")
                        .transition()
                        .duration(500)
                        .style("stroke","#ff2000");
                    }
				})








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
					updateHoverbox(d.properties, "port");
					// console.log(d.properties+"thisisd.propertiesinsidehighlighting")
					d3.select(this).each(moveToFront);
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
	hideHoverbox();

			d3.selectAll("circle")
			.transition()
			.duration(500)
			.attr("r", radiusSmall)
			.style("fill","gray")
			.attr("stroke", "none");

});





d3.selectAll("#thumb1, #thumb2, #thumb3, #thumb4, #thumb5, #thumb6")
// d3.selectAll(".thumb")
	.on("click", function(d, i) {
fadeBackground();
		// stopVideos();

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

		//Update thumbs' selected status
		d3.selectAll(".thumb.selected").classed("selected", false);
		d3.select(abdsdasdasdasd).classed("selected", true);

	});



var closeStories = function() {
	// $('#storyFrame').hide( "fast", function() {
	// });
	//Close stories
	d3.select("#storyContainer")
		.transition()
		.duration(2000)
		.style("height", "90px");

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
	// $('#storyFrame').show( "fast", function() {
	// });
	//Open stories


	d3.select("#storyContainer")
		.transition()
		.duration(2000)
		.style("height", "679px");

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

	// tuckMapUp();

	storiesOpen = true;

};

function fadeBackground(){
	map.attr("opacity", .2)
}

function unfadeBackground(){
	map.attr("opacity", 1)
}
function totalFadeBackground(){
	map.attr("opacity", 0)
}
function fadeStories(){
	$('.thumb').animate().css('opacity', 0)
}

function unfadeStories(){
	$('.thumb').animate().css('opacity', 1)
}


var resetMap = function() {
	//Reset map
	// console.log(t+"reset map")

	showReset = false;

// console.log(s+"s less than orig");

	// Reproject everything in the map
	map.selectAll("path")
		 .attr("d", path);

	portGroups.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];
		return "translate(" + x + "," + y + ")";
	 });

};

var tuckMapUp = function(d) {
showReset=true;
if (showReset==true){
	$('#reset').slideDown( "slow", function() {
})
}
if (showReset==false){
	$('#reset').slideUp( "slow", function() {
})	
}
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
		newTranslate[1] = translate[1] - coords[1] + (height/2) / 2;

		zoom.translate(newTranslate).scale(initialZoom);
		proj.translate(newTranslate).scale(initialZoom);

	} else {
		console.log("inside else not d")

		zoom.translate([width / 2, height / 2]).scale(initialZoom); //not height/3
		proj.translate([width / 2, height / 2]).scale(initialZoom);

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
	console.log("resetzoom")

	showReset = false;
	zoom.translate([width / 2, height / 2]).scale(initialZoom);
	proj.translate([width / 2, height / 2]).scale(initialZoom);

	// Reproject everything in the map
	map.selectAll("path")
		 .attr("d", path);

	portGroups.attr("transform", function(d) {
		var x = proj([d.properties.lon,d.properties.lat])[0];
		var y = proj([d.properties.lon,d.properties.lat])[1];
		return "translate(" + x + "," + y + ")";
	 });
	$('#reset').slideUp( "slow", function() {
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

	// document.getElementById("vid1").pause()

};

d3.selectAll("#nextImage, #prevImage")
	.on("click", function() {
		// stopVideos();
	});


