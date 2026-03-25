"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dinamički uvoz Leaflet komponenti bez SSR-a
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const ranges = [
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '1d', hours: 24 },
  { label: '3d', hours: 72 },
  { label: '5d', hours: 120 },
  { label: '10d', hours: 240 }
];

const resorts = [
  { name: "Kopaonik", lat: 43.2858, lon: 20.8003 },
  { name: "Bansko", lat: 41.8380, lon: 23.4880 },
  { name: "Jahorina", lat: 43.7333, lon: 18.5667 },
  { name: "Kolasin", lat: 42.8406, lon: 19.6278 },
  { name: "Popova Šapka", lat: 42.0375, lon: 20.8786 }
];

export default function TestPagePro() {
  const [selectedHours, setSelectedHours] = useState(24);
  const [data, setData] = useState<any[]>([]);
  const [L, setL] = useState<any>(null);

  // Inicijalizacija Leaflet ikona samo na klijentu
  useEffect(() => {
    import('leaflet').then((Leaflet) => {
      setL(Leaflet);
      // @ts-ignore
      delete Leaflet.Icon.Default.prototype._getIconUrl;
      Leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });
  }, []);

  // Fetch podataka - aktivira se svaki put kada se promeni selectedHours
  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(resorts.map(async (r) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lon}&hourly=snowfall,precipitation,temperature_2m,windspeed_10m&current_weather=true&timezone=auto`;
          const res = await fetch(url);
          const weather = await res.json();
          
          // Sumiranje podataka za odabrani broj sati
          const snowSum = weather.hourly.snowfall.slice(0, selectedHours).reduce((a: any, b: any) => a + (b || 0), 0);
          const precipSum = weather.hourly.precipitation.slice(0, selectedHours).reduce((a: any, b: any) => a + (b || 0), 0);
          
          return { ...r, weather, snowSum, precipSum };
        } catch (e) {
          return { ...r, error: true };
        }
      }));
      setData(results);
    }
    fetchAll();
  }, [selectedHours]);

  const getScore = (snow: number, temp: number, wind: number) => {
    let s = 0;
    if (snow > 10) s += 2; else if (snow > 3) s += 1;
    if (temp < 0) s += 1;
    if (wind < 30) s += 1;

    if (s >= 4) return { cls: 'bg-[#00c853]', label: 'POWDER ALERT' };
    if (s >= 2) return { cls: 'bg-[#ffd600] text-black', label: 'RIDEABLE' };
    return { cls: 'bg-[#d50000]', label: 'SKIP' };
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white font-sans">
      {/* MAPA */}
      <div className="h-[35vh] w-full bg-slate-900 relative">
        {typeof window !== 'undefined' && L && (
          <MapContainer center={[42.5, 20.8]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {data.map((r, i) => !r.error && (
              <Marker key={i} position={[r.lat, r.lon]}>
                <Popup>
                  <div className="text-black text-center font-bold">
                    {r.name}<br/>
                    <span className="text-blue-600">❄ {r.snowSum.toFixed(1)}mm</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <div className="container p-4">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Freeride PRO</h1>
            <Link href="/" className="text-[10px] bg-white/10 px-3 py-1 rounded-lg">HUB</Link>
        </div>

        {/* KONTROLE (RANGES) */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {ranges.map((range) => (
            <button
              key={range.hours}
              onClick={() => setSelectedHours(range.hours)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedHours === range.hours ? 'bg-[#00c853] text-black scale-105 shadow-lg' : 'bg-[#1e2a44] text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* GRID KARTICA */}
        <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar">
          {data.map((r, i) => {
            if (r.error) return <div key={i} className="min-w-[220px] bg-red-900/20 p-4 rounded-xl">Error {r.name}</div>;
            
            const score = getScore(r.snowSum, r.weather.current_weather.temperature, r.weather.current_weather.windspeed);

            return (
              <div key={i} className="min-w-[240px] bg-[#121a2b] p-5 rounded-[1.5rem] border border-white/5 shadow-xl">
                <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black mb-3 ${score.cls}`}>
                  {score.label}
                </div>
                <div className="text-lg font-bold mb-3">{r.name}</div>
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-black italic text-blue-400">❄ {r.snowSum.toFixed(1)} <span className="text-xs uppercase opacity-50">mm</span></span>
                    </div>
                    <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest border-b border-white/5 pb-2">Snowfall ({selectedHours}h)</div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                        <div className="bg-white/5 p-2 rounded-lg">🌧 {r.precipSum.toFixed(1)} mm</div>
                        <div className="bg-white/5 p-2 rounded-lg">🌡 {r.weather.current_weather.temperature}°C</div>
                        <div className="bg-white/5 p-2 rounded-lg col-span-2 text-center italic opacity-70">💨 {r.weather.current_weather.windspeed} km/h</div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}