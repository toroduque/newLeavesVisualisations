// "Extracted from the UNHCR Population Statistics Reference Database","United Nations High Commissioner for Refugees"
// "Date extracted: 2017-08-19 16:35:40 +02:00"
// "http://popstats.unhcr.org/en/persons_of_concern"

//DATA WRANGLE AND CLEANING
let dataLabels        = []
let dataValues        = []
let dataPerOrigin     = d3.map()
let csvData           = "data.csv"

let dataWrangle = loadData => {
  return new Promise( (resolve, reject) => {

    d3.csv(loadData, function(data) {

      let cleanData = data.reduce( (dataPerYear, property) => {
        dataPerYear[ property["Year"] ] = dataPerYear[property["Year"]] || []
        dataPerYear[ property["Year"] ].push({
          refugees: property["Refugees"],
          country: property["Origin"]
        })
        return dataPerYear
      }, {})

      //Refugees per origin 2016
      cleanData["2016"].map( countryData => {
        dataPerOrigin.set(countryData["country"], countryData["refugees"] == "*" || !countryData["refugees"] ? 0 : Number(countryData["refugees"]))
      })

      console.log(dataPerOrigin)

      //Total refugees per year
      for(var key in cleanData) {
        let totalYear = 0
        cleanData[key].map( each => {
           if( isNaN ( Number( each["refugees"] ) ) ) {
              totalYear += 0
             } else {
              totalYear += Number( each["refugees"] )
             }
          })

        // Push data to arrays
        resolve(
          dataLabels.push(key),
          dataValues.push(totalYear)
          )
        }
      })//Ends rawData with D3
    })
}

dataWrangle(csvData).then( () => {
  let dataLastTenYearsLabels = dataLabels.slice(dataLabels.length - 10, dataLabels.length)
  let dataLastTenYearsValues = dataValues.slice(dataLabels.length - 10, dataLabels.length)

  // CHART JS VISUALISATION - BAR CHART
  let context = document.getElementById("totalRefugees").getContext('2d');
  let totalRefugees = new Chart(context, {
      type: 'bar',
      data: {
          labels: dataLastTenYearsLabels,
          datasets: [{
              label : 'Number of Refugees from 2007 to 2016',
              data  : dataLastTenYearsValues,
              backgroundColor : 'rgba(82,205,14, 0.5)',
              borderColor : 'rgba(82,205,14,1)',
              borderWidth : 1
          }]
      },
      options: {
          scales: {
              xAxes: [{ gridLines : { display : false } }],
              yAxes: [{ gridLines : { display : false },
                        ticks     : { beginAtZero:true } }]
          }
      }
  });
})


//D3 VISUALISATION - CLOROPETH MAP
//Load in GeoJSON data
d3.json("countries.geo.json", (error, worldMap) => {
		//Array for map visualisation
		worldMap.features.map(country => {
})

//size of the svg
let w = 1300;
let h = 600;

let getColorScheme = d => {
    return d > 6000  ? '#DD164A' :
           d > 4000  ? '#DD1B55' :
           d > 2000  ? '#F16546' :
           d > 1000  ? '#E97B42' :
           d > 500   ? '#F87C3F' :
           d > 200   ? '#FF9F5A' :
           d > 100   ? '#FEB24C' :
           d > 50    ? '#FFC981' :
           d > 20    ? '#FDEDB3' :
           d > 0     ? '#FBF6E4' :
                       '#FFFFFF';
}

//Create SVG element
let svg = d3.select("#map")
			.append("svg")
			.attr("width", w)
			.attr("height", h);

//Define projection type
let projection = d3.geoMercator()
    .scale(w/7)
    .translate([w/2, h/2]);

//Define path generator with projection
let path = d3.geoPath().projection(projection)

//Bind data and create one path per GeoJSON feature
svg.append("g")
           .selectAll("path")
           .data(worldMap.features)
           .enter()
           .append("path")
           .attr("fill", d => getColorScheme( dataPerOrigin.get(d.properties.name) ) )
           .attr("d", path)
           .style("stroke","#d3d3d3")
           .append("title")
           .text( d =>  `${d.properties.name} : ${dataPerOrigin.get(d.properties.name)} Refugees` )


			function mouseover(d){
			// Highlight hovered province
			   let mouseover = d3.select(this).style("fill", "#98EBE9").style("cursor","pointer");
			}

			function mouseout(d){
	    // Reset province color
	  	let mouseout = svg.selectAll('path').style("fill","#d9d9d9");
			}
});
