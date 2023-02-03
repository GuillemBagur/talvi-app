
const getLocation = (cb) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(cb);
  } else {
    alert("No funciona la localització");
  }
}

const getCityByCoords = async ({coords}) => {
    console.log(coords);
    if(!coords) return false;
    const lat = coords.latitude;
    if(!lat) return false;
    const lon = coords.longitude;
    if(!lon) return false;

    const key = "bcfd2c0354c05abbfec182ba008ed71a";
    const URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${key}`;
    const response = await fetch(URL);
    const [json] = await response.json();
    console.log(json);
    const city = json.name === "Marratxí" ? "Ciutadella de Menorca" : json.name;
    const state = json.state;
    const locationStr = `${city}, ${state}`;
    const locationEl = document.getElementById("location");
    locationEl.innerHTML = locationStr;

}

document.addEventListener("DOMContentLoaded", () => {
    //getLocation(getCityByCoords);
});