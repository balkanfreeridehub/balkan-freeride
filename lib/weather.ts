export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    // Vučemo prognozu za 7 dana da bi dobili bogatije podatke
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=no`
    );
    const data = await res.json();

    if (!data || !data.current) return null;

    const current = data.current;
    const forecastDays = data.forecast.forecastday;
    
    // Uzimamo prosek padavina iz prvih par dana prognoze (ono što si poslao u tabeli)
    // Sabiramo totalprecip_mm za danas i sutra i delimo da dobijemo bazu po satu
    const totalPrecipNext48h = (forecastDays[0].day.totalprecip_mm + forecastDays[1].day.totalprecip_mm);
    const hourlyBase = totalPrecipNext48h / 48;

    // Ako je temperatura ispod 4°C (na planini je to granica za sneg/bljuzgu), 
    // računamo te padavine kao sneg. 
    // Koristimo koeficijent 1.2 jer je sneg zapreminski veći od kiše (1mm kiše = ~1.2cm snega)
    const isColdEnough = current.temp_c < 4;
    const snowForecast = isColdEnough ? (hourlyBase * 1.2) : 0;

    return {
      temp: Math.round(current.temp_c),
      windSpeed: Math.round(current.wind_kph / 3.6),
      windDir: current.wind_degree,
      condition: current.condition.text,
      // Šaljemo izračunatu prognozu snega
      forecast: snowForecast > 0 ? snowForecast : 0
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}