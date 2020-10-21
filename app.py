# Import the functions we need from flask
from flask import Flask
from flask import render_template 
from flask import jsonify
from flask import request

# Import the functions we need from SQL Alchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import and_, or_, text

from config import username
from config import password

from datetime import datetime


# Define the database connection parameters
# username = 'postgres'  # Ideally this would come from config.py (or similar)
# password = 'Popop_2020'  # Ideally this would come from config.py (or similar)
# database_name = 'GlobalFirePower' # Created in Week 9, Night 1, Exercise 08-Stu_CRUD 
database_name = 'hurricanes' # Created in Week 9, Night 1, Exercise 08-Stu_CRUD 
connection_string = f'postgresql://{username}:{password}@localhost:5432/{database_name}'

# Connect to the database
engine = create_engine(connection_string)
base = automap_base()
base.prepare(engine, reflect=True)

# Choose the table we wish to use
# table = base.classes.firepower
hurricane_table = base.classes.hurricanes

# Instantiate the Flask application. (Chocolate cake recipe.)
# This statement is required for Flask to do its job. 
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # Effectively disables page caching

# Here's where we define the various application routes ...
@app.route("/")
def IndexRoute():
    ''' This function runs when the browser loads the index route. 
        Note that the html file must be located in a folder called templates. '''

    webpage = render_template("index.html")
    return webpage

@app.route("/other")
def OtherRoute():
    ''' This function runs when the user clicks the link for the other page.
        Note that the html file must be located in a folder called templates. '''

    # Note that this call to render template passes in the title parameter. 
    # That title parameter is a 'Shirley' variable that could be called anything 
    # we want. But, since we're using it to specify the page title, we call it 
    # what we do. The name has to match the parameter used in other.html. 
    webpage = render_template("other.html", title_we_want="Shirley")
    return webpage

@app.route("/hurricaneNames")
def HurricaneNames():
    ''' Query the database for hurricanes and return the results as a JSON. '''

    session = Session(engine)
    results = session.query(hurricane_table.name).all()
    session.close()

    all_hurricanes = []
    for name in results:
        dict = {}
        dict["name"] = name
        all_hurricanes.append(dict)

    return jsonify(all_hurricanes)


@app.route("/everything")
def everything():
    ''' Query the database for population numbers and return the results as a JSON. '''

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(hurricane_table.name,
                            hurricane_table.date_stamp,
                            hurricane_table.time_stamp,
                            hurricane_table.status,
                            hurricane_table.max_wind,
                            hurricane_table.city,
                            hurricane_table.country,
                            hurricane_table.new_latitude,
                            hurricane_table.new_longitude).all()
    session.close 

    print("results: ", results)

    hurricaneDetails = []
    for name, date_stamp, time_stamp, status, max_wind, city, country, new_latitude, new_longitude in results:
        dict = {}
        dict["name"] = name
        dict["status"] = status
        dict["date_stamp"] = date_stamp
        dict["time_stamp"] = time_stamp
        dict["max_wind"] = max_wind
        dict["city"] = city
        dict["country"] = country
        dict["latitude"] = new_latitude
        dict["longitude"] = new_longitude
        hurricaneDetails.append(dict)

    # Return the jsonified result. 
    return jsonify(hurricaneDetails)



@app.route("/searchByName")
def searchByName():
    ''' Query the database for population numbers and return the results as a JSON. '''

    name  = request.args.get('name', None)

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(hurricane_table.name,
                            hurricane_table.date_stamp,
                            hurricane_table.time_stamp,
                            hurricane_table.status,
                            hurricane_table.max_wind,
                            hurricane_table.city,
                            hurricane_table.country,
                            hurricane_table.new_latitude,
                            hurricane_table.new_longitude)\
                                .filter(hurricane_table.name == name).all()
    session.close 

    print("Search Results: ", results)

    hurricaneDetails = []
    for name, date_stamp, time_stamp, status, max_wind, city, country, new_latitude, new_longitude in results:
        dict = {}
        dict["name"] = name
        dict["status"] = status
        dict["date_stamp"] = date_stamp
        dict["time_stamp"] = time_stamp
        dict["max_wind"] = max_wind
        dict["city"] = city
        dict["country"] = country
        dict["latitude"] = new_latitude
        dict["longitude"] = new_longitude
        hurricaneDetails.append(dict)

    # Return the jsonified result. 
    return jsonify(hurricaneDetails)



