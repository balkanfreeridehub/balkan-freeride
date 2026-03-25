export async function getWeatherData(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'BalkanFreerideHub/v1.0' }
    });
    const data = await res.json();
    const timeseries = data.properties.timeseries;
    
    // Uzimamo trenutne podatke
    const current = timeseries[0].data.instant.details;
    const symbol = timeseries[0].data.next_1_hours?.summary?.symbol_code || "";
    
    // Gledamo padavine u narednih 6h jer je to najprecizniji podatak za sneg na Yr.no
    const precip = timeseries[0].data.next_6_hours?.details?.precipitation_amount || 0;
    const temp = current.air_temperature;

    // Ako u simbolu piše "snow" ILI je temp < 0.5, pretvaramo mm u cm snega
    const isSnowing = symbol.includes('snow') || temp < 0.5;
    const snowVal = isSnowing ? precip : 0;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(current.wind_speed),
      windDir: current.wind_from_direction,
      precip: precip.toFixed(1),
      forecast: snowVal.toFixed(1),
      condition: translateCondition(symbol)
    };
  } catch (e) {
    return null;
  }
}

function translateCondition(code: string) {
  if (code.includes('snow')) return 'Sneg veje';
  if (code.includes('rain')) return 'Kiša';
  if (code.includes('cloud')) return 'Oblačno';
  return 'Vedro';
}