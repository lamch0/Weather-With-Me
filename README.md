# CSCI2720_proj

CSCI2720 project outline

Group members

1155143373 Lam Lok Hin

1155143281 Choi Chung Yu

1155142376 Cheung King Wa

1155110159 Cheung Hing Wing

1155142672 Kwok Chun Yin

1155143825 Lam Cheuk Hin


Data source : WeatherAPI.com

Schemas:

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
	

APIs to be used:

	Google Maps
	
	WeatherAPI


Reason for choosing WeatherAPI

Accept real time or current JSON weather

Mapping of locations between geodata and the API is not needed

The API will only access data of the requested location, unlike the first two APIs which will return data from all locations.




Work distribution

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
