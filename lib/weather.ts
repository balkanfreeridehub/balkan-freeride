export async function getWeatherData(lat: number, lon: number) {
  try {
    const res = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
      headers: { 'User-Agent': 'BalkanFreerideHub/1.0' }
    });
    const data = await res.json();
    const current = data.properties.timeseries[0].data.instant.details;
    
    // Uzimamo padavine za sledećih 6h kao bazu za sneg
    const next6h = data.properties.timeseries[0].data.next_6_hours?.details;
    const precip = next6h?.precipitation_amount || 0;
    const temp = current.air_temperature;

    // FREERIDE LOGIKA: Ako je temp < 0.5°C, milimetri postaju santimetri snega
    // Obično je odnos 1mm padavina = 1cm snega
    const snowFactor = temp < 0.5 ? 1 : 0; 
    const snowForecast = precip * snowFactor;

    return {
      temp: Math.round(temp),
      windSpeed: Math.round(current.wind_speed),
      windDir: current.wind_from_direction,
      precip: precip,
      forecast: snowForecast > 0 ? snowForecast : 0, // Ako nema snega, bar nek prikaže 0 kako treba
      condition: translateCondition(data.properties.timeseries[0].data.next_1_hours?.summary?.symbol_code)
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