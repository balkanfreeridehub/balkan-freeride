const BASE_URL = "https://api.open-meteo.com/v1/forecast";

export async function getWeatherData(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day",
    hourly: "temperature_2m,precipitation,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "10"
  });

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Weather API Error");
    return res.json();
  } catch (e) {
    console.error("Single fetch error:", e);
    return null;
  }
}

export async function getAllWeatherData(resorts: any[]) {
  if (!resorts || resorts.length === 0) return [];
  const lats = resorts.map(r => r.lat).join(",");
  const lons = resorts.map(r => r.lon).join(",");

  const params = new URLSearchParams({
    latitude: lats,
    longitude: lons,
    current: "temperature_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation",
    timezone: "auto",
    forecast_days: "10"
  });

  try {
    const res = await fetch(`${BASE_URL}?${params.toString()}`, { mode: 'cors' });
    if (!res.ok) throw new Error("Batch API Error");
    const data = await res.json();
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Batch fetch error:", error);
    return resorts.map(() => ({})); 
  }
}