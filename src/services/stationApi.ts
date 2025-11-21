
const BASE_URL = '/inha-capstone-03';

export interface StationData {
  data: {
    station_id: number;
    line: string;
    name: string;
    lat: string | number;
    lng: string | number;
    station_cd: string;
  }
}

export interface TransferConvenienceData {
  data: {
    station_cd: string;
    station_name: string;
    convenience_score: number;
  }
}

export async function getStationById(stationId: string): Promise<StationData> {
  // Note: The user provided the URL with "staions", which might be a typo for "stations".
  // Using the provided URL first.
  const response = await fetch(`${BASE_URL}/stations/${stationId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch station data for ID: ${stationId}`);
  }
  return response.json();
}

export async function getTransferConvenience(stationCd: string): Promise<TransferConvenienceData> {
  const response = await fetch(`${BASE_URL}/transfer-convenience/${stationCd}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch transfer convenience for station code: ${stationCd}`);
  }
  return response.json();
}
