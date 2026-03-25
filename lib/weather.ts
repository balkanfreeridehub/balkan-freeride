export async function getWeatherData(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation&hourly=snowfall,precipitation&timezone=auto`
    );
    const data = await res.json();

    if (!data.current) return null;

    // Uzimamo prosek snega ILI ukupnih padavina u narednih 6h
    // Ako je hladno, precipitation (kiša) se računa kao sneg
    const temp = data.current.temperature_2m;
    const hourlySnow = data.hourly.snowfall.slice(0, 6).reduce((a: number, b: number) => a + b, 0) / 6;
    const hourlyPrecip = data.hourly.precipitation.slice(0, 6).reduce((a: number, b: number) => a + b, 0) / 6;

    // Ako API ne vidi "snowfall", ali vidi "precipitation" na minusu, to je sneg!
    const effectiveSnow = (temp < 1 && hourlySnow === 0) ? hourlyPrecip : hourlySnow;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDir: data.current.wind_direction_10m,
      condition: data.current.weather_code,
      precip: data.current.precipitation || 0,
      // Šaljemo finalnu vrednost snega po satu
      forecast: effectiveSnow > 0 ? effectiveSnow : 0 
    };
  } catch (e) {
    console.error("Weather Error:", e);
    return null;
  }
}