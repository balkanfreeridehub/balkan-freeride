export async function getWeatherData(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'BalkanFreerideHub/1.0' }
    });
    const data = await res.json();
    const timeseries = data.properties.timeseries[0].data;
    
    // Hvatanje padavina - proveravamo više izvora jer API nekad jedan ostavi prazan
    const precip1h = timeseries.next_1_hours?.details?.precipitation_amount || 0;
    const precip6h = timeseries.next_6_hours?.details?.precipitation_amount || 0;
    
    // Uzimamo veću vrednost da ne bismo prikazali 0 ako sneg upravo kreće
    const currentPrecip = Math.max(precip1h, (precip6h / 6)); 
    
    const temp = data.properties.timeseries[0].data.instant.details.air_temperature;
    const symbol = timeseries.next_1_hours?.summary?.symbol_code || "";

    // Freeride matematika: 1mm padavina na minusu = 1cm snega
    // Ako je temp < 1°C, tretiramo sve padavine kao sneg
    const isSnowing = symbol.includes('snow') || temp < 1;
    const snowResult = isSnowing ? Math.max(precip1h, precip6h) : 0;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(data.properties.timeseries[0].data.instant.details.wind_speed),
      windDir: data.properties.timeseries[0].data.instant.details.wind_from_direction,
      precip: Math.max(precip1h, precip6h).toFixed(1),
      forecast: snowResult.toFixed(1),
      condition: translateCondition(symbol)
    };
  } catch (e) {
    console.error("Weather API Error:", e);
    return null;
  }
}

function translateCondition(code: string) {
  if (code.includes('snow')) return 'Sneg';
  if (code.includes('rain')) return 'Kiša';
  if (code.includes('cloud')) return 'Oblačno';
  if (code.includes('fog')) return 'Magla';
  return 'Vedro';
}