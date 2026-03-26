"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Navigation, Droplets } from 'lucide-react';

import { FLAGS, getStatus } from '@/constants/design';
import ThemeToggle from '@/components/ThemeToggle';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAllWeatherData(balkanResorts);
        setResorts(balkanResorts.map((r, i) => ({ ...r, ...data[i] })));
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code >= 71) return <Snowflake size={28} className="text-blue-200" />;
    if (code >= 51) return <CloudRain size={28} className="text-blue-400" />;
    return <Snowflake size={28} className="text-blue-300/40" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="hover:scale-110 transition-transform cursor-pointer">
            {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
          <MapIcon size={20} /> {showMap ? 'Zatvori Mapu' : 'Prikaži Mapu'}
        </button>

        {showMap && (
          <div className="h-[550px] mb-12 rounded-[3rem] overflow-hidden border border-black/5 dark:border-white/10 relative shadow-2xl">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} />
          </div>
        )}

        {/* SLIDER 6h -> 10d */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
           <div className="bg-white dark:bg-white/5 p-1.5 rounded-full border border-black/5 dark:border-white/10 flex gap-1 shadow-sm">
             {[6, 12, 24, 48, 72, 120, 168, 240].map(v => (
               <button 
                  key={v} 
                  onClick={() => setTimeframe(v)} 
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer whitespace-nowrap ${timeframe === v ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'opacity-40 hover:opacity-100 dark:text-white'}`}
               >
                 {v < 24 ? `${v}h` : v === 24 ? '1 Dan' : `${v/24} Dana`}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <Link key={resort.id} href={`/resort/${resort.id}`} className="bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-black/5 dark:border-white/5 block group hover:shadow-2xl transition-all duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: s.color }}>
                  {s.icon} {s.txt}
                </div>

                <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 group-hover:text-[#3b82f6] transition-colors">{resort.name}</h3>
                
                <div className="h-64 rounded-[3rem] p-8 flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner" style={{ backgroundColor: s.color }}>
                   <div className="flex items-baseline gap-1">
                      <span className="text-8xl font-black tracking-tighter">{snow.toFixed(0)}</span>
                      <span className="text-2xl font-black opacity-40 uppercase">cm</span>
                   </div>
                   <div className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em] mt-2">SNEG</div>
                   
                   {/* Padavine i Kiša */}
                   <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-1.5 bg-black/10 px-4 py-2 rounded-full backdrop-blur-md">
                        <Droplets size={12} className="text-blue-200" /> {prec.toFixed(1)}mm
                      </div>
                      {rain > 0 && (
                        <div className="flex items-center gap-1.5 bg-red-500/20 px-4 py-2 rounded-full backdrop-blur-md text-red-100">
                          <CloudRain size={12} /> {rain.toFixed(1)}mm
                        </div>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5 transition-transform group-hover:scale-95">
                     {getWeatherIcon(resort.current?.weather_code)}
                     <span className="text-[8px] font-black opacity-30 uppercase mt-2">Weather</span>
                  </div>
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5 transition-transform group-hover:scale-95 delay-75">
                     <span className="text-2xl font-black">{resort.current?.temperature_2m.toFixed(0)}°</span>
                     <Thermometer size={14} className="opacity-30 mt-1" />
                  </div>
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5 transition-transform group-hover:scale-95 delay-150">
                     <span className="text-xl font-black">{resort.current?.wind_speed_10m.toFixed(0)}</span>
                     <Navigation 
                        size={14} 
                        className="opacity-30 mt-1" 
                        style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} 
                     />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}