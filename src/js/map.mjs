export function initMap() {
  const map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(37.4983, 127.0286),
    level: 6,
  });
  const clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minLevel: 10, // 클러스터 할 최소 지도 레벨
  });
  return { map, clusterer };
}

export function displayMarkers(stations) {
  let map;
  let markers = [];
  let infoWindows = [];
  let clusterer;

  stations.forEach((station, idx) => {
    const lat = parseFloat(station.latitude);
    const lng = parseFloat(station.longitude);
    const bikeCount = parseInt(station.parkingBikeTotCnt);

    const imageUrl =
      bikeCount >= 5
        ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_green.png"
        : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";

    const markerImage = new kakao.maps.MarkerImage(
      imageUrl,
      new kakao.maps.Size(31, 35),
      new kakao.maps.Point(16, 34)
    );

    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(lat, lng),
      image: markerImage,
      title: station.stationName,
    });

    const geocoder = new kakao.maps.services.Geocoder();
    let adres = "";
    geocoder.coord2Address(
      station.stationLatitude,
      station.stationLongitude,
      function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          adres = result[0].address.address_name;
        }
      }
    );

    const infoWindow = new kakao.maps.InfoWindow({
      content: `
          <div style="padding: 12px; font-size: 13px; min-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 8px; color: #333;">${station.stationName}</div>
              <div style="margin-bottom: 6px;">
                  <span style="color: #666;">자전거:</span> 
                  <span style="font-weight: bold; color: #27ae60;">${bikeCount}개</span>
              </div>
              <div style="margin-bottom: 6px;">
                  <span style="color: #666;">보관소:</span> 
                  <span style="font-weight: bold;">${station.rackTotCnt}개</span>
              </div>
              <div style="font-size: 12px; color: #999; margin-top: 8px;">
                  주소: ${adres}
              </div>
          </div>
      `,
      removable: true,
    });

    kakao.maps.event.addListener(marker, "click", function () {
      infoWindows.forEach((iw) => iw.close());
      infoWindow.open(map, marker);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
    clusterer.addMarker(marker);
  });
}

export function addMarkers(stations) {
  stations.rentBikeStatus.row.forEach((station) => {
    const marker = new kakao.maps.Marker({
      map: map,
      position: new kakao.maps.LatLng(
        station.stationLatitude,
        station.stationLongitude
      ),
    });
  });
}

export function moveToCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        map.setCenter(
          new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          )
        );
        map.setLevel(6);
      },
      () => alert("위치 정보를 가져올 수 없습니다.")
    );
  }
}
