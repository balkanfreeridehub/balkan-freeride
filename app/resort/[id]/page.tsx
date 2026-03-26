"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { 
  Snowflake, 
  Wind, 
  Thermometer, 
  ChevronLeft, 
  Navigation, 
  Droplets,
  MapPin,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function ResortPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const resort = balkanResorts.find(r => r.id === id);

  useEffect(() => {
    if (resort) {
      getWeatherData(resort.lat, resort.lon)
        .then(setData)
        .catch(err => console.error("Greška:", err));
    }
  }, [resort, id]);

  if (!resort) return <div className="p-20 text-center font-black uppercase opacity-20">Planina nije pronađena</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-white font-sans selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      
      {/* HEADER */}
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-6 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="group flex items-center gap-2 font-black uppercase text-[11px] tracking-[0.3em] opacity-40 hover:opacity-100 transition-all">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Nazad
        </Link>
        <div className="text-xl font-black italic uppercase tracking-tighter">
          Balkan<span className="opacity-30 ml-0.5">Freeride</span>
        </div>
        <div className="w-20"></div>
      </nav>

      {!data ? (
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-8 py-16">
          
          <header className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-white/5 rounded-full mb-6 border border-black/5">
              <MapPin size={14} className="opacity-40" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{resort.country}</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              {resort.name}
            </h1>
            <div className="flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-5 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest">
                  <Clock size={14} /> Update: {new Date().toLocaleTimeString('sr-RS', {hour: '2-digit', minute:'2-digit'})}
               </div>
               <div className="px-5 py-3 border border-black/10 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest opacity-30">
                  {resort.lat.toFixed(3)}°N / {resort.lon.toFixed(3)}°E
               </div>
            </div>
          </header>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            
            <div className="bg-white dark:bg-white/5 p-10 rounded-[3.5rem] border border-black/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Thermometer size={32} className="opacity-30" />
              </div>
              <div className="text-6xl font-black tracking-tighter mb-1">{data.current.temperature_2m.toFixed(0)}°</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Temperatura</p>
            </div>

            <div className="bg-white dark:bg-white/5 p-10 rounded-[3.5rem] border border-black/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Navigation 
                  size={32} 
                  fill="currentColor" 
                  style={{ transform: `rotate(${data.current.wind_direction_10m}deg)` }} 
                  className="opacity-10" 
                />
              </div>
              <div className="text-6xl font-black tracking-tighter mb-1">{data.current.wind_speed_10m.toFixed(0)}</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Vetar km/h</p>
            </div>

            <div className="bg-white dark:bg-white/5 p-10 rounded-[3.5rem] border border-black/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Droplets size={32} className="text-blue-400 opacity-60" />
              </div>
              <div className="text-6xl font-black tracking-tighter mb-1">{data.current.weather_code < 10 ? 'Jasno' : 'Padavine'}</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Trenutno nebo</p>
            </div>

            <div className="bg-white dark:bg-white/5 p-10 rounded-[3.5rem] border border-black/5 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                <Snowflake size={32} className="opacity-20 animate-pulse" />
              </div>
              <div className="text-4xl font-black tracking-tighter mb-1 uppercase">Spreman</div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Freeride Status</p>
            </div>
          </div>

          {/* HOURLY SECTION */}
          <section className="bg-slate-900 dark:bg-white text-white dark:text-black rounded-[4rem] p-10 md:p-16 shadow-2xl overflow-hidden">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
              <Clock className="opacity-30" /> 12h Prognoza
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {data.hourly.time.slice(0, 12).map((time: string, i: number) => (
                <div key={i} className="flex flex-col items-center border-r border-white/10 dark:border-black/10 last:border-0">
                  <span className="text-[10px] font-black uppercase opacity-30 mb-4">
                    {new Date(time).toLocaleTimeString('sr-RS', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <div className="text-2xl font-black mb-2">
                    {data.hourly.temperature_2m[i].toFixed(0)}°
                  </div>
                  <div className="flex items-center gap-1 opacity-40">
                    <Droplets size={12} />
                    <span className="text-[10px] font-black">{data.hourly.precipitation[i]}mm</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-20 text-center opacity-10">
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Open-Meteo API / Balkan Freeride Hub 2026</p>
          </footer>

        </main>
      )}
    </div>
  );
}