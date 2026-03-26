"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Navigation } from 'lucide-react';

// TVOJI KONSTANTE I TOGGLE
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

  const getWeatherIcon = (code: number, size = 32) => {
    if (code >= 71) return <Snowflake size={size} className="text-blue-200" />;
    if (code >= 51) return <CloudRain size={size} className="text-blue-400" />;
    return <Snowflake size={size} className="text-blue-300 opacity-50" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-20 transition-colors">
      <nav className="sticky top-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        </Link>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="hover:scale-110 transition-transform">
            {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 bg-white dark:bg-white/5 border border-black/5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 dark:text-white shadow-sm">
          <MapIcon size={20} /> {showMap ? 'Zatvori Mapu' : 'Prikaži Mapu'}
        </button>

        {showMap && (
          <div className="h-[500px] mb-12 rounded-[2.5rem] overflow-hidden border border-black/5 relative shadow-xl">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} />
          </div>
        )}

        {/* VRACEN SLIDER / TIMEFRAME SELECTOR */}
        <div className="flex justify-center mb-16">
           <div className="bg-white dark:bg-white/5 p-1.5 rounded-full border border-black/5 flex gap-1">
             {[24, 48, 72, 168].map(v => (
               <button key={v} onClick={() => setTimeframe(v)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${timeframe === v ? 'bg-[#3b82f6] text-white shadow-lg' : 'dark:text-white opacity-40 hover:opacity-100'}`}>
                 {v < 24 ? `${v}h` : `${v/24}d`}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? [1,2,3].map(i => <div key={i} className="h-96 bg-slate-200 dark:bg-white/5 animate-pulse rounded-[3rem]" />) : 
           resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <Link key={resort.id} href={`/resort/${resort.id}`} className="bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-black/5 block group hover:shadow-2xl transition-all duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-md" style={{ backgroundColor: s.color }}>
                  {s.icon} {s.txt}
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-8">{resort.name}</h3>
                
                {/* GLAVNI SNOW BOX SA RAIN/PREC INFO */}
                <div className="h-56 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner" style={{ backgroundColor: s.color }}>
                   <div className="text-7xl font-black tracking-tighter">{snow.toFixed(0)}<span className="text-xl ml-1 opacity-50">cm</span></div>
                   <div className="text-[10px] font-black uppercase opacity-60 mt-1">SNEG</div>
                   <div className="absolute bottom-6 flex gap-4 text-[9px] font-black uppercase bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      <span>Prec: {prec.toFixed(1)}mm</span>
                      {rain > 0 && <span className="text-blue-200 flex items-center gap-1"><CloudRain size={10}/> {rain.toFixed(1)}mm</span>}
                   </div>
                </div>

                {/* TRI BOXA: IKONA, TEMP, VETAR */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                     {getWeatherIcon(resort.current?.weather_code)}
                  </div>
                  <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                     <Thermometer size={20} className="opacity-30 mb-2 dark:text-white" />
                     <span className="text-2xl font-black dark:text-white">{resort.current?.temperature_2m.toFixed(0)}°</span>
                  </div>
                  <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                     <Navigation 
                        size={20} 
                        className="opacity-30 mb-2 dark:text-white" 
                        style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} 
                     />
                     <span className="text-xl font-black dark:text-white">{resort.current?.wind_speed_10m.toFixed(0)}</span>
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