// Show that we've loaded the JavaScript file
console.log("Loaded maptest.js");

// The current presentation mode saved as a global variable
var current_mode = 'leaflet';

// The current set of hurricane json data retrieved from the server
var current_data = [];


InitDashboard();


function leafletMethod(json_data)
{
    console.log("Entering leafletMethod()...");

    hurricaneData = json_data;
    console.log("leafletMethod(): data ", hurricaneData);

    //document.getElementById("Data_Presentation_Window").innerHTML = "";    
    //d3.selectAll("#globeORleaflet > *").remove();

    var selectedYear = 2005;
    var selectedName = "KATRINA";

    // Returns a dictionary of the filter bar values

    var filteredData = [];
    hurricaneData.forEach((row) =>
    {
        if (Math.trunc(row.date_stamp/10000) == selectedYear
            && row.name.trim().toUpperCase() == selectedName)
        {
            console.log("rowdata ", row);
            filteredData.push(row);
        }        
    });

    createMap(filteredData);

    console.log("Exiting leafletMethod()..."); 
}


function createMap(hurricaneData)
{
    var myMap = L.map("globeORleaflet", {
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

        L.marker([lat, lon]).addTo(myMap);
    }
}
// LEAFLET METHOD ENDS HERE



// NOTE: UPDATE THIS FOR FILTER BAR CHANGES
// This function displays the dashboard in the landing page by using the first ID in dropdown as default
function InitDashboard()
{
    console.log("Entering InitDashboard()");

    leafletMethod(testdata);

    console.log("Exiting Init Dashboard()");
}