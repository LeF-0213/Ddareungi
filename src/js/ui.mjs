export function displayStats(stations) {
  const totalStation = stations.list_total_count;
  let totalBikes = 0;
  stations.row.forEach((station) => {
    totalBikes += parseInt(station.parkingBikeTotCnt);
  });

  document.getElementById("totalStaions").textContent =
    totalStation.toLocaleString();
  document.getElementById("totalBikes").textContent =
    totalBikes.toLocaleString();
}

export function displayStationList(stations) {
  const stationList = document.getElementById("stationList");

  const sorted = stations.row.sort(
    (a, b) =>
      parseInt(b.stationLatitude) +
      parseInt(b.stationLongitude) -
      (parseInt(a.parkingBikeTotCnt) + parseInt(a.stationLongitude))
  );

  stationList.innerHTML = sorted.map((station, idx) => {
    const bikeCount = parseInt(station.parkingBikeTotCnt);
    const isAvailable = bikeCount >= 5;

    const geocoder = new kakao.maps.services.Geocoder();
    let adres = "";
    geocoder.coord2Address(
      station.stationLongitude,
      station.stationLatitude,
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          adres = result[0].address.address_name;
        }
      }
    );

    return `
      <div class="station-item" onclick="focusStation(${idx})">
        <div class="station-name">${station.stationName}</div>
        <div class="station-info">
          <span>${adres}</span>
          <span class="bike-count ${isAvailable ? "available" : "unavailable"}">
            ${bikeCount}
          </span>
        </div>
      </div>
    `;
  });
}

export function focusStation(stations, idx) {
  const sorted = stations.row.sort(
    (a, b) =>
      parseInt(b.stationLatitude) +
      parseInt(b.stationLongitude) -
      (parseInt(a.stationLatitude) + parseInt(a.stationLongitude))
  );
  const station = sorted[idx];
  const lat = parseFloat(station.latitude);
  const lng = parseFloat(station.longitude);

  map.setCenter(new kakao.maps.LatLng(lat, lng));

  const marker = marker.find(
    (m) => m.getPosition().getLat() === lat && m.getPosition().getLng() === lng
  );

  // if (marker) {
  //   const index = addMarkers.indexOf(marker)
  //   infoWindows.forEach(iw => iw.close())
  //   infoWindows[idx].open(map, marker);
  // }
}
