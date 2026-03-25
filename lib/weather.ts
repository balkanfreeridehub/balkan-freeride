export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    // Vučemo maksimalnih 10 dana koje WeatherAPI nudi
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=10&aqi=no&alerts=no`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();

    if (!data || !data.current || !data.forecast) return null;

    const current = data.current;
    const forecastDays = data.forecast.forecastday;

    // Pakujemo samo Precip i Temp po danima, baš kao u tvojoj tabeli
    const dailyData = forecastDays.map((d: any) => ({
      precip: d.day.totalprecip_mm || 0,
      avgTemp: d.day.avgtemp_c
    }));

    return {
      temp: Math.round(current.temp_c),
      windSpeed: Math.round(current.wind_kph / 3.6),
      windDir: current.wind_degree,
      condition: current.condition.text,
      dailyForecast: dailyData // Niz od 10 objekata
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}