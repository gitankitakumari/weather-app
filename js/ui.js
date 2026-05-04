let chartInstance = null;

export function showLoader() {
  document.getElementById("weatherBox").innerHTML = "⏳ Loading...";
}

export function showError(msg) {
  const alertBox = document.getElementById("alertBox");
  alertBox.innerText = msg;
  alertBox.style.display = "block";
  setTimeout(() => (alertBox.style.display = "none"), 3000);
}

export function updateWeatherUI(weather) {
  document.getElementById("weatherBox").innerHTML = `
    <h2>${weather.name}</h2>
    <h1>${Math.round(weather.main.temp)}°C</h1>
    <p>${weather.weather[0].description}</p>
    <p>💧 ${weather.main.humidity}% | 💨 ${weather.wind.speed} m/s</p>
  `;
}

export function updateExtras(aqi, uv) {
  const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
  document.getElementById("aqiValue").innerText = aqiText[aqi];
  document.getElementById("uvValue").innerText = uv;
}

export function updateChart(forecast) {
  const temps = forecast.list.slice(0, 8).map(i => i.main.temp);
  const labels = forecast.list.slice(0, 8).map((_, i) => `${i * 3}h`);

  if (chartInstance) chartInstance.destroy();

  const ctx = document.getElementById("tempChart").getContext("2d");

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Temp",
        data: temps
      }]
    }
  });
}