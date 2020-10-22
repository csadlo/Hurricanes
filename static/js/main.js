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

    var filteredData = [];

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
        filteredData = [];
        filteredData = data;
        console.log("Accessing URL:", search_url);
        console.log("Database Returns: ", filteredData);

        UpdatePresentationWindow(filteredData);

        // Dynamically Update all of the OTHER drop down menus, while maintaining an "ALL" option
        UpdateYearDropDownMenu(filteredData);
        UpdateNameDropDownMenu(filteredData);

    });

    /*
    // USE THIS TO USE THE FAKE DATA
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
    */
    

    console.log("Exiting handleChange: Another Happy Landing!");

    return false;
}

function handleModeChange()
{
    //var mode = d3.select("#PresentationMode").property("value");
    //var mode = d3.select("#PresentationMode").node().value; 
    var mode = d3.select("#PresentationMode").value; 

    $('.dropdown-menu li > a').click(function(e){
        $('.current_mode').text(this.innerHTML);
    });

    console.log("HMC: The mode selected seems to be ...", mode);

    // Try Saving the original results of this function so we don't have to query
    // the database everytime we change a presentation mode.
    handleChange();

}


function UpdatePresentationWindow(json_data)
{
    //var mode = d3.select("#PresentationMode").property("value");
    var mode = d3.select("#PresentationMode").value; 

    console.log("UPW: The mode selected seems to be ...", mode);

    var mode = "table"

    if      (mode == "globe")
        globeMethod(json_data);

    else if (mode == "leaflet")
        leafletMethod(json_data);

    else if (mode == "table")
        UpdateTable(json_data);

}

function homeMethod(json_data)
{
    console.log("Entering homeMethod()...");

    var globePath = "..\\static\\images\\globe.jpg";
    var summaryArea = d3.select("#Data_Presentation_Summary");
    var displayArea = d3.select("#Data_Presentation_Window");

    // Reset the summary and display divs to empty
    summaryArea.html("");
    displayArea.html("");
    //document.getElementById("Data_Presentation_Window").innerHTML = "";    
    
    //Add the summary
    summaryArea.insert("h2").text("Home - Welcome to the International Hurricane Database");
    summaryArea.insert("p").text("Please use the search bar on the left to select which hurricanes you are interested in. Above list under the dropdown menu you can select the type of data presentation you are interest in.");
    summaryArea.insert("p").text("Spirits gally coxswain bilge rat black jack salmagundi Brethren of the Coast cutlass hang the jib hornswaggle. Swab Sea Legs mizzen chandler bowsprit fathom bucko lass interloper crack Jennys tea cup. Bilged on her anchor gangplank Plate Fleet fore splice the main brace barque salmagundi draught nipperkin warp.");
    summaryArea.insert("p").text("Reef Blimey chandler killick nipperkin black jack sloop haul wind swing the lead bring a spring upon her cable. Case shot American Main spirits Jolly Roger crack Jennys tea cup Sink me chantey stern execution dock piracy. Hempen halter mutiny Brethren of the Coast trysail clap of thunder parrel hang the jib draught poop deck Privateer.");

    displayArea.append("img")
       .attr("src", globePath)
       .attr("width", "500")
       .attr("height", "500");

    console.log("Exiting homeMethod()...");
}

function globeMethod(json_data)
{
    console.log("Entering globeMethod()...");

    var globePath = "..\\static\\images\\globe.jpg";
    var summaryArea = d3.select("#Data_Presentation_Summary");
    var displayArea = d3.select("#Data_Presentation_Window");

    // Reset the summary and display divs to empty
    summaryArea.html("");
    displayArea.html("");

    summaryArea.insert("h2").text("Global View");
    summaryArea.insert("p").text("This view of the hurricane data utilizes a projection on an orthoganal projection of the globe.");

    displayArea.append("img")
       .attr("src", globePath)
       .attr("width", "500")
       .attr("height", "500");

    console.log("Exiting globeMethod()..."); 
}

