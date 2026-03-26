"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { Snowflake, Thermometer, ChevronLeft, Wind, Droplets, MapPin, Camera, Star, Sun } from 'lucide-react';
import Link from 'next/link';

export default function ResortPage() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState<any>(null);
  const [resort, setResort] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const decodedId = decodeURIComponent(id as string);
      const found = balkanResorts.find(r => r.id === decodedId);
      if (found) {
        setResort(found);
        getWeatherData(found.lat, found.lon).then(setData).catch(console.error);
      }
    }
  }, [id]);

  if (!resort) return <div className="h-screen flex items-center justify-center font-black uppercase text-xs opacity-50 dark:text-white">Loading Mountain...</div>;

  // Provera za Blue Bird Day (Sneg juče/danas + Sunce sutra)
  const isBlueBird = data && data.hourly.precipitation[0] > 2 && data.current.weather_code === 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-black dark:text-white transition-colors pb-20">
      <nav className="p-6 flex justify-between items-center border-b border-black/5 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50">
        <Link href="/" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100"><ChevronLeft size={16} /> Back</Link>
        <h1 className="text-xl font-black italic uppercase tracking-tighter">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        <div className="w-10"></div>
      </nav>

      {!data ? (
        <div className="max-w-5xl mx-auto p-10 animate-pulse bg-slate-100 dark:bg-white/5 rounded-[4rem] mt-10 h-96"></div>
      ) : (
        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4 opacity-50 font-black uppercase text-[10px] tracking-widest">
                <MapPin size={12} /> {resort.country}
              </div>
              <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">{resort.name}</h2>
            </div>
            {isBlueBird && (
              <div className="bg-amber-400 text-black px-6 py-3 rounded-full font-black uppercase text-xs flex items-center gap-2 shadow-xl animate-bounce">
                <Sun size={16} fill="black" /> Blue Bird Day
              </div>
            )}
          </div>

          {/* Apple-Style Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: 'Temp', val: `${data.current.temperature_2m.toFixed(0)}°`, icon: <Thermometer className="text-blue-500" /> },
              { label: 'Wind', val: `${data.current.wind_speed_10m.toFixed(0)}km/h`, icon: <Wind className="text-slate-400" /> },
              { label: 'Humidity', val: `${data.current.relative_humidity_2m}%`, icon: <Droplets className="text-blue-400" /> },
              { label: 'Weather', val: 'Clear', icon: <Sun className="text-amber-500" /> },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-black/5 dark:border-white/5">
                <div className="mb-2 opacity-30">{s.icon}</div>
                <div className="text-2xl font-black tabular-nums">{s.val}</div>
                <div className="text-[9px] font-black uppercase opacity-30 tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 10-Day Forecast - Apple Style */}
          <section className="mb-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-8">10-Day Snow Forecast</h3>
            <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
              {Array.from({length: 10}).map((_, i) => {
                const daySnow = data.hourly.precipitation.slice(i*24, (i+1)*24).reduce((a:number, b:number) => a + b, 0) * 1.2;
                return (
                  <div key={i} className={`min-w-[120px] p-6 rounded-[2.5rem] flex flex-col items-center border transition-all ${daySnow > 5 ? 'bg-[#3b82f6] text-white border-transparent shadow-lg scale-105' : 'bg-slate-50 dark:bg-white/5 border-black/5 dark:border-white/5 opacity-60'}`}>
                    <span className="text-[10px] font-black uppercase opacity-60 mb-4">Day {i+1}</span>
                    {daySnow > 2 ? <Snowflake size={24} /> : <Sun size={24} className="opacity-20" />}
                    <span className="text-2xl font-black mt-4">{daySnow.toFixed(0)}</span>
                    <span className="text-[9px] font-black uppercase opacity-60">cm</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Partners & Live Cam */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <button className="bg-[#3b82f6] hover:bg-blue-600 text-white p-10 rounded-[3.5rem] flex items-center justify-between group transition-all">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2 text-white">Live Stream</div>
                  <div className="text-3xl font-black uppercase tracking-tighter text-white">Web Cams</div>
                </div>
                <Camera size={40} className="opacity-20 group-hover:opacity-100 transition-opacity" />
             </button>

             <div className="bg-slate-900 dark:bg-white text-white dark:text-black p-10 rounded-[3.5rem] flex items-center justify-between">
                <div className="text-left">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-2">Partner Store</div>
                  <div className="text-2xl font-black uppercase tracking-tighter">Get 20% Off Gear</div>
                  <div className="text-[9px] font-bold mt-1 opacity-60 uppercase">Use code: FREERIDE20</div>
                </div>
                <Star size={40} fill="currentColor" className="text-amber-400" />
             </div>
          </div>
        </main>
      )}
    </div>
  );
}