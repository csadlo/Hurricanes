// Show that we've loaded the JavaScript file
console.log("Loaded main.js");

// The current presentation mode saved as a global variable
var current_mode = 'home';

// The current set of hurricane json data retrieved from the server
var current_data = [];

// Select the input elements
var yearInputElement = d3.select("#yearform");
var nameInputElement = d3.select("#nameform");
var cityInputElement = d3.select("#cityform");
var countryInputElement = d3.select("#countryform");
var categoryInputElement = d3.select("#categoryform");
var windInputElement = d3.select("#windform");
var oceanInputElement = d3.select("#oceanform");


// Select the button
var search_button = d3.select("#search-btn");

search_button.on("click", handleFilterChange);

// Uncomment this if you want the website to refresh when clicking off of a filter form
//yearInputElement.on("change", handleFilterChange);
yearInputElement.on("change", handleFilterChange);
nameInputElement.on("change", handleFilterChange);
cityInputElement.on("change", handleFilterChange);
countryInputElement.on("change", handleFilterChange);
categoryInputElement.on("change", handleFilterChange);
windInputElement.on("change", handleFilterChange);
oceanInputElement.on("change", handleFilterChange);



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


// NOTE: UPDATE THIS FOR FILTER BAR CHANGES
function GetFilterBarInputValues()
{
    console.log("Entering GetFilterBarInputValues()");

    dict = {};
    dict["year"]        = yearInputElement.property("value");
    dict["name"]        = nameInputElement.property("value");
    dict["city"]        = cityInputElement.property("value");
    dict["country"]     = countryInputElement.property("value");
    dict["category"]    = categoryInputElement.property("value");
    dict["wind"]        = windInputElement.property("value");
    dict["ocean"]       = oceanInputElement.property("value");


    console.log("Exiting GetFilterBarInputValues()");

    return dict;
}

// Function to handle changes to the search criteria
// NOTE: UPDATE THIS FOR FILTER BAR CHANGES
function handleFilterChange(event) {

    console.log("Entering handleFilterChange(): Flying is for droids.");

    // Prevent the page from refreshing
    //d3.event.preventDefault();

    var filteredData = [];

    // Returns a dictionary of the filter bar values
    inputs = GetFilterBarInputValues();

    yearform_value = inputs["year"];  // could be "ALL" or could be a specific value
    nameform_value = inputs["name"];  // could be "ALL" or could be a specific value
    cityform_value = inputs["city"];  // could be "ALL" or could be a specific value
    countryform_value = inputs["country"];  // could be "ALL" or could be a specific value
    categoryform_value = inputs["category"];  // could be "ALL" or could be a specific value
    windform_value = inputs["wind"];  // could be "ALL" or could be a specific value
    oceanform_value = inputs["ocean"];  // could be "ALL" or could be a specific value


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
        search_url = search_url.concat(nameform_value.toUpperCase());
        num_params++;
    }

    if (cityform_value && IsSpecificValue(cityform_value)) 
    {
        if (num_params > 0)    // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("city=");
        search_url = search_url.concat(cityform_value.toUpperCase());
        num_params++;
    }

    if (countryform_value && IsSpecificValue(countryform_value)) 
    {
        if (num_params > 0)    // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("country=");
        search_url = search_url.concat(countryform_value.toUpperCase());
        num_params++;
    }

    if (categoryform_value && IsSpecificValue(categoryform_value)) 
    {
        if (num_params > 0)    // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("category=");
        search_url = search_url.concat(categoryform_value);
        num_params++;
    }

    if (windform_value && IsSpecificValue(windform_value)) 
    {
        if (num_params > 0)    // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("wind=");
        search_url = search_url.concat(windform_value);
        num_params++;
    }

    if (oceanform_value && IsSpecificValue(oceanform_value)) 
    {
        if (num_params > 0)    // Means we're dealing with multiple parameters
            search_url = search_url.concat("&");

        search_url = search_url.concat("ocean=");
        search_url = search_url.concat(oceanform_value.toUpperCase());
        num_params++;
    }


    console.log("Constructing Search URL = ", search_url);

    // Access the database and grab the data matching the requirements
    d3.json(search_url).then(function (json_data) 
    {
        // Cache the filtered json data so that we can skip running 
        // handleFilterChange() during a handleModeChange() event
        current_data = json_data;

        console.log("Accessing URL:", search_url);
        console.log("Database Returns: ", current_data);

        UpdatePresentationWindow(current_data);

        // Dynamically Update all of the OTHER drop down menus, while maintaining an "ALL" option
        UpdateYearDropDownMenu(current_data);
        UpdateNameDropDownMenu(current_data);
        UpdateDropDownMenu("city", current_data);
        UpdateDropDownMenu("country", current_data);
        UpdateDropDownMenu("category", current_data);
        UpdateDropDownMenu("wind", current_data);
        UpdateDropDownMenu("ocean", current_data);
    });

    console.log("Exiting handleFilterChange(): Another Happy Landing!");

    return false;
}

