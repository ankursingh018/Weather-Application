const apiKey = '1e3e8f230b6064d27976e41163a82b77'; // <-- Replace with your OpenWeatherMap API key

const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherCard = document.getElementById('weather-card');
const cityName = document.getElementById('city-name');
const weatherDesc = document.getElementById('weather-desc');
const temp = document.getElementById('temp');
const tempMin = document.getElementById('temp-min');
const tempMax = document.getElementById('temp-max');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const pressure = document.getElementById('pressure');
const feelsLike = document.getElementById('feels-like');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const weatherIcon = document.getElementById('weather-icon');
const errorMsg = document.getElementById('error-msg');
const dateTime = document.getElementById('date-time');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  showError('');
  showWeatherCard(false);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    updateWeatherUI(data);
    showWeatherCard(true);
  } catch (err) {
    showError('City not found. Please try again.');
  }
});

function updateWeatherUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    weatherDesc.textContent = data.weather[0].description;
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    tempMin.textContent = `${Math.round(data.main.temp_min)}°C`;
    tempMax.textContent = `${Math.round(data.main.temp_max)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    sunrise.textContent = unixToTime(data.sys.sunrise, data.timezone);
    sunset.textContent = unixToTime(data.sys.sunset, data.timezone);
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    weatherIcon.alt = data.weather[0].main;
    dateTime.textContent = formatDateTime(data.dt, data.timezone);
}



function showWeatherCard(show) {
  weatherCard.classList.toggle('hidden', !show);
}

function showError(msg) {
  errorMsg.textContent = msg;
}

function unixToTime(unix, tzOffset) {
  const date = new Date((unix + tzOffset) * 1000);
  return date.toUTCString().match(/\d{2}:\d{2}/)[0];
}

function formatDateTime(unix, tzOffset) {
  const date = new Date((unix + tzOffset) * 1000);
  return date.toUTCString().replace(' GMT', '');
}