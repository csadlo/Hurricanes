International Hurricane Database

Project 2 by Christopher Sadlo, Glenda Decapia, Katrice Trahan, and Sarah Kachelmeier 
Copywrite October, 2020

# Overview
​
This project displays and visualizes hurricane data from 1851 to 2015 in both the Atlantic and Pacific oceans. On our website, you can see this data visualized in an Apex chart, a leaflet map, and D3 globe, as well as a table. Use the filter bar located on the left-hand side of the screen to filter the data by hurricane year, name, category, and more! 

We chose to do a project on hurricanes because multiple team members have been affected by hurricanes during our lives.


This data comes from HURDAT2, the NOAA's hurricane database, via Kaggle.

https://www.kaggle.com/noaa/hurricane-database


# Extract-Transform-Load Challenge Instructions V1.0
## Written by Christopher Sadlo and Glenda Decapia

<br><br>

# Step 1
### Clone the repository:

* Launch Git BASH or your favorite terminal.

* Move into the directory you want to store the package


        cd <my_directory>
        git clone https://www.github.com/csadlo/Hurricanes


# Step 2
### Installing the country_converter API:  https://pypi.org/project/country-converter/

    source activate NewPythonData
    pip install country_converter --upgrade
    cd Hurricanes


# Step 3
### Creating api_keys.py file:

* Create a file called "api_keys.py" in the /Hurricanes folder and add the following code:

        weather_api_key = "<insert your api key for OpenWeatherMaps.org>"
        google_key = "<insert your api key for Google Maps>"

* Save and close the api_keys.py file in the /Hurricanes root folder.

# Step 3.5
### Creating config.js file:

const API_KEY = "<insert your api key for Google>";

* Save and close the config.js file in the static/js/ folder.

# Step 4
### Creating config.py file:

* Create a file called "config.py" in the /Hurricanes folder and add the following code:

        username = "<insert your username>"
        password = "<insert your password>"

* Save and close the config.py file in the /Hurricanes root folder.


# Step 5
### Launching and setting up the hurricanes database in pgAdmin:

* Launch pgAdmin.
* Right-click on "Databases" and create a new database called "hurricanes".
* Right-click on "hurricanes" and left-click on "query-tool".
* Click on the open file icon and navigate to the /Hurricanes folder.
* Open the "schema.sql" file.
* Run the schema.sql file to create the table.


# Step 6
### Executing the jupyter notebook:

* Move into the /Hurricanes folder if not there already.

        cd Hurricanes
        jupyter notebook

* Open and execute all but the last cell in the fast_build_database_only.ipynb file


# Step 7

* Return to the pgAdmin tab in your browser
* Databases -> hurricanes -> schemas -> public -> Table -> hurricanes
* Now either right-click on hurricanes and then click "Properties"
    -or-
* Highlight hurricanes and select "Object" in the top tool bar and then click "Properties"
* A window will pop-up. Select the "Columns" tab.
* From there, while looking at the "index" row, toggle the "Not NULL?" and "Primary Key?" options to "yes"
* SAVE

# Step 8

* Confirm success by executing the final cell in the fast_build_database_only.ipynb file
* You should see 7 different hurricane paths

# Step 9 

### Loading the flask app

* Using GitBash or your favorite terminal, enter:

        python app.py

* If the above fails, be sure to carefully read and repeat the Step 7

* Type http://127.0.0.1:5000/ (or other ip address listed) into your internet browser

​