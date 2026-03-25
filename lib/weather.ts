export async function getWeatherData(locationId: string) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${locationId}&days=10&aqi=no`,
      { next: { revalidate: 1800 } } // Osvežavanje na 30 min
    );
    const data = await res.json();

    if (!data || !data.current) return null;

    return {
      temp: Math.round(data.current.temp_c),
      windSpeed: Math.round(data.current.wind_kph / 3.6),
      windDir: data.current.wind_degree,
      condition: data.current.condition.text,
      dailyForecast: data.forecast.forecastday.map((d: any) => ({
        precip: d.day.totalprecip_mm || 0,
        avgTemp: d.day.avgtemp_c
      }))
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}