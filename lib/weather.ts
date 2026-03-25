export async function getWeatherData(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'BalkanFreerideHub/1.0' }
    });
    const data = await res.json();
    const timeseries = data.properties.timeseries;
    const current = timeseries[0].data.instant.details;
    
    // Sabiramo padavine za prvih 24h da bismo imali bazu
    let totalPrecip = 0;
    for (let i = 0; i < 24; i++) {
        totalPrecip += timeseries[i].data.next_1_hours?.details?.precipitation_amount || 0;
    }

    const temp = current.air_temperature;
    // Ako je temp blizu nule, tretiramo padavine kao sneg (1mm = 1cm)
    const snowForecast = temp < 1.5 ? totalPrecip : 0;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(current.wind_speed),
      windDir: current.wind_from_direction,
      precip: totalPrecip.toFixed(1),
      forecast: snowForecast.toFixed(1),
      condition: translateCondition(timeseries[0].data.next_1_hours?.summary?.symbol_code)
    };
  } catch (e) {
    return null;
  }
}

function translateCondition(code: string) {
  if (code?.includes('snow')) return 'Sneg';
  if (code?.includes('rain')) return 'Kiša';
  if (code?.includes('cloud')) return 'Oblačno';
  return 'Vedro';
}