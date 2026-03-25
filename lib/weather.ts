export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    // Tražimo prognozu za 3 dana da bismo imali stabilne podatke
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no&alerts=no`
    );
    const data = await res.json();

    if (!data || !data.current) return null;

    const current = data.current;
    const forecastToday = data.forecast.forecastday[0].day;

    // Uzimamo direktan podatak o snegu u CM za danas i delimo sa 24 za bazu po satu
    // WeatherAPI je ovde ekstremno precizan za planinske lokacije
    const hourlySnowBase = (forecastToday.totalsnow_cm || 0) / 24;

    return {
      temp: Math.round(current.temp_c),
      windSpeed: Math.round(current.wind_kph / 3.6), // Konverzija km/h u m/s
      windDir: current.wind_degree,
      condition: current.condition.text, // Npr. "Patchy heavy snow"
      forecast: hourlySnowBase > 0 ? hourlySnowBase : 0
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}