// This function updates the website when the data presentation mode has changed
function handleModeChange(new_mode)
{
    console.log("Entering handleModeChange()");

    // ASK A TA - How do I get the current selection of the dropdown menu?

    //var prop_value = d3.select("#PresentationMode").property("value");    // returns NULL
    //var node = d3.select("#PresentationMode").node();                       // returns NULL
    //var node_value = d3.select("#PresentationMode").node().value;         // returns NULL
    //var value = d3.select("#PresentationMode").value;
    //var text = d3.select("#PresentationMode").text;

    //console.log("handleModeChange(): #PresentationMode .property(value) is...", prop_value);
    //console.log("handleModeChange(): #PresentationMode .node() is...", node);
    //console.log("handleModeChange(): #PresentationMode .node().value is...", node_value);
    //console.log("handleModeChange(): #PresentationMode .value is...", value);
    //console.log("handleModeChange(): #PresentationMode .text is...", text);
/*
    //var store = $(this).html();
    text = $('#navbarDropdown').text();
    //value = $('#navbarDropdown').value;

    console.log("handleModeChange(): #navbarDropdown .text = ", text);
    //console.log("handleModeChange(): #navbarDropdown .value = ", value);
*/
    // Jquery Code
    // FIXME
    /*
    $('.dropdown-menu li > a').click(function(e){
        $('.current_mode').text(this.innerHTML);
    });
    */

    // current_mode is a global variable that can be accessed in other functions
    console.log("handleModeChange(): The currently active mode seems to be ...", current_mode);
    current_mode = new_mode;
    console.log("handleModeChange(): The new mode selected seems to be ...", new_mode);

    // Update the Bootstrap Dropdown Menu Text
    if (current_mode == "home")
        $('#navbarDropdown').text("Visualization - Home");
    else if (current_mode == "globe")
        $('#navbarDropdown').text("Visualization - Globe");
    else if (current_mode == "leaflet")
        $('#navbarDropdown').text("Visualization - Map");
    else if (current_mode == "table")
        $('#navbarDropdown').text("Visualization - Table");
    else if (current_mode == "javaLib")
        $('#navbarDropdown').text("Visualization - Chart");
    else
        $('#navbarDropdown').text("Visualization - FIXME");

    // FIXME - Try caching the previous results of this function globally so we 
    // don't have to query the database everytime we change a presentation mode.
    //handleFilterChange();
    // - or -
    UpdatePresentationWindow(current_data);

    console.log("Exiting handleModeChange()");

}


function UpdatePresentationWindow(json_data)
{
    console.log("Entering UpdatePresentationWindow()");

    d3.selectAll("#Data_Presentation_Window > *").remove();
    //document.getElementById("Data_Presentation_Window").innerHTML = "";    
    document.getElementById("Data_Presentation_Window").classList.remove('leaflet-container', 'leaflet-retina', 'leaflet-fade-anim', 'leaflet-grab', 'leaflet-touch-drag');

    if (chart) {
        chart.destroy();
    }

    //var mode = d3.select("#PresentationMode").property("value");
    //var mode = d3.select("#PresentationMode").value; 
    var mode = current_mode;    // Global variable

    if (mode == "home")
        homeMethod(json_data);

    else if (mode == "globe") {
        UpdateGlobeMethod();
        globeMethod(json_data);
    }
    else if (mode == "leaflet")
        leafletMethod(json_data);

    else if (mode == "table")
        UpdateTable(json_data);

    else if (mode == "javaLib")
        javalibMethod(json_data);

    console.log("Exiting UpdatePresentationWindow()");
}

