/**
 * LIB: Weather Service
 * Optimizovano za Batch Request (izbegava 429 error)
 */

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation",
    timezone: "auto",
    forecast_days: "10"
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Weather API Error");
  return res.json();
}

/**
 * Grupni dohvat podataka za sve planine odjednom
 * Ovo rešava "Too Many Requests" problem
 */
export async function getAllWeatherData(resorts: any[]) {
  // Spajamo sve koordinate u zareze: lat1,lat2,lat3...
  const lats = resorts.map(r => r.lat).join(",");
  const lons = resorts.map(r => r.lon).join(",");

  const params = new URLSearchParams({
    latitude: lats,
    longitude: lons,
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation",
    timezone: "auto",
    forecast_days: "10"
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  
  if (!res.ok) {
    console.error("Batch Weather API Error:", await res.text());
    throw new Error("Batch Weather API Error");
  }

  const data = await res.json();

  // Ako je prosleđeno više koordinata, Open-Meteo vraća niz objekata
  // Ako je samo jedna, vraća jedan objekat, pa ga pretvaramo u niz
  return Array.isArray(data) ? data : [data];
}