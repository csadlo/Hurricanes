// Show that we've loaded the JavaScript file
console.log("Loaded main.js");

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

// Select the input elements
var yearInputElement = d3.select("#year");
var nameInputElement = d3.select("#name");
var cityInputElement = d3.select("#city");
var stateInputElement = d3.select("#state");
var categoryInputElement = d3.select("#category");
var windInputElement = d3.select("#wind");

// Select the button
var search_button = d3.select("#search-btn");

// Create event handlers 
//search_button.on("click", runEnter);
//form.on("submit",runEnter);

d3.json("/hurricaneNames").then(function (data) 
{
    hurricaneNames = [];
    hurricaneNames = data;
    
    console.log("hurricane names: ", hurricaneNames);       
});

d3.json("/hurricaneDictionary").then(function (data) 
{
    hurricaneInfo = [];
    hurricaneInfo = data;
    
    console.log("hurricane data: ", hurricaneInfo); 
});

InitDashboard();

// this function displays the dashboard in the landing page by using the first ID in dropdown as default
function InitDashboard()
{
    d3.json("/yearData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#year");
        console.log("data ", data)

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          console.log("record.year ", record.year)
          
          selector.append("option")
          .text(record.year)
          .property("value", record.year);
        });

    }); 
    d3.json("/nameData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#name");
        console.log("data ", data)

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          console.log("record.name ", record.name)
          
          selector.append("option")
          .text(record.name)
          .property("value", record.name);
        });

    }); 
}