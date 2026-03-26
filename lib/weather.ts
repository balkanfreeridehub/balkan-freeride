export async function getAllWeatherData(resorts: any[]) {
  const lats = resorts.map(r => r.lat).join(',');
  const lons = resorts.map(r => r.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation,weather_code&forecast_days=10&timezone=auto`;
  
  const res = await fetch(url);
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}