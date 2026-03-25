export async function getWeatherData(lat: number, lon: number) {
  try {
    // Vučemo i DAILY podatke jer su oni "zakucani" i retko su 0 ako se očekuje padavina
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&hourly=snowfall,precipitation&daily=snowfall_sum,precipitation_sum&timezone=auto`
    );
    const data = await res.json();

    if (!data.current) return null;

    const temp = data.current.temperature_2m;
    
    // 1. Proveravamo hourly sneg (prvih 6h)
    const hourlySnow = data.hourly.snowfall.slice(0, 6).reduce((a: number, b: number) => a + b, 0) / 6;
    
    // 2. Proveravamo dnevni sneg (sumu za danas) i delimo sa 24 da dobijemo prosek po satu
    const dailySnowAvg = (data.daily.snowfall_sum[0] || 0) / 24;
    const dailyPrecipAvg = (data.daily.precipitation_sum[0] || 0) / 24;

    // FINALNA LOGIKA: 
    // Uzmi hourly sneg. Ako je 0, uzmi dnevni prosek snega. 
    // Ako je i to 0, a hladno je, uzmi dnevni prosek padavina (kiše).
    let snowBase = hourlySnow;
    if (snowBase === 0) snowBase = dailySnowAvg;
    if (snowBase === 0 && temp < 1.5) snowBase = dailyPrecipAvg;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDir: data.current.wind_direction_10m,
      condition: data.current.weather_code,
      // Šaljemo snowBase koji je sad skoro nemoguće da bude 0 ako ima bilo kakve prognoze
      forecast: snowBase > 0 ? snowBase : 0 
    };
  } catch (e) {
    console.error("Weather Error:", e);
    return null;
  }
}