function homeMethod(json_data)
{
    console.log("Entering homeMethod()...");

    var globePath = "..\\static\\images\\globe.jpg";
    var titleArea = d3.select("#displayTitle");
    var summaryArea = d3.select("#Data_Presentation_Summary");
    var displayArea = d3.select("#Data_Presentation_Window");

    // Reset the title, summary, and display divs to empty
    titleArea.html("");
    summaryArea.html("");
    displayArea.html("");

    titleArea.append("p").text("Welcome to the International Hurricane Database");

    //Add the summary
    //summaryArea.insert("h2").text("Home - Welcome to the International Hurricane Database");
    summaryArea.insert("p").text("Please use the search bar on the left to select which hurricanes you are interested in. Use the dropdown menu above to change the visualization type.");
    summaryArea.insert("p").text("This data comes from the HURDAT2, the NOAA's hurricane database, by way of Kaggle.");
    summaryArea.insert("p").text("Project by Chris Sadlo, Glenda Decapia, Katrice Trahan, and Sarah Kachelmeier");

    displayArea.append("img")
       .attr("src", globePath)
       .attr("width", "500")
       .attr("height", "500");

    console.log("Exiting homeMethod()...");
}


var proj;
var path;
var graticule;
var svg;


//const projection = d3.geoOrthographic();
//const path = d3.geoPath().projection(projection);
var coordinates = [];
var width = 640, height = 640;
const center = [width/2, height/2];

function globeMethod(json_data)
{
    console.log("Entering globeMethod()...");

    var titleArea = d3.select("#displayTitle");
    var summaryArea = d3.select("#Data_Presentation_Summary");
    //var displayArea = d3.select("#Data_Presentation_Window");

    // Reset the title, summary, and display divs to empty
    titleArea.html("");
    summaryArea.html("");
    //displayArea.html("");

    // Returns a dictionary of the filter bar values
    inputs = GetFilterBarInputValues();

    var selectedYear = inputs["year"];  // could be "ALL" or could be a specific value
    var selectedName = inputs["name"];  // could be "ALL" or could be a specific value

    titleArea.append("p").text("Hurricane " + selectedName + " , " + "Year " + selectedYear);

    summaryArea.insert("h2").text("Global View");
    summaryArea.insert("p").text("This view of the hurricane data utilizes a projection on an orthoganal projection of the globe.");

    hurricaneData = json_data;

    //projection = d3.geoOrthographic();
    //path = d3.geoPath().projection(projection);

    d3.select(window)
        .on("mousemove", mousemove)
        .on("mouseup", mouseup);

    proj = d3.geoOrthographic()
        .scale(300)     // Changes size of the projection
        .translate([width / 2, height / 2])
        .clipAngle(90);     // Changes the visible horizon

    svg = d3.select("#Data_Presentation_Window")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .on("mousedown", mousedown);

    path = d3.geoPath().projection(proj).pointRadius(1.5);

    graticule = d3.geoGraticule().step([10, 10]);
    
    proj.rotate([90, -30, 0]);

    d3.json("../static/js/world-110m.json")
      .then((worldData) => {
            svg.selectAll(".segment")
            .data(topojson.feature(worldData, worldData.objects.countries).features)
            .enter().append("path")
            .attr("class", "segment")
            .attr("d", path)
            .style("stroke", "#888")
            .style("stroke-width", "1px")
            .style("fill", (d, i) => 'white')
            .style("opacity", ".8");          
      });

    svg.append("path")
       .datum(graticule)
       .attr("class", "graticule")
       .attr("d", path)
       .style("fill", "white") 
       .style("stroke", "blue"); 

    for (var i = 0; i < hurricaneData.length; i++) 
    {
       coordinates.push([hurricaneData[i].longitude, hurricaneData[i].latitude]);
    }       

    /*d3.select(window)
       .on("mousemove", mousemove)
       .on("mouseup", mouseup);
    */
    console.log(d3.geo);

    proj.rotate([90, -30, 0]);
    //rotateGlobe();
    plotMarkers();
   
   
    //var graticule = d3.geo.graticule();
   
    // svg = d3.select("#Data_Display_Window").append("svg")
    //            .attr("width", width)
    //            .attr("height", height)
    //            .on("mousedown", mousedown);
   
    /*
    queue()
       .defer(d3.json, "../static/js/world-110m.json")
       .defer(d3.json, "../static/js/places.json")
       .await(ready());
    */

    console.log("Exiting globeMethod()..."); 
}

const config = {
    speed: 0.005,
    verticalTilt: -30,
    horizontalTilt: 0
}

function rotateGlobe() {
    d3.timer(function (elapsed) {
        proj.rotate([config.speed * elapsed + 60, config.verticalTilt, config.horizontalTilt]);
        svg.selectAll("path").attr("d", path);
        //plotMarkers();
    });
}   