function leafletMethod(json_data)
{
    console.log("Entering leafletMethod()...");

    document.getElementById("Data_Presentation_Window").innerHTML = "";    

    hurricaneData = json_data;
    console.log("data ", hurricaneData);

    // var selectedYear = 2001;
    // var selectedName = "MICHELLE";

    // var filteredData = [];
    // hurricaneData.forEach((row) =>
    // {
    //     if (Math.trunc(row.date_stamp/10000) == selectedYear
    //         && row.name.trim().toUpperCase() == selectedName)
    //     {
    //         console.log("rowdata ", row);
    //         filteredData.push(row);
    //     }        
    // });
    

    createMap(hurricaneData);

    console.log("Exiting leafletMethod()..."); 
}


function createMap(hurricaneData)
{
    API_KEY = "pk.eyJ1IjoiZ2dkZWNhcGlhIiwiYSI6ImNrZnlrYXR6YTIwcWoyenMzajVlNmNpbjMifQ.pn8b5lfUp6SHiYlZ60s8EQ"    
    
    var myMap = L.map("Data_Presentation_Window", {
        center: [30, -90],
        zoom: 5
    });       
    
    // Adding tile layer
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);
    
    for (var i = 0; i < hurricaneData.length; i++) {
    
        var lat = hurricaneData[i].latitude;
        var lon = hurricaneData[i].longitude;

        console.log("latitude ", lat);
        console.log("longitude ", lon);

        L.marker([lon, lat]).addTo(myMap);
    }
}
// LEAFLET METHOD ENDS HERE

function tableMethod() {


}

function UpdateTable(thisTableData) {

    console.log("Entering UpdateTable()");

    // Console.log the weather data from data.js
    console.log(thisTableData);
  
    var col_names = ["Year", "Time", "Name", "City", "Country", "Wind Speed", "Latitude", "Longitude"];
    var col_order = ["datestamp", "timestamp", "name", "city", "country", "max_wind", "latitude", "longitude"];

    var summaryArea = d3.select("#Data_Presentation_Summary");
    var displayArea = d3.select("#Data_Presentation_Window");

    // Reset the summary and display divs to empty
    summaryArea.html("");
    displayArea.html("");
    //d3.select("tbody").selectAll("tr").remove();
    
    var table = displayArea.append("table")
    table.attr("class", "table table-striped");
    var thead = table.append("thead");
    var tbody = table.append("tbody");


    thead.append("tr");

    d3.select("tr")
        .selectAll("th")
        .data(col_names)
        .enter()
        .append("th")
        .attr("class", "table-head")
        .text(function(d) { return d });

    var tr = d3.select("tbody").selectAll("tr")
        .data(thisTableData)
        .enter()
        .append("tr");

    var td = tr.selectAll("td")
        .data(function(d) {
            return col_order.map(function(m) { return d[m]; });
        })
        .enter()
        .append("td")
        .text(function(d) {return d});


/*
    var data = [
        { 'sex': 'male', 'risk': '0.04', 'age_group': 'old' },
        { 'sex': 'female', 'risk': '0.03', 'age_group': 'young' },
        { 'sex': 'male', 'risk': '0.12', 'age_group': 'old' },
        { 'sex': 'female', 'risk': '0.04', 'age_group': 'old' },
        ];
        
    var metadata = ['sex', 'risk', 'risk', 'age_group'];
    
    var table = d3.select("body").append("table");
        table.append("thead");
        table.append("tbody");
    
    var thead = d3.select("thead")
        .selectAll("th")
        .data(col_order)
        .enter()
        .append("th")
        .text(function(d) { return d });
    var tr = d3.select("tbody").selectAll("tr")
        .data(thisTableData)
        .enter()
        .append("tr");
    var td = tr.selectAll("td")
        .data(function(d) {
            return col_order.map(function(m) { return d[m]; });
        })
        .enter()
        .append("td")
        .text(function(d) {return d});
        */

    /*
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
    */

    console.log("Exiting UpdateTable()");
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

        // Sort the unique years
        uniqueYears.sort();
        uniqueYears.reverse();

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

        // Sort the unique names
        uniqueNames.sort();

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

    //handleChange();

    console.log("Exiting Init Dashboard");
}