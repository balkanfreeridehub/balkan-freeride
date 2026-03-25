export async function getWeatherData(locationId: string) {
  try {
    const res = await fetch(`/api/weather?id=${locationId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    // DEBUGGER: Ispisuje u konzolu tačno šta je stiglo za svaku planinu
    console.log(`%c [Weather Debug] Podaci za ${locationId}:`, 'color: #8b57ff; font-weight: bold', {
      temp: data.temp,
      days: data.dailyForecast?.length,
      firstDayPrecip: data.dailyForecast?.[0]?.precip
    });

    return data;
  } catch (e) {
    console.error(`%c [Weather Error] Neuspelo učitavanje za ${locationId}:`, 'color: red; font-weight: bold', e);
    return null;
  }
}