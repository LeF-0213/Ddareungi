import { API_CONFIG } from "../config/config.mjs";
import { fetchAllBikeStations } from "./api.mjs";
import { initMap, addMarkers, moveToCurrentLocation } from "./map.mjs";
import { displayStats, displayStationList } from "./ui.mjs";

const script = document.createElement("script");
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_CONFIG.KAKAO_MAP_KEY}&libraries=services`;
script.type = "text/javascript";
document.head.appendChild(script);

document.addEventListener("DOMContentLoaded", async () => {
  const { map: m, clusterer: c } = initMap();
  map = m;
  clusterer = c;
  const stations = await fetchAllBikeStations();
  addMarkers(stations);
  displayStats(stations);
  displayStationList(stations);
  moveToCurrentLocation();
});

function setupEventListeners() {
  document.getElementById('currentLocationBtn').addEventListener('click', moveToCurrentLocation);
  document.getElementById('refreshBtn').addEventListener('click', fetchAllBikeStations);
}
