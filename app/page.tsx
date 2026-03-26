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
  Moon
} from 'lucide-react';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const FlagSRB = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/></svg>;
const FlagUSA = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#ed4c5c" d="M32 15.8h25.3c-1.1-1.7-2.3-3.2-3.6-4.6H32z"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2z"/></svg>;

const DICT = {
  sr: { conditions: "Trenutni Uslovi", prec: "Padavine", rain: "Kiša", showMap: "Prikaži Mapu", hideMap: "Zatvori Mapu" },
  en: { conditions: "Current Conditions", prec: "Precipitation", rain: "Rain", showMap: "Show Map", hideMap: "Close Map" }
};

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [isDark, setIsDark] = useState(true);

  const t = DICT[lang];

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

  const getStatus = (snow: number) => {
    if (snow >= 80) return { color: '#ef4444', txt: 'JAPAN STYLE', icon: <Rocket size={14}/> };
    if (snow >= 40) return { color: '#0ea5e9', txt: 'DEEP POWDER', icon: <Snowflake size={14}/> };
    if (snow >= 15) return { color: '#3b82f6', txt: 'POWDER DAY', icon: <Snowflake size={14}/> };
    if (snow >= 5) return { color: '#22c55e', txt: 'RIDEABLE', icon: <Zap size={14}/> };
    return { color: '#64748b', txt: 'SKIP', icon: <CircleSlash size={14}/> };
  };

  const getWeatherIcon = (code: number) => {
    const isNight = new Date().getHours() >= 19 || new Date().getHours() < 6;
    const props = { size: 36, strokeWidth: 2 };
    if (code >= 71) return <CloudSnow {...props} className="text-white drop-shadow-md" />;
    if (code >= 51) return <CloudRain {...props} className="text-blue-300" />;
    return isNight ? <Moon {...props} className="text-yellow-100" /> : <Sun {...props} className="text-yellow-400" />;
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 font-sans transition-colors">
        
        {/* NAV */}
        <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-lg">
              <Snowflake size={24}/>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
              Balkan<span className="opacity-40 ml-1">Freeride</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-6">
            <button onClick={() => setIsDark(!isDark)} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-yellow-400 cursor-pointer">
              {isDark ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="cursor-pointer">
              {lang === 'sr' ? <FlagSRB/> : <FlagUSA/>}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          
          <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-6 bg-white dark:bg-white/5 border border-black/5 rounded-[2.5rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2 transition-all hover:bg-slate-50 dark:text-white group">
            <MapIcon size={20} className="group-hover:scale-110 transition-transform" /> 
            {showMap ? t.hideMap : t.showMap}
          </button>

          {showMap && (
            <div className="h-[550px] mb-12 rounded-[3.5rem] overflow-hidden border border-black/5 shadow-2xl relative">
              <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} isDark={isDark} />
            </div>
          )}

          {/* TIMEFRAME */}
          <div className="flex justify-center mb-16">
             <div className="bg-white dark:bg-white/5 p-2 rounded-full border border-black/5 flex gap-1 shadow-sm overflow-x-auto no-scrollbar">
               {[6, 12, 24, 48, 72, 120, 168, 240].map(v => (
                 <button key={v} onClick={() => setTimeframe(v)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all ${timeframe === v ? 'bg-black dark:bg-white text-white dark:text-black' : 'hover:bg-slate-100 dark:hover:bg-white/10 dark:text-white'}`}>
                   {v < 24 ? `${v}h` : `${v/24}d`}
                 </button>
               ))}
             </div>
          </div>

          {/* LISTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {resorts.map((resort) => {
              let snow = 0; let totalPrec = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                totalPrec += p;
                if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              });
              const rain = Math.max(0, totalPrec - (snow / 1.5));
              const s = getStatus(snow);

              return (
                <Link key={resort.id} href={`/resort/${resort.id}`} className="group bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-black/5 hover:border-black dark:hover:border-white transition-all duration-500 block relative overflow-hidden">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>

                  <div className="mb-8">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">{resort.name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 dark:text-white">{resort.country}</p>
                  </div>
                  
                  <div className="h-64 rounded-[3rem] p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-xl" style={{ backgroundColor: s.color }}>
                     <div className="flex items-baseline justify-center gap-1">
                        <span className="text-[6rem] font-black tracking-tighter leading-none">{snow.toFixed(0)}</span>
                        <span className="text-xl font-black opacity-40 uppercase">cm</span>
                     </div>
                     <div className="bg-black/10 backdrop-blur-md px-6 py-4 rounded-3xl flex justify-between border border-white/10 items-center">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black uppercase opacity-60">Padavine</span>
                          <span className="text-base font-black">{totalPrec.toFixed(1)}mm</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] font-black uppercase opacity-60">Kiša</span>
                          <span className="text-base font-black text-blue-50">{rain.toFixed(1)}mm</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-10">
                    <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-[2.2rem] flex items-center justify-center border border-black/5">
                       {getWeatherIcon(resort.current?.weather_code)}
                    </div>
                    <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-[2.2rem] flex flex-col items-center justify-center border border-black/5 gap-1">
                       <Thermometer size={20} className="opacity-40" />
                       <span className="text-xl font-black dark:text-white">{resort.current?.temperature_2m.toFixed(0)}°</span>
                    </div>
                    <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-[2.2rem] flex flex-col items-center justify-center border border-black/5 gap-1">
                       <Navigation size={20} fill="currentColor" style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="opacity-20" />
                       <span className="text-xl font-black dark:text-white">{resort.current?.wind_speed_10m.toFixed(0)}</span>
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