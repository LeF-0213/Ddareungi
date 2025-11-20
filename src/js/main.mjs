import { API_CONFIG } from "../config/config.mjs";
import { fetchAllBikeStations } from "./api.mjs";
import { initMap, addMarkers, moveToCurrentLocation } from "./map.mjs";
import { displayStats, displayStationList } from "./ui.mjs";

function loadKakaoMapSDK() {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      kakao.maps.load(() => resolve());
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${API_CONFIG.KAKAO_MAP_KEY}&autoload=false&libraries=clusterer,services`;
    script.onload = () => {
      kakao.maps.load(() => {
        resolve();
      });
    };
    document.head.appendChild(script);
  });
}

loadKakaoMapSDK().then(() => {
  console.log("Kakao Map SDK Loaded");
  startApp();
});

async function startApp() {
  const { map, clusterer } = initMap();
  const stations = await fetchAllBikeStations();
  addMarkers(stations, map);
  displayStats(stations, map, clusterer);
  displayStationList(stations);
  // moveToCurrentLocation();
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
