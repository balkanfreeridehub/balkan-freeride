"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Dinamički import za Leaflet jer ne radi na serveru (SSR)
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix za ikone u Leaflet-u unutar Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const testResorts = [
  { name: "Kopaonik", lat: 43.2858, lon: 20.8003 },
  { name: "Bansko", lat: 41.8380, lon: 23.4880 },
  { name: "Jahorina", lat: 43.7333, lon: 18.5667 },
  { name: "Kolasin", lat: 42.8406, lon: 19.6278 },
  { name: "Popova Sapka", lat: 42.0375, lon: 20.8786 }
];

export default function TestLab() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAll() {
      const results = await Promise.all(testResorts.map(async (r) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${r.lat}&longitude=${r.lon}&current_weather=true&daily=snowfall_sum&timezone=auto`;
        const res = await fetch(url);
        const weather = await res.json();
        return { ...r, weather };
      }));
      setData(results);
    }
    fetchAll();
  }, []);

  const getFreerideScore = (snow: number, temp: number) => {
    if (snow > 10) return { cls: 'bg-[#00c853]', label: 'POWDER DAY' };
    if (snow > 3 || temp < 0) return { cls: 'bg-[#ffd600] text-black', label: 'RIDEABLE' };
    return { cls: 'bg-[#d50000]', label: 'SKIP' };
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white font-sans">
      {/* MAPA */}
      <div className="h-[40vh] w-full border-b border-white/10">
        <MapContainer center={[42.5, 20.8]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {data.map((r, i) => (
            <Marker key={i} position={[r.lat, r.lon]}>
              <Popup>
                <b className="text-black">{r.name}</b><br/>
                <span className="text-black">❄ {r.weather.daily.snowfall_sum[0]}mm</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black italic uppercase">Open-Meteo Test Lab</h1>
          <Link href="/" className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/20">Nazad</Link>
        </div>

        {/* GRID KARTICA */}
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {data.map((r, i) => {
            const snow = r.weather.daily.snowfall_sum[0] || 0;
            const temp = r.weather.current_weather.temperature;
            const wind = r.weather.current_weather.windspeed;
            const score = getFreerideScore(snow, temp);

            return (
              <div key={i} className="min-w-[220px] bg-[#121a2b] p-5 rounded-2xl border border-white/5">
                <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black mb-4 ${score.cls}`}>
                  {score.label}
                </div>
                <div className="text-lg font-bold mb-1">{r.name}</div>
                <div className="text-3xl font-black mb-1">❄ {snow} <span className="text-sm font-normal opacity-50">mm</span></div>
                <div className="text-[10px] opacity-50 uppercase mb-4 tracking-widest font-bold">24h Snowfall</div>
                <div className="flex gap-4 text-xs font-bold">
                   <span>🌡 {temp}°C</span>
                   <span>💨 {wind} km/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}