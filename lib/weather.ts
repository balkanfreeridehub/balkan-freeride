export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no`,
      { next: { revalidate: 3600 } } // Keširanje sat vremena
    );
    const data = await res.json();

    if (!data || !data.current || !data.forecast) return null;

    const current = data.current;
    const forecastDays = data.forecast.forecastday;
    
    // Sabiramo padavine za danas i sutra (ukupno 48h)
    const totalPrecip = (forecastDays[0]?.day.totalprecip_mm || 0) + (forecastDays[1]?.day.totalprecip_mm || 0);
    const hourlyBase = totalPrecip / 48;

    // Granica za sneg na planini
    const isCold = current.temp_c < 4;
    const snowForecast = isCold ? (hourlyBase * 1.2) : 0;

    return {
      temp: Math.round(current.temp_c),
      windSpeed: Math.round(current.wind_kph / 3.6),
      windDir: current.wind_degree,
      condition: current.condition.text,
      forecast: snowForecast
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}