@app.route("/searchFor")
def searchFor():
    ''' Query the database for population numbers and return the results as a JSON. '''

    year  = request.args.get('year', None)
    name  = request.args.get('name', None)

    conds = []
    
    if (year):
        string = "hurricane_table.date_stamp/10000 == {}".format(year)
        print(string)
        conds.append(string)

    if (name):
        string = "hurricane_table.name == {}".format(name)
        print(string)
        conds.append(string)

    print(conds)

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(hurricane_table.name,
                            hurricane_table.date_stamp,
                            hurricane_table.time_stamp,
                            hurricane_table.status,
                            hurricane_table.max_wind,
                            hurricane_table.city,
                            hurricane_table.country,
                            hurricane_table.new_latitude,
                            hurricane_table.new_longitude)\
                                .filter(text(and_(*conds))).all()
                                #.filter(hurricane_table.date_stamp/10000 == year)\
                                #.filter(hurricane_table.name == name).all()
                                
                               
    session.close 

    print("Search Results: ", results)

    hurricaneDetails = []
    for name, date_stamp, time_stamp, status, max_wind, city, country, new_latitude, new_longitude in results:
        dict = {}
        dict["name"] = name
        dict["status"] = status
        dict["date_stamp"] = date_stamp
        dict["time_stamp"] = time_stamp
        dict["max_wind"] = max_wind
        dict["city"] = city
        dict["country"] = country
        dict["latitude"] = new_latitude
        dict["longitude"] = new_longitude
        hurricaneDetails.append(dict)

    # Return the jsonified result. 
    return jsonify(hurricaneDetails)



@app.route("/test")
def TestRoute():
    ''' This function returns a simple message, just to guarantee that
        the Flask server is working. '''

    return "This is the test route!"

@app.route("/dictionary")
def DictionaryRoute():
    ''' This function returns a jsonified dictionary. Ideally we'd create 
        that dictionary from a database query. '''

    dict = { "Fine Sipping Tequila": 10,
             "Beer": 2,
             "Red Wine": 8,
             "White Wine": 0.25}
    
    return jsonify(dict) # Return the jsonified version of the dictionary

@app.route("/dict")
def DictRoute():
    ''' This seems to work in the latest versions of Chrome. But it's WRONG to
        return a dictionary (or any Python-specific datatype) without jsonifying
        it first! '''        

    dict = { "one": 1,
             "two": 2,
             "three": 3}
    
    return dict # WRONG! Don't return a dictionary! Return a JSON instead. 

@app.route("/yearData")
def YearData():

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(hurricane_table.date_stamp).all()
    session.close 

    yearData = []
    for date_stamp in results:
        date_time_str = str(date_stamp[0])
        date_time_obj = datetime.strptime(date_time_str, '%Y%m%d')
        date_time_year = date_time_obj.year
        if date_time_year not in yearData:
            yearData.append(date_time_year)

    yearData.sort()

    yearJson = []
    for year in yearData:
        dict = {}
        dict["year"] = year
        #print("yearValue: ", date_time_obj.year)
        yearJson.append(dict)

    # Return the jsonified result. 
    #return jsonify(yearData)
    return jsonify(yearJson)

@app.route("/nameData")
def NameData():

    # Open a session, run the query, and then close the session again
    session = Session(engine)
    results = session.query(hurricane_table.name).all()
    session.close 

    nameData = []
    for name in results:
        dict = {}
        dict["name"] = name        
        if dict not in nameData:
            nameData.append(dict)

    # Return the jsonified result. 
    return jsonify(nameData)

# This statement is required for Flask to do its job. 
# Think of it as chocolate cake recipe. 
if __name__ == '__main__':
    app.run(debug=True)