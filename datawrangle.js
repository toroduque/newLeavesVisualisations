// "Extracted from the UNHCR Population Statistics Reference Database","United Nations High Commissioner for Refugees"
// "Date extracted: 2017-08-19 16:35:40 +02:00"
// "http://popstats.unhcr.org/en/persons_of_concern"

//DATA WRANGLE AND CLEANING
let dataLabels = []
let dataValues = []

d3.csv("data.csv", function(data) {
  let cleanData = data.reduce((newObject, property) => {
    newObject[property["Year"]] = newObject[property["Year"]] || []
    newObject[property["Year"]].push({
      refugees: property["Refugees"]
    })
    return newObject
  }, {})

for(var key in cleanData) {
  let totalYear = 0;
  cleanData[key].map( each => {
     if(isNaN(Number(each["refugees"]))) {
        totalYear += 0
       } else {
        totalYear += Number( each["refugees"])
       }
    });
    dataLabels.push(key)
    dataValues.push(totalYear)
  };
})//ends rawData with D3
