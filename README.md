
# Weather-Dashboard

I uesed [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. Searched cities are being saved in `localStorage` and get fetched.


## business rules: 
if the city is not a valid city, it will not be saved in `localStorage`.
if an existing city again typed in the search box and get searched, then it will be moved to the top of history list.

## The following demonstrates the API info:


## https://home.openweathermap.org/api_keys   cc8238ec7b08d927f14deca758501d8f

## units
```
For temperature in Fahrenheit use units=imperial
For temperature in Celsius use units=metric
Temperature in Kelvin is used by default, no need to use units parameter in API call -->
```

## Web Page for UV api : https://openweathermap.org/api/uvi 
## UV api : http://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}
## https://openweathermap.org/weather-conditions 


## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```