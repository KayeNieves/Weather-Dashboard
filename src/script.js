const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const messageText = document.getElementById("message");
const weatherBox = document.getElementById("weather");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const weatherCodes = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Freezing fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
};

function getDescription(code) {
  return weatherCodes[code] || "Unknown";
}

function showError(text) {
  weatherBox.hidden = true;
  messageText.textContent = text;
}

function showWeather(place, current) {
  let name = place.name;
  if (place.country) {
    name = name + ", " + place.country;
  }

  cityName.textContent = name;
  temperature.textContent = Math.round(current.temperature_2m) + " °C";
  description.textContent = getDescription(current.weather_code);
  humidity.textContent = current.relative_humidity_2m + "%";
  wind.textContent = current.wind_speed_10m + " km/h";

  messageText.textContent = "";
  weatherBox.hidden = false;
}

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  weatherBox.hidden = true;
  messageText.textContent = "Loading...";

  const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(city) + "&count=1&language=en&format=json";

  try {
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      showError("Something went wrong. Please try again.");
      return;
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showError("City not found.");
      return;
    }

    const place = geoData.results[0];

    const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude + "&longitude=" + place.longitude +
      "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      showError("Something went wrong. Please try again.");
      return;
    }

    const weatherData = await weatherResponse.json();
    showWeather(place, weatherData.current);
  } catch (error) {
    showError("Could not connect. Check your internet connection.");
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") getWeather();
});