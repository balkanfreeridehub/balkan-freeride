export async function getWeatherData(lat: number, lon: number) {
  try {
    // Koristimo Open-Meteo jer on daje direktan "snowfall" podatak u cm
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation&hourly=snowfall&timezone=auto`
    );
    const data = await res.json();

    if (!data.current) return null;

    // Uzimamo prosek snega u narednih 6 sati kao bazu za jedan sat
    const next6hSnow = data.hourly.snowfall.slice(0, 6).reduce((a: number, b: number) => a + b, 0);
    const hourlySnowBase = next6hSnow / 6;

    return {
      temp: Math.round(data.current.temperature_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDir: data.current.wind_direction_10m,
      condition: data.current.weather_code, // Šaljemo samo kod, Page će ga prevesti
      precip: data.current.precipitation || 0,
      // Šaljemo bazni sneg po satu da bi množenje u page.tsx radilo za bilo koji tajmspan
      forecast: hourlySnowBase > 0 ? hourlySnowBase : 0 
    };
  } catch (e) {
    console.error("Weather Error:", e);
    return null;
  }
}