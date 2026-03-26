// lib/weather.ts

export async function getWeatherData(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum&timezone=auto`;
  
  const res = await fetch(url, { next: { revalidate: 900 } }); // Cache 15 min
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export async function getAllWeatherData(resorts: any[]) {
  return Promise.all(
    resorts.map(r => getWeatherData(r.lat, r.lon))
  );
}