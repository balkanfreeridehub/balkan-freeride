"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Navigation, Sun, Globe } from 'lucide-react';
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

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center transition-colors">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        </Link>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="hover:scale-110 transition-transform cursor-pointer flex items-center gap-2">
            {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />}
            <span className="text-[10px] font-black uppercase dark:text-white">{lang.toUpperCase()}</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 resort-card rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm">
          <MapIcon size={20} /> {showMap ? 'Zatvori Mapu' : 'Prikaži Mapu'}
        </button>

        {showMap && (
          <div className="h-[550px] mb-12 rounded-[3.5rem] overflow-hidden border border-black/5 dark:border-white/10 relative shadow-2xl bg-white dark:bg-black/20">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} />
          </div>
        )}

        {/* SLIDER Container Fix */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
           <div className="slider-container p-1.5 rounded-full flex gap-1">
             {[6, 12, 24, 48, 72, 120, 168, 240].map(v => (
               <button 
                key={v} 
                onClick={() => setTimeframe(v)} 
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer whitespace-nowrap ${timeframe === v ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'opacity-40 hover:opacity-100 dark:text-white'}`}
               >
                 {v < 24 ? `${v}h` : v === 24 ? '1 Dan' : `${v/24}d`}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? [1,2,3,4,5,6].map(i => <div key={i} className="h-[450px] bg-slate-200 dark:bg-white/5 animate-pulse rounded-[4rem]" />) : 
           resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <Link key={resort.id} href={`/resort/${resort.id}`} className="resort-card p-8 rounded-[4rem] block group">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-md" style={{ backgroundColor: s.color }}>
                  {s.icon} {s.txt}
                </div>

                <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 dark:text-white transition-none group-hover:text-[#3b82f6]">{resort.name}</h3>
                
                <div className="h-64 rounded-[3.5rem] p-8 flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner" style={{ backgroundColor: s.color }}>
                   <div className="flex items-baseline gap-1">
                      <span className="text-8xl font-black tracking-tighter tabular-nums">{snow.toFixed(0)}</span>
                      <span className="text-2xl font-black opacity-40 uppercase">cm</span>
                   </div>
                   
                   {/* Padavine Info Box */}
                   <div className="absolute bottom-6 w-full px-10 text-center">
                      <div className="flex flex-col gap-0.5 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-90">Total Precipitation: {prec.toFixed(1)}mm</span>
                        {rain > 0 && <span className="text-[8px] font-bold uppercase opacity-60">Possible Rain: {rain.toFixed(1)}mm</span>}
                      </div>
                      <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden flex">
                         <div className="h-full bg-white" style={{ width: `${(snow / (prec + 0.1)) * 100}%` }}></div>
                         <div className="h-full bg-blue-950/30" style={{ width: `${(rain / (prec + 0.1)) * 100}%` }}></div>
                      </div>
                   </div>
                </div>

                <h4 className="text-[9px] font-black uppercase tracking-[0.25em] opacity-30 dark:text-white mb-4">Current Conditions</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square bg-slate-100/50 dark:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5">
                      <Thermometer size={24} className="text-[#3b82f6] mb-1" />
                      <span className="text-lg font-black dark:text-white tabular-nums leading-none">{resort.current?.temperature_2m.toFixed(0)}°</span>
                  </div>
                  <div className="aspect-square bg-slate-100/50 dark:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5">
                      <Navigation 
                        size={24} 
                        fill="currentColor"
                        className="text-slate-300 dark:text-white/20 mb-1" 
                        style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} 
                      />
                      <span className="text-lg font-black dark:text-white tabular-nums leading-none">{resort.current?.wind_speed_10m.toFixed(0)}<span className="text-[8px] ml-0.5">km/h</span></span>
                  </div>
                  <div className="aspect-square bg-slate-100/50 dark:bg-white/5 rounded-[2rem] flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5">
                      <Sun size={24} className="text-amber-400 mb-1 opacity-40" />
                      <span className="text-[9px] font-black dark:text-white uppercase opacity-40">Clear</span>
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