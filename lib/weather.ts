export async function getAllWeatherData(resorts: any[]) {
  const lats = resorts.map(r => r.lat).join(',');
  const lons = resorts.map(r => r.lon).join(',');
  
  // Šaljemo sve koordinate odjednom
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation,weather_code&forecast_days=10&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API limit or error");
  const data = await res.json();
  
  // Open-Meteo vraća niz objekata ako mu pošaljemo niz koordinata
  return Array.isArray(data) ? data : [data];
}