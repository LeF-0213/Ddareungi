import { API_CONFIG } from "../config/config.mjs";
import { fetchAllBikeStations } from "./api.mjs";
import { initMap, addMarkers, moveToCurrentLocation } from "./map.mjs";
import { displayStats, displayStationList } from "./ui.mjs";

const script = document.createElement("script");
// script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_CONFIG.KAKAO_MAP_KEY}&libraries=clusterer,services`;
script.src = `https://dapi.kakao.cosm/v2/maps/sdk.js?appkey=62fc5e6d6a9fb9a94b0411c55f39e1ed&libraries=clusterer,services`;
script.type = "text/javascript";
script.onload = () => {
  console.log("Kakao Map SDK Loaded");
  startApp();
};
document.head.appendChild(script);

async function startApp() {
  const { map, clusterer } = initMap();
  const stations = await fetchAllBikeStations();
  addMarkers(stations, map);
  displayStats(stations, map, clusterer);
  displayStationList(stations);
  moveToCurrentLocation(map);
}

// document.addEventListener("DOMContentLoaded", async () => {

// });

function setupEventListeners() {
  document
    .getElementById("currentLocationBtn")
    .addEventListener("click", moveToCurrentLocation);
  document
    .getElementById("refreshBtn")
    .addEventListener("click", fetchAllBikeStations);
}
