import { 
  fetchWeather, 
  fetchForecast, 
  fetchAQI, 
  fetchUV,
  fetchWeatherByCoords,
  fetchForecastByCoords
} from "./api.js";

import { 
  showLoader, 
  showError, 
  updateWeatherUI, 
  updateExtras, 
  updateChart 
} from "./ui.js";

import { 
  saveHistory, 
  renderHistory, 
  getLocation 
} from "./utils.js";

window.searchCity = async function (cityInput) {
  const city = cityInput || document.getElementById("city").value.trim();
  if (!city) return showError("Enter city");

  try {
    showLoader();

    // ✅ correct
    const weather = await fetchWeather(city);
    const forecast = await fetchForecast(city);

    updateWeatherUI(weather);
    updateChart(forecast);

    const lat = weather?.coord?.lat;
    const lon = weather?.coord?.lon;

    if (!lat || !lon) {
      showError("Invalid location data");
      return;
    }

    const aqi = await fetchAQI(lat, lon);

    const aqiValue = aqi?.list?.[0]?.main?.aqi ?? 1;

    // ✅ UV disabled (safe)
    updateExtras(aqiValue - 1, 0);

    saveHistory(city);
    renderHistory();

  } catch (err) {
    showError(err.message);
  }
};
renderHistory();
// 🌙 Theme
window.toggleTheme = function () {
  document.body.classList.toggle("dark-mode");
};

// 🌐 Language toggle
let currentLang = "en";

window.toggleLanguage = function () {
  currentLang = currentLang === "en" ? "hi" : "en";

  const btn = document.getElementById("langToggle");
  btn.innerText = currentLang === "en" ? "🌐 EN" : "🌐 HI";

  translateUI();
};
function translateUI() {
  const isHindi = currentLang === "hi";

  document.querySelector("#weatherBox").innerText =
    isHindi ? "✨ शहर डालो और मौसम जानो" : "✨ Enter a city to feel the forecast";

  document.querySelector(".action-buttons button:nth-child(1)").innerText =
    isHindi ? "🔊 सुनो" : "🔊 Speak";

  document.querySelector(".action-buttons button:nth-child(2)").innerText =
    isHindi ? "📤 शेयर" : "📤 Share";

  document.querySelector(".action-buttons button:nth-child(3)").innerText =
    isHindi ? "📅 सेव" : "📅 Export";

  document.querySelector(".history-title").innerText =
    isHindi ? "📜 हाल की खोज" : "📜 Recent Searches";
}

// 🔊 Speak
window.speakWeather = function () {
  const weatherText = document.getElementById("weatherBox").innerText;

  if (!weatherText || weatherText.includes("Enter a city")) {
    alert("No weather data to speak");
    return;
  }

  const speech = new SpeechSynthesisUtterance(weatherText);

  const isHindi = document.getElementById("langToggle").innerText.includes("HI");

  let voices = speechSynthesis.getVoices();

  // 🔁 If voices empty, reload once
  if (!voices.length) {
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
    };
  }

  let selectedVoice = null;

  if (isHindi) {
    selectedVoice = voices.find(v => v.lang === "hi-IN");
  }

  // fallback (IMPORTANT)
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.includes("en")) || voices[0];
  }

  // 🔐 SAFE ASSIGN
  if (selectedVoice) {
    speech.voice = selectedVoice;
    speech.lang = selectedVoice.lang;
  } else {
    speech.lang = isHindi ? "hi-IN" : "en-US";
  }

  speech.rate = 1;
  speech.pitch = 1;

  speechSynthesis.cancel();
  speechSynthesis.speak(speech);
};
// 📤 Share
window.shareWeatherCard = function () {
  alert("Share feature coming soon");
};

// 📅 Export
window.exportToCalendar = function () {
  alert("Export feature coming soon");
};

// 🎤 Voice search
window.startVoiceSearch = function () {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("Voice recognition not supported in this browser");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();

  recognition.lang = document.getElementById("langToggle").innerText.includes("HI")
    ? "hi-IN"
    : "en-US";

  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onstart = () => {
    showLoader();
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    // input box me fill karo
    document.getElementById("city").value = transcript;

    // auto search trigger
    window.searchCity(transcript);
  };

  recognition.onerror = () => {
    showError("Voice recognition failed");
  };
};
window.getCurrentLocation = async function () {
  try {
    showLoader();

    const pos = await getLocation();
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const weather = await fetchWeatherByCoords(lat, lon);
    const forecast = await fetchForecastByCoords(lat, lon);

    updateWeatherUI(weather);
    updateChart(forecast);

    const aqi = await fetchAQI(lat, lon);
    const aqiValue = aqi?.list?.[0]?.main?.aqi ?? 1;

    updateExtras(aqiValue - 1, 0);

  } catch {
    showError("Location error");
  }
};