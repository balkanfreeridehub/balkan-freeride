// Pomoćna funkcija za čekanje
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getWeatherData(lat: number, lon: number, index: number = 0) {
  // Dodajemo delay na osnovu indexa planine (npr. 1. planina 0ms, 2. planina 150ms...)
  await delay(index * 150); 

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation,weather_code&forecast_days=10&timezone=auto`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return null; // Vrati null ako je 429, da ne puca Promise.all
    const data = await res.json();

    return {
      current: {
        temp: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        windDir: data.current.wind_direction_10m
      },
      hourly: data.hourly
    };
  } catch (e) {
    return null; // Sigurnosna mreža
  }
}