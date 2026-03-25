import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const API_KEY = 'c88c1e32ebc740b4afc200035262503';

  if (!id) return NextResponse.json({ error: 'No ID' }, { status: 400 });

  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${id}&days=10&aqi=no`
    );
    const data = await res.json();

    return NextResponse.json({
      temp: Math.round(data.current.temp_c),
      windSpeed: Math.round(data.current.wind_kph / 3.6),
      windDir: data.current.wind_degree,
      condition: data.current.condition.text,
      dailyForecast: data.forecast.forecastday.map((d: any) => ({
        precip: d.day.totalprecip_mm || 0,
        avgTemp: d.day.avgtemp_c
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}