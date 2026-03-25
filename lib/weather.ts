export async function getWeatherData(lat: number, lon: number) {
  // Tražimo prognozu za 10 dana (forecast_days=10) da bi preloading radio
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation,weather_code&forecast_days=10&timezone=auto`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('API Error');
  const data = await res.json();

  return {
    current: {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDir: data.current.wind_direction_10m
    },
    hourly: data.hourly // Ovo šaljemo u page.tsx za instant filtriranje
  };
}