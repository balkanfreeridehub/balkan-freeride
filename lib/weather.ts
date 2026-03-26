export async function getWeatherData(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation&timezone=auto`;
  const res = await fetch(url, { next: { revalidate: 900 } });
  return res.json();
}

export async function getAllWeatherData(resorts: any[]) {
  return Promise.all(resorts.map(r => getWeatherData(r.lat, r.lon)));
}