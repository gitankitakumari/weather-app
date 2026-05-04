export function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("history") || "[]");
  history = [city, ...history.filter(c => c !== city)].slice(0, 5);
  localStorage.setItem("history", JSON.stringify(history));
}

export function renderHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  document.getElementById("historyList").innerHTML =
    history.map(c => `<div onclick="searchCity('${c}')">${c}</div>`).join("");
}

export function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}