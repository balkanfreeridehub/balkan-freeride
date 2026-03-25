export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    // Koristimo q=lat,lon da bismo gađali tačnu tačku na mapi koju si poslao
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=3&aqi=no`
    );
    const data = await res.json();

    if (!data || !data.current || !data.forecast) return null;

    const current = data.current;
    const day = data.forecast.forecastday[0].day;
    const temp = current.temp_c;

    // LOGIKA ZA PLANINU:
    // 1. Uzmi direktne padavine (ono što si video u tabeli: 28mm, 7mm...)
    const precip = day.totalprecip_mm || 0;
    
    // 2. Ako je hladno (ispod 3°C), svaki mm padavina je sneg
    let snowBase = 0;
    if (temp < 3) {
      // 1mm kiše na planini je često i više od 1cm snega, ali idemo 1:1 radi sigurnosti
      snowBase = precip / 24; 
    }

    // 3. "Emergency" sneg: Ako je vlažnost > 90% i temp < 0, a nema zabeleženih padavina,
    // simuliraj 0.1cm snega po satu (to je ono sitno vejanje koje kamere hvataju)
    if (snowBase === 0 && current.humidity > 90 && temp < 0) {
      snowBase = 0.1;
    }

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(current.wind_kph / 3.6),
      windDir: current.wind_degree,
      condition: current.condition.text,
      forecast: snowBase
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}