function plotMarkers() {

    svg.selectAll("g").remove();     // Clean up any old markers

    var markerGroup = svg.append("g");
    var markers = markerGroup.selectAll('circle').data(coordinates);
    markers
        .enter()
        .append('circle')
        .merge(markers)
        .attr('cx', d => proj(d)[0])
        .attr('cy', d => proj(d)[1]) 
        .attr('fill', d => {
            const coordinate = [d[0], d[1]];
            gdistance = d3.geoDistance(coordinate, proj.invert(center)); 
            return gdistance > 1.57 ? 'none' : '#14db3f'; 
        })
        .attr('r', 3); 

    markerGroup.each(function () {
        this.parentNode.appendChild(this);
    });
}

function UpdateGlobeMethod() {

    // Deletes all the markers
    d3.select("#Data_Presentation_Window").selectAll("g").html("");
    d3.select("#Data_Presentation_Window").selectAll("g").remove();
    console.log("HELLO THERE!!!!");
    console.log("HELLO THERE!!!!");
    console.log("HELLO THERE!!!!");
    console.log("HELLO THERE!!!!");
    console.log("HELLO THERE!!!!");
    console.log("HELLO THERE!!!!");
    //globe

}


function leafletMethod(json_data)
{
    console.log("Entering leafletMethod()...");

    console.log("leafletMethod(): data ", json_data);

    var titleArea = d3.select("#displayTitle");
    var summaryArea = d3.select("#Data_Presentation_Summary");
    var displayArea = d3.selectAll("#Data_Presentation_Window > *");

    // Reset the title, summary, and display divs to empty
    titleArea.html("");
    summaryArea.html("");
    displayArea.html("");

    // Returns a dictionary of the filter bar values
    inputs = GetFilterBarInputValues();

    var selectedYear = inputs["year"];  // could be "ALL" or could be a specific value
    var selectedName = inputs["name"];  // could be "ALL" or could be a specific value

    titleArea.append("p").text("Hurricane " + selectedName + " , " + "Year " + selectedYear);

    createMap(json_data);

    console.log("Exiting leafletMethod()..."); 
}

var myMap; // leaflet map
var chart; //apex chart

function createMap(hurricaneData)
{

    if (myMap) {
        myMap.remove();
    }

    var totalLat = 0;
    var totalLon = 0;
    var recCount = 0;
    
    for (var i = 0; i < hurricaneData.length; i++) 
    {
        if (hurricaneData[i].latitude && 
            hurricaneData[i].longitude) {
            totalLat += hurricaneData[i].latitude;
            totalLon += hurricaneData[i].longitude;
            recCount++;
        }
    }

    var avgLat = 30;
    var avgLon = -90;  
    var zoomCnfg = 5;  
    
    if (recCount > 0) {
        avgLat = totalLat / recCount;
        avgLon = totalLon / recCount;        
        zoomCnfg = recCount > 10 ? 3 : 8;
    }
    
    myMap = L.map("Data_Presentation_Window", {
        center: [avgLat, avgLon],
        zoom: zoomCnfg
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

        //console.log("latitude ", lat);
        //console.log("longitude ", lon);

        var marker = L.marker([lat, lon]);
        marker.bindPopup("Name: " + hurricaneData[i].name +
                         "<br/>Date: " + hurricaneData[i].date_stamp + 
                         "<br/>Time: " + hurricaneData[i].time_stamp + 
                         "<br/>Nearest City: " + hurricaneData[i].city + 
                         "<br/>Nearest Country: " + hurricaneData[i].country +
                         "<br/>Wind Speed (MPH): " + hurricaneData[i].wind +
                         "<br/>Category: " + hurricaneData[i].category +
                         "<hr/>Coordinates: " + hurricaneData[i].latitude +
                         ", " + hurricaneData[i].longitude
                         );     
        marker.on("mouseover", function(e) {
            this.openPopup();
        });
        marker.on("mouseout", function(e) {
            this.closePopup();
        });        
        marker.addTo(myMap);
    }


}
// LEAFLET METHOD ENDS HERE

// JAVALIB METHOD STARTS HERE
function javalibMethod(json_data)
{
    d3.selectAll("#Data_Presentation_Window > *").remove();

    hurricaneData = json_data;
    console.log("My filtered data: ", json_data);

    // Returns a dictionary of the filter bar values
    inputs = GetFilterBarInputValues();

    var selectedYear = inputs["year"];  // could be "ALL" or could be a specific value
    var selectedName = inputs["name"];  // could be "ALL" or could be a specific value

    var filteredNames = [];   
    var filteredDatestamp = [];   
    var filteredWindSpeed = [];   

    hurricaneData.forEach((row) =>
    {
        filteredNames.push(row.name);
        filteredDatestamp.push(row.date_stamp);
        filteredWindSpeed.push(row.wind);
    });

    console.log("javalib filteredNames  ", filteredNames);
    console.log("javalib filteredDatestamp  ", filteredDatestamp);
    console.log("javalib filteredWindSpeed  ", filteredWindSpeed);
    
    d3.selectAll("#displayTitle > *").remove();
    d3.select("#displayTitle").append("p").text("Hurricane " + selectedName + ", Year " + selectedYear);

    var options = {
        chart: 
        {
            type: 'bar',
            animations: 
            {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }
        },
        series: 
        [{
            name: 'Wind (MPH)',
            data: filteredWindSpeed
        }],
        xaxis: 
        {
            name: 'Datestamp',
            labels: 
            {
                formatter: function(value, timestamp, opts) 
                {
                    var dateStr = value.toString();
                    return dateStr.toString().substring(4, 6) + "/" 
                     + dateStr.toString().substring(6, 8) + "/"
                     + dateStr.substring(0, 4);
                }
            },
            categories: filteredDatestamp
        }, 
        tooltip: 
        {
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                return "<span><b>Name</b>: " + filteredNames[dataPointIndex] + "<br/>" +
                            "<b>Max Wind</b>: " +
                            series[seriesIndex][dataPointIndex] +
                            "&nbsp;knots</span>"                
            }
        }

    }

    chart = new ApexCharts(document.querySelector("#Data_Presentation_Window"), options);
    chart.render();
      
}
// JAVALIB METHOD ENDS HERE

