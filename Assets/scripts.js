let citySearched;
let tempSearched = [];
let latSearched;
let lonSearched;
let uvAmount;
let humiditySearched = [];
let windSearched = [];
let iconSearched = [];
let dateSearched = [];
let dayCounter = 0;
let fromHistory=false;
let imgSrc = [];
let searchHistoryList = [];
searchHistoryList = fetchFromLocalStorageArray("Weather"); // fetch from local storage 
apikey = "cc8238ec7b08d927f14deca758501d8f";
let formattedDate;
var A;

renderButtons();// Calling the renderButtons function at least once to display the initial list of cities
cityCall("Toronto");

function cityCall( cityName ){
    const escapeCityName = escape(cityName); 
    $.ajax( {
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${escapeCityName}&&units=imperial&appid=${apikey}`,
        method: "GET"
    }).then( getCityResponse )
    .fail( getCityError )
}
function getCityResponse( response ){
    console.log(response);console.log("response");
    
    citySearched = response.city.name;
    latSearched = response.city.coord.lat;
    lonSearched = response.city.coord.lon;
    
    A = ((24 - Number(response.list[0].dt_txt.split(" ")[1].split(":")[0]))/3)+3; // based on plus 3 (which is 9AM next day) the esult will give 1st element id
    listIndicator = 0; // initialize
    dayCounter = 0; // initialize
    while(dayCounter<6){
        console.log(listIndicator);
        tempSearched[dayCounter] = response.list[listIndicator].main.temp;
        humiditySearched[dayCounter] = response.list[listIndicator].main.humidity + "%";
        windSearched[dayCounter] = response.list[listIndicator].wind;
        iconSearched[dayCounter] = response.list[listIndicator].weather[0].icon; imgSrc[dayCounter] = "http://openweathermap.org/img/wn/" + escape(`${iconSearched[dayCounter]}@2x.png`);
        dateSearched[dayCounter] = response.list[listIndicator].dt_txt.split(" ")[0];
        //$(`#imgDay${dayCounter+1}`).attr("src",imgSrc[dayCounter]); 
        
        listIndicator = A + (dayCounter * 8);
        dayCounter+=1;
        if (listIndicator>39) listIndicator=39;
        
    }

// list{0} - first element of hour - response.list[0].dt_txt.split(" ")[1].split(":")[0]
// change to number - (24 - Number(response.list[0].dt_txt.split(" ")[1].split(":")[0]))/3
// plus offset (daycounter=0) - A = ((24 - Number(response.list[0].dt_txt.split(" ")[1].split(":")[0]))/3)+dayCounter
// bejoz avvali baghiye ghofle roo 9 sobh [0] , [A+3], [A+3+8], [A+3+8+8], [A+3+8+8+8] 
            
            // kheili moheme in ke escape har jaye estefeade nashe!
            //document.querySelector("#IMG").src = escape(imgSrc[i]); 
            //document.querySelector("#IMG").src = imgSrc[i];
            //console.log($(`#imgDay1`).attr("src"));
            uvCall(latSearched, lonSearched);

            if (!fromHistory) { // when a "NEW" city searched and returned a valid result
                        $("#seachText").val("");
                        if (searchHistoryList.includes(citySearched)) {
                            console.log("duplicate found!");
                            for( var i = 0; i < searchHistoryList.length; i++){ 
                                if ( searchHistoryList[i] == citySearched) {
                                    searchHistoryList.splice(i, 1);
                                    break;
                                }
                            }

                        }
                        searchHistoryList.push(citySearched);
                        addToLocalStorageArray("Weather", citySearched);
                        

                        // calling renderButtons which handles the processing of our city array
                        renderButtons();
                        
            } else { 
                //do nothing
            }
             
            
            updatePage();
            console.log("searchBtn click DONE! -- new city searched and has result");
            
}
function getCityError( errorStatus ) {
    console.log(`<.Fail> callback <${errorStatus}>`);
    
    // better to tell user that there is no such city if errorStatus shows result as nothing found!! 
    // else show appropriate result like "right now, we can't connect to the server"
    $("#seachText").val("");
    console.log("myBtn click DONE! -- I must update the page here");
}


function uvCall( latSearched, lonSearched ){
    //const escapeInputParam = escape(inputparam); 
    $.ajax( {
        url: `https://api.openweathermap.org/data/2.5/uvi?appid=cc8238ec7b08d927f14deca758501d8f&lat=${latSearched}&lon=${lonSearched}`,
        method: "GET"
    }).then( getUvResponse )
    .fail( getUvError )
    }
function getUvResponse( response ){
    //console.log(response);
    uvAmount = response.value;
    $("#uvMain").html(`${uvAmount}`);
}
function getUvError( errorStatus ) {
    console.log(`<.Fail> callback <${errorStatus}>`);
}

        
function addToLocalStorageArray (key, value) {

    // Get the existing data
    var existing = localStorage.getItem(key);

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    if (existing.includes(value)) {
        console.log("duplicate found!");
        for( var i = 0; i < searchHistoryList.length; i++){ 
            if ( existing[i] == value) {
                existing.splice(i, 1);
                break;
            }
        }

    }

    // Add new data to localStorage Array
    existing.push(value);

    // Save back to localStorage
    localStorage.setItem(key, existing.toString());

}
function fetchFromLocalStorageArray(key){
    // Get the existing data
    var existing = localStorage.getItem(key);

    //debugger;

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    existing = existing ? existing.split(',') : [];

    // Add new data to localStorage Array
    //existing.push(value);
    return existing;
}


// This function handles events where one button is clicked
$("#searchBtn").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // This line will grab the text from the input box
    var city = $("#seachText").val().trim();
    if (city=="") return; // if nothing is searched, exit function 
    fromHistory=false;
    cityCall(city);
});

