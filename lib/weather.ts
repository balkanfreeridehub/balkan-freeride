export async function getWeatherData(lat: number, lon: number) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=snowfall,precipitation,temperature_2m,windspeed_10m&current_weather=true&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("API Error");
    const data = await res.json();

    return {
      current: {
        temp: Math.round(data.current_weather.temperature),
        windSpeed: Math.round(data.current_weather.windspeed / 3.6), // Prebacujemo u m/s
        windDir: data.current_weather.winddirection,
      },
      hourly: data.hourly
    };
  } catch (e) {
    console.error("Open-Meteo Error:", e);
    return null;
  }
}