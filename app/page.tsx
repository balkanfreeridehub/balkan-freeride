"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import ThemeToggle from '@/components/ThemeToggle';
import { Snowflake, Map as MapIcon, Thermometer, Rocket, Zap, CircleSlash, Navigation, Cloud, Sun, CloudRain, CloudSnow, Moon, CloudLightning } from 'lucide-react';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const DICT = {
  sr: { conditions: "Trenutni Uslovi", prec: "Padavine", rain: "Kiša", showMap: "Prikaži Mapu", hideMap: "Sakrij Mapu" },
  en: { conditions: "Current Conditions", prec: "Precipitation", rain: "Rain", showMap: "Show Map", hideMap: "Hide Map" }
};

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');

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
    if (snow >= 100) return { color: '#ef4444', txt: 'JAPAN STYLE', icon: <Rocket size={14}/> };
    if (snow >= 50) return { color: '#8b5cf6', txt: 'DEEP POWDER', icon: <Snowflake size={14}/> };
    if (snow >= 20) return { color: '#3b82f6', txt: 'POWDER DAY', icon: <Snowflake size={14}/> };
    if (snow >= 5) return { color: '#22c55e', txt: 'RIDEABLE', icon: <Zap size={14}/> };
    return { color: '#94a3b8', txt: 'SKIP', icon: <CircleSlash size={14}/> };
  };

  const getWeatherIcon = (code: number) => {
    const isNight = new Date().getHours() >= 19 || new Date().getHours() < 6;
    if (code >= 95) return <CloudLightning size={28} className="text-amber-400" />;
    if (code >= 71) return <CloudSnow size={28} className="text-blue-100" />;
    if (code >= 51) return <CloudRain size={28} className="text-blue-300" />;
    if (code >= 1) return <Cloud size={28} className="text-slate-300" />;
    return isNight ? <Moon size={28} className="text-yellow-100" /> : <Sun size={28} className="text-yellow-400" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 font-sans transition-colors duration-500">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-lg animate-pulse"><Snowflake size={24}/></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Balkan<span className="text-[#A855F7] ml-1">Freeride</span></h1>
        </Link>
        <div className="flex gap-6 items-center">
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="cursor-pointer hover:scale-110 transition-transform active:scale-95">
             <span className="text-xl">{lang === 'sr' ? '🇷🇸' : '🇺🇸'}</span>
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-10 py-8 bg-white dark:bg-white/5 border border-black/5 rounded-[3rem] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 transition-all hover:bg-slate-50 hover:shadow-xl dark:text-white">
          <MapIcon size={20} className="text-[#A855F7]" /> {showMap ? t.hideMap : t.showMap}
        </button>

        {showMap && (
          <div className="h-[600px] mb-12 rounded-[4rem] overflow-hidden border-4 border-white dark:border-white/5 shadow-2xl">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 h-[650px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 dark:via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <div className="w-32 h-8 bg-slate-100 dark:bg-white/10 rounded-full mb-8" />
                <div className="w-48 h-12 bg-slate-200 dark:bg-white/20 rounded-2xl mb-4" />
                <div className="w-full h-64 bg-slate-100 dark:bg-white/10 rounded-[3.5rem]" />
              </div>
             ))
          ) : (
            resorts.map((resort) => {
              let snow = 0; let totalPrec = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                totalPrec += p;
                if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              });
              const rain = Math.max(0, totalPrec - (snow / 1.5));
              const s = getStatus(snow);

              return (
                <Link key={resort.id} href={`/resort/${resort.id}`} className="group bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 hover:border-[#A855F7]/30 hover:shadow-[0_30px_60px_-15px_rgba(168,85,247,0.15)] transition-all duration-500 block hover:-translate-y-2">
                  
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-8 shadow-lg" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>

                  <div className="mb-10">
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-1">{resort.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 dark:text-white">{resort.country}</p>
                  </div>
                  
                  <div className="h-72 rounded-[3.8rem] p-10 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl group-hover:scale-[1.02] transition-transform duration-500" style={{ backgroundColor: s.color }}>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-[7rem] font-black italic tracking-tighter">+{snow.toFixed(0)}</span>
                      <span className="text-2xl font-black italic opacity-50">cm</span>
                    </div>

                    <div className="bg-white/15 backdrop-blur-xl p-7 rounded-[2.5rem] flex justify-between items-center border border-white/20">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1">{t.prec}</span>
                          <span className="text-lg font-black italic">{totalPrec.toFixed(1)}<span className="text-[10px] ml-1">mm</span></span>
                       </div>
                       <div className="h-8 w-px bg-white/20" />
                       <div className="flex flex-col text-right">
                          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-1 text-blue-200">{t.rain}</span>
                          <span className="text-lg font-black italic text-blue-100">{rain.toFixed(1)}<span className="text-[10px] ml-1">mm</span></span>
                       </div>
                    </div>
                  </div>

                  <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-20 dark:text-white mt-12 mb-6 text-center">{t.conditions}</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 p-7 rounded-[2.5rem] flex items-center justify-center border border-black/5 group-hover:bg-white transition-colors">
                       {getWeatherIcon(resort.current?.weather_code)}
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[2.5rem] flex flex-col items-center justify-center border border-black/5 gap-2 group-hover:bg-white transition-colors">
                       <Thermometer size={18} className="opacity-20 text-[#A855F7]" />
                       <span className="text-2xl font-black italic tracking-tighter">{resort.current?.temperature_2m}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[2.5rem] flex flex-col items-center justify-center border border-black/5 gap-2 group-hover:bg-white transition-colors">
                       <Navigation size={18} style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="text-[#A855F7] opacity-40" />
                       <span className="text-2xl font-black italic tracking-tighter">{resort.current?.wind_speed_10m}<span className="text-[8px] block opacity-30 text-center -mt-1 uppercase">km/h</span></span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
      `}</style>
    </div>
  );
}