function renderButtons() {

    // Deleting the movie buttons prior to adding new movie buttons
    // (this is necessary otherwise we will have repeat buttons)
    $("#buttonList").empty();

    var myBtn;
    // Looping through the array of movies
    for (var i = 0; i < searchHistoryList.length; i++) {

        // Then dynamicaly generating buttons for each movie in the array.
        // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
        myBtn = $("<button>");
        // Adding a class    
        myBtn.addClass("historyBtn");
        myBtn.addClass("btn");
        myBtn.addClass("btn-light");
        myBtn.addClass("col-12");
        // Adding a data-attribute with a value of the movie at index i
        myBtn.attr("data-name", searchHistoryList[i]);
        // Providing the button's text with a value of the movie at index i
        myBtn.text(searchHistoryList[i]);
        myBtn.attr("id" , "btn" + searchHistoryList[i]);
        
        // Adding the button to the HTML
        $("#buttonList").prepend(myBtn);

        myBtn.on("click", function(event) {
                // event.preventDefault() prevents the form from trying to submit itself.
                // We're using a form so that the user can hit enter instead of clicking the button if they want
                event.preventDefault();
                console.log(event.target);
                fromHistory=true;
                //document.querySelector(`#${event.target.id}`).style.backgroundColor="red";
                cityCall(event.target.getAttribute("data-name"));
                
            });
    }

}
        
function updatePage(){
    
    formattedDate = moment(dateSearched[0]).format('L');
    $("#cityName").html(`<h2>${citySearched} (${formattedDate})</h2>`);
    $("#currentWeatherIcon").attr("src","http://openweathermap.org/img/wn/" + `${iconSearched[0]}@2x.png`);
    $("#tempMain").html(`Temperature: ${tempSearched[0]} &deg;F`);
    $("#humidityMain").html(`Humidity: ${humiditySearched[0]}`);
    $("#windMain").html(`Wind Speed: ${windSearched[0]["speed"]} MPH`);
    //$("#uvMain").html(`${uvAmount}`); it is updated in getUvResponse()
    

    formattedDate = moment(dateSearched[1]).format('L');
    $("#data1").html(`<h4 style="font-size:20px;">${formattedDate}</h4>`);
    $("#imgDay1").attr("src","http://openweathermap.org/img/wn/" + `${iconSearched[1]}.png`);
    $("#temp1").html(`Temp: ${tempSearched[1]} &deg;F<br>`);
    $("#humidity1").html(`Humidity: ${humiditySearched[1]}`);

    
    
    formattedDate = moment(dateSearched[2]).format('L');
    $("#data2").html(`<h4 style="font-size:20px;">${formattedDate}</h4>`);
    $("#imgDay2").attr("src","http://openweathermap.org/img/wn/" + `${iconSearched[2]}.png`);
    $("#temp2").html(`Temp: ${tempSearched[2]} &deg;F<br>`);
    $("#humidity2").html(`Humidity: ${humiditySearched[2]}`);

    

    formattedDate = moment(dateSearched[3]).format('L');
    $("#data3").html(`<h4 style="font-size:20px;">${formattedDate}</h4>`);
    $("#imgDay3").attr("src","http://openweathermap.org/img/wn/" + `${iconSearched[3]}.png`);
    $("#temp3").html(`Temp: ${tempSearched[3]} &deg;F<br>`);
    $("#humidity3").html(`Humidity: ${humiditySearched[3]}`);

    

    formattedDate = moment(dateSearched[4]).format('L');
    $("#data4").html(`<h4 style="font-size:20px;">${formattedDate}</h4>`);
    $("#imgDay4").attr("src","http://openweathermap.org/img/wn/" + `${iconSearched[4]}.png`);
    $("#temp4").html(`Temp: ${tempSearched[4]} &deg;F<br>`);
    $("#humidity4").html(`Humidity: ${humiditySearched[4]}`);


    console.log(iconSearched[5]);
    formattedDate = moment(dateSearched[5]).format('L');
    $("#data5").html(`<h4 style="font-size:20px;">${formattedDate}</h4>`);
    $("#imgDay5").attr("src","http://openweathermap.org/img/wn/" + `${iconSearched[5]}.png`);
    $("#temp5").html(`Temp: ${tempSearched[5]} &deg;F<br>`);
    $("#humidity5").html(`Humidity: ${humiditySearched[5]}`);
    

    // change color buttons
    // agar search mikone, reslult dareh (change color avali) - agaram nadareh (har chi az ghabl bood ro neshoon bede masalan tabriz!)
    // display empty message agar search result nadareh..
    // maximum show last 10 
    // double check the units

}