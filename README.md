# Weather With Me

The application requires frontend and backend server.

Ways to start the project server :
Frontend:	1. open the terminal
		2. cd to the frontend folder
		3. npm start

Backend:	1. open the terminal
		2. node server.js

To download their required libraries: 
npm install


Site URL:
For non-user:
	1. http://lcoalhost:3000/

For user:
	1. http://localhost:3000/
	2. http://localhost:3000/Singlelocation/:location
	3. http://localhost:3000/favourite/:username

For admin:
	1. http://localhost:3000/

## Data source : WeatherAPI.com

## Schemas:

Location
	name: string
	
	region: string
	
	country: string
	
	latitute: number
	
	longitute: number
	
	timezone_id: string
	
	comments: list of Comment
	

User

	username: string
	
	password: string
	
fav_loc : list of Location

type: string, “user” or “admin”

Comment

	User
	
	time: date
	
	content: string
	

## APIs to be used:

	Google Maps
	
	WeatherAPI


## Reason for choosing WeatherAPI

- Accept real time or current JSON weather

- Mapping of locations between geodata and the API is not needed

- The API will only access data of the requested location, unlike the first two APIs which will return data from all locations.




## Work distribution

Front End

	Roy, King, Edmond

Back End

	Ryan, Gordon, Ted, Roy


## User Interfaces

Login

username in corner after login

click to confirm logout

Locations

in a table

allow keyword searching

in a map

## Single location

map

location detail

comments

List of fav locations (interface similar to 2a)

## Admin Interfaces

Request updated data from API (see Weather and Geolocation API - Free Weather and Geolocation API JSON and XML - WeatherAPI.com)

CRUD database (see Location and User schema)

logout