function UpdateTable(json_data) {

    console.log("Entering UpdateTable()");

    // Console.log the weather data from data.js
    console.log("UpdateTable(): table data", json_data);
  
    var col_names = ["Year", "Time", "Name", "City", "Country", "Wind Speed", "Latitude", "Longitude"];
    var col_order = ["date_stamp", "time_stamp", "name", "city", "country", "wind", "latitude", "longitude"];

    var titleArea = d3.select("#displayTitle");
    var summaryArea = d3.select("#Data_Presentation_Summary");
    var displayArea = d3.select("#Data_Presentation_Window");

    // Reset the title, summary, and display divs to empty
    titleArea.html("");
    summaryArea.html("");
    displayArea.html("");
    //d3.select("tbody").selectAll("tr").remove();

    // Returns a dictionary of the filter bar values
    inputs = GetFilterBarInputValues();


    // formatter: function(value, timestamp, opts) 
    // {
    //     var dateStr = value.toString();
    //     return dateStr.toString().substring(4, 6) + "/" 
    //         + dateStr.toString().substring(6, 8) + "/"
    //         + dateStr.substring(0, 4);
    // }


    var selectedYear = inputs["year"];  // could be "ALL" or could be a specific value
    var selectedName = inputs["name"];  // could be "ALL" or could be a specific value

    titleArea.append("p").text("Hurricane " + selectedName + " , " + "Year " + selectedYear);

    var table = displayArea.append("table");
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
        .data(json_data)
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

function UpdateYearDropDownMenu(json_data)
{
    //d3.json("/yearData").then(function(json_data) 
    {
        // selects the dropdown entity in the html
        var selector = yearInputElement;
        console.log("UpdateYearDropDownMenu(): year data ", json_data)

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
        json_data.forEach((record) =>
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

function UpdateNameDropDownMenu(json_data)
{
    //d3.json("/nameData").then(function(json_data) 
    {
        // selects the dropdown entity in the html
        var selector = nameInputElement;
        console.log("UpdateNameDropDownMenu: name data ", json_data)

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
        json_data.forEach((record) =>
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


// NOTE: UPDATE THIS FOR FILTER BAR CHANGES
function UpdateDropDownMenu(type, json_data)
{
    //d3.json("/yearData").then(function(json_data) 
    {
        // selects the dropdown entity in the html
        var selector
        var selector_string

        if (type == "city") {
            selector_string = "Cities"
            selector = cityInputElement 
        }
        if (type == "country") {
            selector_string = "Countries"
            selector = countryInputElement 
        }
        if (type == "category") {
            selector_string = "Categories"
            selector = categoryInputElement 
        }
        if (type == "wind") {
            selector_string = "Wind Speeds"
            selector = windInputElement 
        }
        if (type == "ocean") {
            selector_string = "Oceans"
            selector = oceanInputElement 
        }

        //console.log("UpdateDropDownMenu(",type,"): data ", json_data)

        // Save the selected value, if any
        var form_value = selector.property("value");

        selector.selectAll("option").remove();

        // Put the selected value at the top of the list
        if (form_value && IsSpecificValue(form_value)) {
            selector.append("option")
            .text(form_value)
            .property("value", form_value);
        }

        var combostring = "All " + selector_string
        selector.append("option")
        .text(combostring)
        .property("value", "ALL");

        // filter out non-unique years
        var uniqueValues = []

        json_data.forEach((record) =>
        {
            if (type == "city") {
                if (!uniqueValues.includes(record.city))
                    uniqueValues.push(record.city);
            }
            if (type == "country") {
                if (!uniqueValues.includes(record.country))
                    uniqueValues.push(record.country);
            }
            if (type == "wind") {
                if (!uniqueValues.includes(parseInt(record.wind)))
                    uniqueValues.push(parseInt(record.wind));
            }
            if (type == "category") {
                //var year = Math.floor(record.date_stamp/10000);
                if (!uniqueValues.includes(record.category))
                    uniqueValues.push(record.category);
            }
            if (type == "ocean") {
                if (!uniqueValues.includes(record.ocean))
                    uniqueValues.push(record.ocean);
            }
        });

        // Sort all the value type
        uniqueValues.sort();

        //uniqueValues.reverse();

        console.log("Unique ", selector_string, " are: ", uniqueValues);

        // fills the dropdown with list of values for selection
        uniqueValues.forEach((element) =>
        {
            selector.append("option")
            .text(element)
            .property("value", element);
        });
    }//);
}



function InitializeYearDropDownMenu()
{
    d3.json("/searchForUnique?type=year").then(function(data) 
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

function InitializeCityDropDownMenu()
{
    d3.json("/searchForUnique?type=city").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#cityform");
        console.log("InitializeCityDropDownMenu: city data ", data)

        selector.append("option")
        .text("All Cities")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.city)
          .property("value", record.city);
        });
    });
}

function InitializeCountryDropDownMenu()
{
    d3.json("/searchForUnique?type=country").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#countryform");
        console.log("InitializeCountryDropDownMenu: country data ", data)

        selector.append("option")
        .text("All Countries")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.country)
          .property("value", record.country);
        });
    });
}

