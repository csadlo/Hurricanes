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

function IsSpecificValue(value) {
   return (value != "ALL" && value != "ANY")
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Function to handle changes to the search criteria
function handleChange(event) {

    console.log("Entering handleChange: Flying is for droids.");

    // Prevent the page from refreshing
    //d3.event.preventDefault();

    var returnedData = [];

    // Scan all of the current selections in the search bar
    var yearform_value = yearInputElement.property("value");
    var nameform_value = nameInputElement.property("value");


    // Access the database and grab the data matching the requirements
    // Assemble the search URL to match the search bar filters selected
    var search_url = "/searchFor?";
    var num_params = 0;

    if (yearform_value && IsSpecificValue(yearform_value))
    {
        if (num_params > 0)     // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("year=");
        search_url = search_url.concat(yearform_value);
        num_params++;
    }

    if (nameform_value && IsSpecificValue(nameform_value)) 
    {
        if (num_params > 0)    // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("name=");
        search_url = search_url.concat(nameform_value.toUpperCase())
        num_params++;
    }

    console.log("Search_URL = ", search_url);

    d3.json(search_url).then(function (data) 
    {
        hurricaneData = [];
        hurricaneData = data;
        console.log("Accessing URL:", search_url);
        console.log("Database Returns: ", hurricaneData);
        
        // Use this statement to start using the database
        //filteredData = hurricaneData;
        returnedData = hurricaneData;
    });

    // Use the client-side data until the above proves to work 
    var filteredData = testdata;
    {
        if (yearform_value && IsSpecificValue(yearform_value)) {
            //console.log("Entering yearform check with: ", yearform_value);
            // FIXME - Grabbing the year this was is a little bit hacky
            filteredData = filteredData.filter(sightingReport => Math.floor(sightingReport.date_stamp/10000) == yearform_value);
        }

        var nameform_value = nameInputElement.property("value");
        if (nameform_value && IsSpecificValue(nameform_value)) {
            //console.log("Entering nameform check with: ", nameform_value);
            filteredData = filteredData.filter(sightingReport => sightingReport.name.toLowerCase() === nameform_value.toLowerCase());
        }
    }

    updateTable(filteredData);

    // Make note of the most recent selection
    // Check a global variable here...

    // Dynamically Update all of the OTHER drop down menus, while maintaining an "ALL" option
    UpdateYearDropDownMenu(filteredData);
    UpdateNameDropDownMenu(filteredData);

  
    console.log("Exiting handleChange: Another Happy Landing!");

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

function UpdateYearDropDownMenu(data)
{
    //d3.json("/yearData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = yearInputElement;
        console.log("UpdateYearDropDownMenu: year data ", data)

        // Save the selected value, if any
        var yearform_value = yearInputElement.property("value");

        yearInputElement.selectAll("option").remove();

        // Put the selected value at the top of the list
        if (yearform_value && IsSpecificValue(yearform_value)) {
            selector.append("option")
            .text(yearform_value)
            .property("value", yearform_value);
        }

        selector.append("option")
        .text("All Years")
        .property("value", "ALL");

        // filter out non-unique years
        var uniqueYears = []
        data.forEach((record) =>
        {
            var year = Math.floor(record.date_stamp/10000);
            if (!uniqueYears.includes(year))
                uniqueYears.push(year);
        });

        console.log("Unique Years are: ", uniqueYears);

        // fills the dropdown with list of values for selection
        uniqueYears.forEach((year) =>
        {
            selector.append("option")
            .text(year)
            .property("value", year);
        });
    }//);
}

function UpdateNameDropDownMenu(data)
{
    //d3.json("/nameData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = nameInputElement;
        console.log("UpdateNameDropDownMenu: name data ", data)

        // Save the selected value, if any
        var nameform_value = nameInputElement.property("value");

        selector.selectAll("option").remove();

        // Put the selected value at the top of the list
        if (nameform_value && IsSpecificValue(nameform_value)) {
            selector.append("option")
            .text(nameform_value)
            .property("value", nameform_value);
        }

        selector.append("option")
        .text("All Names")
        .property("value", "ALL");

        // filter out non-unique names
        var uniqueNames = []
        data.forEach((record) =>
        {
            if (!uniqueNames.includes(record.name))
                uniqueNames.push(record.name);
        });

        console.log("Unique Names are: ", uniqueNames);

        // fills the dropdown with list of values for selection
        uniqueNames.forEach((name) =>
        {
            selector.append("option")
            .text(name)
            .property("value", name);
        });
    }//); 
}



function InitializeYearDropDownMenu()
{
    d3.json("/yearData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#yearform");
        console.log("InitializeYearDropDownMenu: year data ", data)

        selector.append("option")
        .text("All Years")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.year)
          .property("value", record.year);
        });
    });
}

function InitializeNameDropDownMenu()
{
    d3.json("/nameData").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#nameform");
        console.log("InitializeNameDropDownMenu: name data ", data)

        selector.append("option")
        .text("All Names")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.name)
          .property("value", record.name);
        });
    }); 
}

// this function displays the dashboard in the landing page by using the first ID in dropdown as default
function InitDashboard()
{
    console.log("Entering InitDashboard");

    // Check what values are listed in the search window

    InitializeYearDropDownMenu();
    InitializeNameDropDownMenu();

    console.log("Exiting Init Dashboard");
}