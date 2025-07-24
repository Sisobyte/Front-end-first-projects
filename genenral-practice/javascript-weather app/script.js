function getWeatherData() {
    const apiKey = "71583692235300a224a350cafef6ea7a";
    const city = document.getElementById("city-input").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error fetching current weather data:", error);
            alert("Error fetching current weather data. Please try again.");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error("Error fetching forecast data:", error);
            alert("Error fetching forecast data. Please try again.");
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("weather-info");
    const weatherIcon = document.getElementById("weather-icon");
    const hourlyForecastDiv = document.getElementById("hourly-forecast");

    // Clear previous data
    tempDivInfo.innerHTML = "";
    weatherInfoDiv.innerHTML = "";
    hourlyForecastDiv.innerHTML = "";

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHtml = `<p>Temperature: ${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHtml;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById("hourly-forecast");
    const next24Hours = hourlyData.slice(0, 8); // Get the next 8 entries (24 hours)
    hourlyForecastDiv.innerHTML = ""; // Clear previous data

    next24Hours.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const temperature = Math.round(entry.main.temp);
        const iconCode = entry.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hours}:00</span>
                <img src="${iconUrl}" alt="Weather icon">
                <p>${temperature}°C</p>
            </div>`;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.style.display = "block"; // Show the weather icon
}

// 🔗 Connect the search button to the function
document.getElementById("search-button").addEventListener("click", getWeatherData);
