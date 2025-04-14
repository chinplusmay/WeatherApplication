    const apiKey = "APIKEY";
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=mumbai&unit=metric";

    const locationInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchBtn");

    const card1 = document.getElementById("card1");
    const currentWeatherContent = document.getElementById("currentWeatherContent");
    const card2 = document.getElementById("card2");
    const searchedWeatherContent = document.getElementById("searchedWeatherContent");


    const errorContainer1 = document.createElement("div");
    errorContainer1.className = "error-container";
    card1.appendChild(errorContainer1);
    const errorContainer2 = document.createElement("div");
    errorContainer2.className = "error-container";
    card2.appendChild(errorContainer2);

    const weatherIcons = {
        clear: "sunny.png",
        rain: "rainy-day.png",      
        drizzle: "drizzle.png",
        clouds: "cloudy.png",
        snow: "snow.png",
        thunderstorm: "thunderstorm.png",
        storm: "thunderstorm.png",
        mist: "fog.png",
        fog: "fog.png",
        haze: "haze.png"
    };

    document.addEventListener("DOMContentLoaded", () => {
        getCurrentGeoLocation(); // get our city's location

        searchButton.addEventListener("click", searchLocation); // search location on click
        locationInput.addEventListener("keypress", (e) =>{  // search location on enter
            if(e.key === "Enter"){
                console.log("enter")
                searchLocation();
            }
        });
    });


    function getCurrentGeoLocation(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition( (position) => {
                const lon = position.coords.longitude;
                const lat = position.coords.latitude;
                getLocationByCoords(lat,lon,true,currentWeatherContent);
            },
            (error) => {
                showError(errorContainer1, `Location Access Denied.. ${error.message}`);
            }
            
        );
        }else{
            (error) => {
                showError(errorContainer1, `Geolocation is Not Supported By this browser ${error.message}`);
            }
        }

    }


    // Search Entered Location
    function searchLocation(){
        const location = locationInput.value.trim();
        if(location === ''){
            console.log("ss");
            showError(errorContainer2, `Please enter a location`);
            return;
        }
        // searchedCity.textContent = "Searching...";
        clearError(errorContainer2);
        fetchWeatherByCity(location,searchedWeatherContent);
    }
    async function getLocationByCoords(lat,lon,isCurrent,currentWeatherContent) {
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        fetchWeather(url, isCurrent,currentWeatherContent); 
    } 

    function fetchWeatherByCity(location){
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
        fetchWeather(url, false,searchedWeatherContent);
    }


    async function fetchWeather(url, isCurrent, weatherElement){
        try {
            const res = await fetch(url);
            if(!res){
                if(res.status === 404){
                    throw new error("City Not Found");
                }  
                throw new error(`HTTP Error, Status:${res.status}`);
            }
            const jsonData = await res.json();
            if(isCurrent){
                updateCurrentWeather(jsonData, weatherElement);
                clearError(errorContainer1);
            }else{
                updateSearchedWeather(jsonData, weatherElement);
                clearError(errorContainer2);
            }
            
        } catch (error) {
            console.error(`Unable to fetch Error: ${error}`);
            if(isCurrent){
                showError(errorContainer1, error.message);
                // currentCity.textContent = "Error loading data";
            }else{
                showError(errorContainer2, error.message);
                // searchedCity.textContent = "Error loading";
            }
        }
    }

    function updateCurrentWeather(data, displayELement){
        const {name, sys, main, wind, weather} = data; //const name =  data.name
        const weatherHTML = `
                <div class="location-name">${name}, ${sys.country}</div>
                <div class="weather-main">
                    <img src="assets/${getWeatherIcon(weather[0].main.toLowerCase())}" alt="${data.weather[0].description}" class="weather-icon">
                    <div class="temperature">${Math.round(main.temp)}°C</div>
                </div>
                <div class="weather-description">${data.weather[0].description}</div>
                <div class="feels-like">Feels like: ${Math.round(data.main.feels_like)}°C</div>
                
                <div class="extra-info">
                    <div class="info-item">
                        <div>Humidity</div>
                        <div>${data.main.humidity}%</div>
                    </div>
                    <div class="info-item">
                        <div>Wind</div>
                        <div>${Math.round(wind.speed * 3.6)} km/h</div>
                    </div>
                </div>
            `;
        displayELement.innerHTML = weatherHTML;    
    }

    function updateSearchedWeather(data, displayELement){
        const {name, sys, main, wind, weather} = data;
        const weatherHTML = `
                <div class="location-name">${name}, ${sys.country}</div>
                <div class="weather-main">
                    <img src="assets/${getWeatherIcon(weather[0].main.toLowerCase())}" alt="${data.weather[0].description}" class="weather-icon">
                    <div class="temperature">${Math.round(main.temp)}°C</div>
                </div>
                <div class="weather-description">${data.weather[0].description}</div>
                <div class="feels-like">Feels like: ${Math.round(data.main.feels_like)}°C</div>
                
                <div class="extra-info">
                    <div class="info-item">
                        <div>Humidity</div>
                        <div>${data.main.humidity}%</div>
                    </div>
                    <div class="info-item">
                        <div>Wind</div>
                        <div>${Math.round(wind.speed * 3.6)} km/h</div>
                    </div>
                </div>
            `;
        displayELement.innerHTML = weatherHTML;    

    }




    function getWeatherIcon(condition){
        condition = condition.toLowerCase();
        for(const key in weatherIcons){
            if(condition.includes(key)){
                return weatherIcons[key];
            }
            // return "cloudy.png"; // default icon
        }

        
    }


    function showError(container, message){
        if(container){
            container.innerHTML = `<div class="error">${message}</div>`;
            setTimeout( () => {
                clearError(container)
            },3000);
        }
    }

    function clearError(container){
        if(container)   container.innerHTML = ' ';
    }







    // async function getWeather() {
    //     const response = await fetch(apiUrl + `&appid=${apiKey}`);
    //     var data = await response.json();   
    //     console.log(data);

    //     document.querySelector(".city").innerHTML = data.name;
    // }

    // getWeather(); 







    // const API_URL = "https://api.github.com/users/chinplusmay"

    // async function fetcher() {
    //     const dat = await fetch(API_URL);  // resolves to -> Response Object = dat
    //     console.log(dat);
    //     const resJSON = await dat.json();    // resolves to -> JSON data = resJSON
    //     console.log(resJSON);

    //     const resText = await dat.text();
    //     // console.log(resText);
    // }

    // fetcher();