const API_KEY = "your_api_key_here";

// 🔍 Weather
export async function fetchWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) throw new Error("City not found");

    return await res.json();
  } catch {
    throw new Error("Weather fetch failed");
  }
}

// 📊 Forecast
export async function fetchForecast(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    return await res.json();
  } catch {
    throw new Error("Forecast fetch failed");
  }
}

// 🌫️ AQI
export async function fetchAQI(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return await res.json();
  } catch {
    throw new Error("AQI fetch failed");
  }
}

// ☀️ UV (NEW API)
export async function fetchUV(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    return { value: data.current?.uvi || 0 };
  } catch {
    throw new Error("UV fetch failed");
  }
}

// 📍 Weather by coordinates
export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  return res.json();
}

// 📍 Forecast by coordinates
export async function fetchForecastByCoords(lat, lon) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  return res.json();
}