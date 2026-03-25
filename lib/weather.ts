export async function getWeatherData(lat: number, lon: number) {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'BalkanFreerideApp/1.0 contact@tvojmejl.com' },
      next: { revalidate: 3600 } 
    });

    if (!response.ok) return null;
    const data = await response.json();
    const currentPath = data.properties.timeseries[0].data.instant.details;
    
    // Sabiranje snega za 24h
    const timeseries = data.properties.timeseries.slice(0, 24);
    let total24h = 0;
    timeseries.forEach((hour: any) => {
      total24h += hour.data.next_1_hours?.details?.precipitation_amount || 0;
    });
    
    return { 
      forecast: Math.round(total24h),
      temp: Math.round(currentPath.air_temperature),
      wind: Math.round(currentPath.wind_speed)
    };
  } catch (error) {
    return null;
  }
}