function InitializeCategoryDropDownMenu()
{
    d3.json("/searchForUnique?type=category").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#categoryform");
        console.log("InitializeCategoryDropDownMenu: category data ", data)

        selector.append("option")
        .text("All Categories")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.category)
          .property("value", record.category);
        });
    }); 
}

function InitializeWindSpeedDropDownMenu()
{
    d3.json("/searchForUnique?type=wind").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#windform");
        console.log("InitializeWindSpeedDropDownMenu: wind data ", data)

        selector.append("option")
        .text("All Wind Speeds")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.wind)
          .property("value", record.wind);
        });
    }); 
}

function InitializeOceanDropDownMenu()
{
    d3.json("/searchForUnique?type=ocean").then(function(data) 
    {
        // selects the dropdown entity in the html
        var selector = d3.select("#oceanform");
        console.log("InitializeOceanDropDownMenu: ocean data ", data)

        selector.append("option")
        .text("All Oceans")
        .property("value", "ALL");

        // fills the dropdown with list of values for selection
        data.forEach((record) =>
        {
          selector.append("option")
          .text(record.ocean)
          .property("value", record.ocean);
        });
    }); 
}

// NOTE: UPDATE THIS FOR FILTER BAR CHANGES
// This function displays the dashboard in the landing page by using the first ID in dropdown as default
function InitDashboard()
{
    console.log("Entering InitDashboard()");
    // Check what values are listed in the search window

    InitializeYearDropDownMenu();
    InitializeNameDropDownMenu();
    InitializeCityDropDownMenu();
    InitializeCountryDropDownMenu();
    InitializeCategoryDropDownMenu();
    InitializeWindSpeedDropDownMenu();
    InitializeOceanDropDownMenu();

    // Do this to cache the json data into the global current_data variable
    handleFilterChange();
    handleModeChange('home');

    console.log("Exiting Init Dashboard()");
}