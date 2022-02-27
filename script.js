let apiKey = "cb92e812829a6688ffaeae9c042f088e";
let searchBtn = $(".searchBtn")
let searchInput = $(".searchInput");
let cityNameE1 = $(".cityName");
let currentDateE1 = (".currentDate");
let weatherIconE1 = (".weatherIcon");
let searchHistoryE1 = (".historyItems");
let tempE1 = $(".temp");
let humidityE1 = $(".humidity");
let windSpeedE1 = (".windspeed");
let uvIndexE1 = (".uvIndex");
let cardRow = (".cardRow")

var today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
var today = mm + '/' + dd + '/' + yyyy;

if (JSON.parse(localStorage.getItem("searchHistory")) ===null) {
    console.log("searchHistory not found")
}
else{
    console.log("searchHistory loaded in searchHistoryArr");
    renderSearchHistory();
}
searchBtn.on("click", function(e) {
    e.preventDefault();
    if (searchInput.val() === "") {
        alert("you must enter a city");
        return;
    }
    console.log("clicked")
    getWeather(searchInput.val());
});
$(document).on("click", "historyEntry", function() {
    console.log("clicked history")
    let thisElement = $(this);
    getWeather(thisElement.text());
})

function renderSearchHistory(cityName) {
    searchHistoryE1.empty();
    let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
    for (let i = 0; i < searchHistoryArr.length; i++){
        let newlistItem = $("<li>").attr("class", "historyEntry")
        newlistItem.text(searchHistoryArr[1]);
        searchHistoryE1.prepend(newlistItem);
    }
}
function renderWeatherData(cityName, cityTemp, cityHumidity, cityWindSpeed, cityWeatherIcon, uvVal) {
    cityNameE1.text(cityName);
    currentDateE1.text('(${today})');
    tempE1.text('temperature: ${cityTemp} °F');
    humidityE1.text('Humidity: ${cityHumidity}%');
    windSpeedE1.text('Wind Speed: ${cityWindSpeed} MPH');
    uvIndexE1.text('UV Index: ${uvVal}');
    weatherIconE1.attr("src", cityWeatherIcon);

}
function getWeather(desiredCity) {
    let queryUrl = 
        "https://api.openweathermap.org/data/2.5/weather?q=${desiredCity}&APPID+${apiKey}&units=imperial";
    $.ajax({
        url: queryUrl,
        method: "GET",    
    }).then(function(weatherData) {
        var temp= document.getElementsByClassName("temp");
        temp.innerHTML = weatherData.temp
    
    })
}
    let cityObj = {
            cityName: weatherData.name,
            cityTemp: weatherData.main.temp,
            cityHumidity: weatherData.main.humidity,
            cityWindSpeed: weatherDatawind.speed,
            cityUVIndex: weatherData.coord,
            cityWeatherIconName: weatherData.weather[0].icon
        }
        let queryUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=${cityObj.cityUVIndex.lat}&lon=${cityObj.cityUVIndex.lon}&APPID=${apikey}&units=imperial'
        $.ajax({
            url: queryUrl,
            method: 'GET'
        })
        .then(function(uvData) {
            if (JSON.parse(localStorage.getItem("searchHistory")) === null) {
                let searchHistoryArr = [];
                if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                    searchHistoryArr.push(cityObj.cityName);
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                    let renderedWeatherIcon = 'https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png';
                    renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                    renderSearchHistory(cityObj.cityName);               
            //     }
            // }else{
            //     console.log("city already in searchHistory. not adding to history list")
            //     let renderedWeatherIcon = 'https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png';
            //         renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }
        else{
            let searchHistoryArr = JSON.parse(localStorage.getItem("searchHistory"));
            if (searchHistoryArr.indexOf(cityObj.cityName) === -1) {
                searchHistoryArr.push(cityObj.cityName);
                localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
                let renderedWeatherIcon = 'https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png';
                renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
                    renderSearchHistory(cityObj.cityName);
            }else{
                console.log("City already in search history, Not adding to history list")
                let renderedWeatherIcon = 'https:///openweathermap.org/img/w/${cityObj.cityWeatherIconName}.png';
                    renderWeatherData(cityObj.cityName, cityObj.cityTemp, cityObj.cityHumidity, cityObj.cityWindSpeed, renderedWeatherIcon, uvData.value);
            }}
            function getFiveDayForcast() {
                cardRow.empty();
                let queryUrl = 'https://api.openweathermap.org/data/2.5/forcast?q=${desiredCity}&APPID+${apiKey}&units=imperial';
                $.ajax({
                    url: queryUrl,
                    method: "GET"
                
                })
                .then(function(FiveDayResponse){
                    for (let i = 0; i != FiveDayResponse.list.length; i+=8 ) {
                        let cityObj = {
                            date: FiveDayResponse.list[i].dt_txt,
                            icon: FiveDayResponse.list[i].weather[0].icon,
                            temp: FiveDayResponse.list[i].main.temp,
                            humidity: FiveDayResponse.list[i].main.humidity
                        }
                        let dateStr = cityObj.date;
                        let trimmedDate = dateStr.substring(0, 10);
                        let weatherIco = 'https:///openweathermap.org/img/w/${cityObj.Icon}.png';
                        createForcastCard (trimmedDate, weatherIco, cityObj.temp, cityObj.humidity);
                    }
                })
    }
    function createForcastCard(date, icon, temp, humidity){
        let FiveDayCardE1 = $("<div>").attr("class", "five-day-card");
        let cardDate = $("<h3>").attr("class", "card-text");
        let cardIcon = $("<img>").attr("class", "weatherIcon");
        let cardTemp = $("<p>").attr("class", "card-text")
        let cardHumidity = $("<p>").attr("class", "card-text")

        cardRow.append(FiveDayCardE1);
        cardDate.text(date);
        cardIcon.attr("src", icon);
        cardTemp.text('Temp: ${temp} °F');
        cardHumidity.text('Humidity: ${humidity}%');
        FiveDayCardE1.append(cardDate, cardIcon, cardTemp, cardHumidity);
}
}
        })
    })
}
