import { API_CONFIG } from "../config/config.mjs";

export async function fetchAllBikeStations() {
  const url = `http://openapi.seoul.go.kr:8088/${API_CONFIG.SEOUL_API_KEY}/json/bikeList/1/1000`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.rentBikeStatus;
  } catch (err) {
    console.log(`API 오류: ${err}`);
  }
}
