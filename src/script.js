const API_KEY = "YOUR_API_KEY";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const messageText = document.getElementById("message");
const weatherBox = document.getElementById("weather");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function showError(text) {
  weatherBox.hidden = true;
  messageText.textContent = text;
}

function showWeather(data) {
  cityName.textContent = data.name + ", " + data.sys.country;
  temperature.textContent = Math.round(data.main.temp) + " °C";
  description.textContent = capitalize(data.weather[0].description);
  humidity.textContent = data.main.humidity + "%";
  wind.textContent = data.wind.speed + " m/s";

  messageText.textContent = "";
  weatherBox.hidden = false;
}

async function getWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  if (API_KEY === "YOUR_API_KEY") {
    showError("Add your API key in script.js first.");
    return;
  }

  weatherBox.hidden = true;
  messageText.textContent = "Loading...";

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
    encodeURIComponent(city) + "&units=metric&appid=" + API_KEY;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      showError("City not found.");
      return;
    }

    if (response.status === 401) {
      showError("Invalid API key. A new key may need a little time to activate.");
      return;
    }

    if (!response.ok) {
      showError("Something went wrong. Please try again.");
      return;
    }

    const data = await response.json();
    showWeather(data);
  } catch (error) {
    showError("Could not connect. Check your internet connection.");
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") getWeather();
});