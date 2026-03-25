export async function getWeatherData(lat: number, lon: number) {
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=1&aqi=no`
    );
    const data = await res.json();

    if (!data || !data.current) return null;

    const current = data.current;
    const day = data.forecast.forecastday[0].day;
    const temp = current.temp_c;
    
    // 1. Primarni izvor: Direktni sneg iz API-ja
    let snowBase = (day.totalsnow_cm || 0) / 24;

    // 2. Sekundarni izvor: Ako nema snega u API-ju, ali ima padavina na minusu
    if (snowBase === 0 && (day.totalprecip_mm > 0) && temp < 2) {
      snowBase = day.totalprecip_mm / 24;
    }

    // 3. Tercijarni izvor (Visual Fix): Ako je vlažno i hladno, dajemo 0.05cm 
    // da sajt ne izgleda "mrtvo" dok na kamerama vidimo sneg
    if (snowBase === 0 && current.humidity > 85 && temp < 0) {
      snowBase = 0.05;
    }

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(current.wind_kph / 3.6),
      windDir: current.wind_degree,
      condition: current.condition.text,
      // Šaljemo bazu koja će se množiti u page.tsx
      forecast: snowBase 
    };
  } catch (e) {
    console.error("WeatherAPI Error:", e);
    return null;
  }
}