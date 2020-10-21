// Show that we've loaded the JavaScript file
console.log("Loaded main.js");

// Select the input elements
var yearInputElement = d3.select("#yearform");
var nameInputElement = d3.select("#nameform");
var cityInputElement = d3.select("#cityform");
var countryInputElement = d3.select("#countryform");
var categoryInputElement = d3.select("#categoryform");
var windInputElement = d3.select("#windform");

// Select the button
var search_button = d3.select("#search-btn");

search_button.on("click",handleChange);

// Uncomment this if you want the website to refresh when clicking off of a filter form
yearInputElement.on("change", handleChange);
nameInputElement.on("change", handleChange);
cityInputElement.on("change", handleChange);
countryInputElement.on("change", handleChange);
categoryInputElement.on("change", handleChange);
windInputElement.on("change", handleChange);

// Create event handlers 
//search_button.on("click", runEnter);
//form.on("submit",runEnter);


InitDashboard();


// Function to handle changes to the search criteria
function handleChange(event) {

    // Prevent the page from refreshing
    //d3.event.preventDefault();

    var filteredData = testdata;

    console.log("Entering handleChange: Flying is for droids.");
    console.log(filteredData);

    var yearform_value = yearInputElement.property("value");
    if (yearform_value) {
        //console.log("Entering yearform check with: ", yearform_value);
        // FIXME - Grabbing the year this was is a little bit hacky
        filteredData = filteredData.filter(sightingReport => Math.floor(sightingReport.date_stamp/10000) == yearform_value);
    }

    console.log(filteredData);

    var nameform_value = nameInputElement.property("value");
    if (nameform_value) {
        //console.log("Entering nameform check with: ", nameform_value);
        filteredData = filteredData.filter(sightingReport => sightingReport.name.toLowerCase() === nameform_value.toLowerCase());
    }


    var funcname = "/searchByName?";
    funcname = funcname.concat("name=");
    var search_url = funcname.concat(nameform_value.toUpperCase());


    d3.json(search_url).then(function (data) 
    {
        hurricaneNames = [];
        hurricaneNames = data;
        
        console.log("Database Returns: ", hurricaneNames);       
    });

    updateTable(filteredData);
  
    console.log("Exiting handleChange: Another Happy Landing!");
    console.log(filteredData);

    return false;
}


function updateTable(thisTableData) {

    console.log("Entering updateTable()");
  
    // Start from scratch
    d3.select("tbody").selectAll("tr").remove();
  
    // Get a reference to the table body
    var tbody = d3.select("tbody");
  
    // Console.log the weather data from data.js
    console.log(thisTableData);
  
    // Use d3 to append one table row `tr` for each UFO-sighting report object
    thisTableData.forEach(function(sightingReport) {
      //console.log(sightingReport);
      var row = tbody.append("tr");
  
      Object.entries(sightingReport).forEach(function([key, value]) {
        //console.log(key, value);
  
        // Append a cell to the row for each value in the UFO-sighting report object
        var cell = row.append("td");
        cell.text(value);
      });
    });

    console.log("Exiting updateTable()");
}



/*
// Query the endpoint that returns a JSON ...
d3.json("/dictionary").then(function (data) {

    // ... and dump that JSON to the console for inspection
    console.log(data); 

    // Next, pull out the keys and the values for graphing
    keys = Object.keys(data);
    values = Object.values(data);

    // Create the trace
    var trace = {
        x: keys,
        y: values,
        type: "bar"
    };

    // Put the trace into an array (which allows us to graph
    // multiple traces, if we wish)
    var data = [trace];

    // Define a layout object
    var layout = {
        title: "'Bar' Chart",
        xaxis: { title: "Drinks"},
        yaxis: { title: "Rating"}
    };

    // Create the plot
    // Plotly.newPlot("plot", data, layout); 
});
*/

/*
d3.json("/hurricaneNames").then(function (data) 
{
    hurricaneNames = [];
    hurricaneNames = data;
    
    //console.log("hurricane names: ", hurricaneNames);       
});

d3.json("/hurricaneDictionary").then(function (data) 
{
    hurricaneInfo = [];
    hurricaneInfo = data;
    
    //console.log("hurricane data: ", hurricaneInfo); 
});
*/


// this function displays the dashboard in the landing page by using the first ID in dropdown as default
function InitDashboard()
{
    console.log("Entering InitDashboard");

    // Check what values are listed in the search window

    d3.json("/yearData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#yearform");
        console.log("InitDashboard: year data ", data)

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          //console.log("record.year ", record.year)
          
          selector.append("option")
          .text(record.year)
          .property("value", record.year);
        });

    }); 

    d3.json("/nameData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#nameform");
        console.log("InitDashboard: name data ", data)

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          //console.log("record.name ", record.name)
          
          selector.append("option")
          .text(record.name)
          .property("value", record.name);
        });

    }); 

    console.log("Exiting Init Dashboard");
}