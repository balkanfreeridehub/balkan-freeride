"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { 
  Snowflake, 
  Map as MapIcon, 
  Thermometer, 
  Rocket, 
  Zap, 
  CircleSlash, 
  Navigation, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Moon,
  Wind
} from 'lucide-react';
import { FlagSRB, FlagUSA } from '@/components/Flags';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const DICT = {
  sr: { conditions: "Uslovi", prec: "Padavine", rain: "Kiša", showMap: "Mapa", hideMap: "Zatvori" },
  en: { conditions: "Conditions", prec: "Precipitation", rain: "Rain", showMap: "Map", hideMap: "Close" }
};

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [isDark, setIsDark] = useState(true);

  const t = DICT[lang];

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllWeatherData(balkanResorts);
        setResorts(balkanResorts.map((r, i) => ({ ...r, ...data[i] })));
      } catch (e) { console.error(e); }
    }
    load();
  }, []);

  const getStatus = (snow: number) => {
    if (snow >= 50) return { color: '#ef4444', txt: 'POWDER ALARM', icon: <Rocket size={14}/> };
    if (snow >= 20) return { color: '#0070f3', txt: 'FRESH TRACKS', icon: <Snowflake size={14}/> }; // Electric Blue
    if (snow >= 10) return { color: '#3b82f6', txt: 'GOOD RIDE', icon: <Zap size={14}/> };
    if (snow >= 2) return { color: '#10b981', txt: 'DUST ON CRUST', icon: <Snowflake size={14}/> };
    return { color: '#64748b', txt: 'NO LUCK', icon: <CircleSlash size={14}/> };
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-[#020617] pb-20 transition-colors">
        <nav className="sticky top-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-2xl">
              <Snowflake size={24}/>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Balkan<span className="opacity-30 ml-1">Freeride</span></h1>
          </Link>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDark(!isDark)} className="p-2 cursor-pointer dark:text-yellow-400">
              {isDark ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="cursor-pointer">
              {lang === 'sr' ? <FlagSRB /> : <FlagUSA />}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <MapIcon size={20} /> {showMap ? t.hideMap : t.showMap}
          </button>

          {showMap && (
            <div className="h-[450px] mb-12 rounded-[2.5rem] overflow-hidden border border-black/5 relative shadow-inner">
              <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} isDark={isDark} />
            </div>
          )}

          <div className="flex justify-center mb-16">
             <div className="bg-slate-100 dark:bg-white/5 p-1.5 rounded-full flex gap-1">
               {[24, 48, 72, 168].map(v => (
                 <button key={v} onClick={() => setTimeframe(v)} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase transition-all ${timeframe === v ? 'bg-black dark:bg-white text-white dark:text-black' : 'dark:text-white opacity-40 hover:opacity-100'}`}>
                   {v < 24 ? `${v}h` : `${v/24}d`}
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resorts.map((resort) => {
              let snow = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              });
              const s = getStatus(snow);

              return (
                <Link key={resort.id} href={`/resort/${resort.id}`} className="bg-white dark:bg-slate-900/40 p-8 rounded-[3rem] border border-black/5 block hover:border-black dark:hover:border-white transition-all shadow-sm">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-8">{resort.name}</h3>
                  <div className="h-48 rounded-[2rem] flex flex-col justify-center items-center text-white mb-8 shadow-xl" style={{ backgroundColor: s.color }}>
                     <div className="text-6xl font-black">{snow.toFixed(0)}</div>
                     <div className="text-[10px] font-black uppercase opacity-60">cm snega</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-black/5 dark:text-white">
                       <Thermometer size={20} className="opacity-30" />
                       <span className="ml-1 font-black">{resort.current?.temperature_2m.toFixed(0)}°</span>
                    </div>
                    <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-black/5 dark:text-white">
                       <Wind size={20} className="opacity-30" />
                       <span className="ml-1 font-black">{resort.current?.wind_speed_10m.toFixed(0)}</span>
                    </div>
                    <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-black/5 dark:text-white">
                       <Navigation size={20} className="opacity-30" style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}