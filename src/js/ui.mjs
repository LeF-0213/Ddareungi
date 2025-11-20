import { focusStation } from "./map.mjs";

export function displayStats(stations) {
  const totalStation = stations.list_total_count;
  let totalBikes = 0;
  stations.row.forEach((station) => {
    totalBikes += parseInt(station.parkingBikeTotCnt);
  });

  document.getElementById("totalStations").textContent =
    totalStation.toLocaleString();
  document.getElementById("totalBikes").textContent =
    totalBikes.toLocaleString();
}

export async function displayStationList(stations) {
  const stationList = document.getElementById("stationList");

  const sorted = stations.row.sort(
    (a, b) => parseInt(b.parkingBikeTotCnt) - parseInt(a.parkingBikeTotCnt)
  );

  stationList.innerHTML = "";

  for (let i = 0; i < sorted.length; i++) {
    const station = sorted[i];
    const bikeCount = parseInt(station.parkingBikeTotCnt);
    const isAvailable = bikeCount >= 5;

    const adres = await getAddressFromCoords(
      station.stationLatitude,
      station.stationLongitude
    );

    const stationItem = document.createElement("div");
    stationItem.className = "station-item";
    stationItem.onclick = () => focusStation(i, sorted);
    stationItem.innerHTML = `
      <div class="station-name">${station.stationName}</div>
      <div class="station-info">
        <span>${adres}</span>
        <span class="bike-count ${isAvailable ? "available" : "unavailable"}">
          ${station.parkingBikeTotCnt}
        </span>
      </div>
    `;

    stationList.appendChild(stationItem);
  }
}

async function getAddressFromCoords(lat, lng) {
  return new Promise((resolve, reject) => {
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        resolve(result[0].address.address_name);
      } else {
        reject(null);
      }
    });
  });
}
