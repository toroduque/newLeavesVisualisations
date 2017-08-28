//Load in GeoJSON data
d3.json("../data/countries.geo.json", (error, worldMap) => {

		//Array for map visualisation
		worldMap.features.map(country => {

		});

// ---- *** Clickable Map Visualisation Starts Here *** ----

			//size of the svg
			let w = 1300;
			let h = 600;

			//Create SVG element
			let svg = d3.select("#map")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Define projection type
			var projection = d3.geoMercator()
			    .scale(w/7.3)
			    .translate([w/1.7, h/2.4]);

			//Define path generator with projection
			let path = d3.geoPath().projection(projection);
			let countryInfo = d3.select("#countryName").append('text');
			let bars = d3.select('#barchart').append('svg').attr("width",700).attr("height",500);

		//Bind data and create one path per GeoJSON feature
		  svg.selectAll("path")
	               .data(worldMap.features)
	               .enter()
	               .append("path")
	               .attr("d", path)
								 .style("fill","#d9d9d9")
								 .style("stroke","#fff")
								 .on('mouseover', mouseover)
	      	 			 .on('mouseout', mouseout)
								 .on('click',legendBox);

			function mouseover(d){
			// Highlight hovered province
			let mouseover = d3.select(this).style('fill', '#98EBE9').style('cursor','pointer');
			}

			function mouseout(d){
	    // Reset province color
	  	let mouseout = svg.selectAll('path').style("fill","#d9d9d9");
			}
});
