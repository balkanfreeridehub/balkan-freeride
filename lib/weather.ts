export async function getWeatherData(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'BalkanFreerideHub/1.0' }
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    const timeseries = data.properties.timeseries[0].data;
    const current = timeseries.instant.details;

    // STARA LOGIKA: Uzimamo padavine iz 1h ili 6h bloka, šta god je dostupno
    const precip = timeseries.next_1_hours?.details?.precipitation_amount 
                || (timeseries.next_6_hours?.details?.precipitation_amount / 6) 
                || 0;

    const temp = current.air_temperature;
    const symbol = timeseries.next_1_hours?.summary?.symbol_code || "";

    // "Agresivna" detekcija snega: 
    // Ako simbol sadrži sneg ILI su padavine tu a temp je ispod 1.5°C
    const isSnowing = symbol.includes('snow') || (precip > 0 && temp < 1.5);
    
    // 1mm kiše na planini je ~1cm snega
    const snowVal = isSnowing ? precip : 0;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(current.wind_speed),
      windDir: current.wind_from_direction,
      precip: precip.toFixed(1),
      forecast: snowVal.toFixed(2), // Čuvamo preciznost za množenje u page.tsx
      condition: translateCondition(symbol, temp)
    };
  } catch (e) {
    console.error("Greška pri povlačenju vremena:", e);
    return null;
  }
}

function translateCondition(code: string, temp: number) {
  if (code.includes('snow') || (code.includes('rain') && temp < 1)) return 'Sneg';
  if (code.includes('rain')) return 'Kiša';
  if (code.includes('cloud')) return 'Oblačno';
  if (code.includes('fog')) return 'Magla';
  return 'Vedro';
}