"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import ThemeToggle from '@/components/ThemeToggle';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Zap, Rocket, CircleSlash, Navigation, Cloud, Sun, CloudSnow, Droplets } from 'lucide-react';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

// TVOJI ORIGINALNI SVG-OVI
const FlagUSA = () => <svg width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6-1.4 1.4-2.6 3-3.6 4.6h23.3V2c-5.9 0-11.3 1.7-16 4.6"/></svg>;
const FlagSRB = () => <svg width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/></svg>;

const TIMES = [{ l: '6h', v: 6 }, { l: '12h', v: 12 }, { l: '1d', v: 24 }, { l: '2d', v: 48 }, { l: '3d', v: 72 }, { l: '5d', v: 120 }, { l: '7d', v: 168 }, { l: '10d', v: 240 }];

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

  const getStatus = (snow: number) => {
    if (snow >= 50) return { color: '#ef4444', txt: 'JAPAN STYLE', icon: <Rocket size={14}/> };
    if (snow >= 30) return { color: '#8b5cf6', txt: 'DEEP POWDER', icon: <Snowflake size={14}/> };
    if (snow >= 15) return { color: '#3b82f6', txt: 'POWDER DAY', icon: <Snowflake size={14}/> };
    if (snow >= 5) return { color: '#22c55e', txt: 'RIDEABLE', icon: <Zap size={14}/> };
    return { color: '#94a3b8', txt: 'SKIP', icon: <CircleSlash size={14}/> };
  };

  const getWeatherIcon = (code: number) => {
    if (code >= 71) return <CloudSnow size={20} className="text-blue-400" />;
    if (code >= 51) return <CloudRain size={20} className="text-blue-400" />;
    if (code >= 1) return <Cloud size={20} className="text-slate-400" />;
    return <Sun size={20} className="text-yellow-500" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 font-sans">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:rotate-12 transition-transform shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            Balkan<span className="text-[#A855F7] ml-1">Freeride</span>
          </h1>
        </Link>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="hover:scale-110 transition-transform">
            {lang==='sr' ? <FlagSRB/> : <FlagUSA/>}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-6 py-6 bg-white dark:bg-white/5 border border-black/5 rounded-[2.5rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
          <MapIcon size={20} className="text-[#A855F7]" /> {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
          <div className="h-[550px] mb-10 rounded-[3.5rem] overflow-hidden border border-black/5 shadow-2xl">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} />
          </div>
        )}

        <div className="flex justify-center mb-16 overflow-x-auto py-2">
          <div className="bg-white dark:bg-white/5 p-2 rounded-full border border-black/5 flex gap-1">
            {TIMES.map(t => (
              <button key={t.v} onClick={() => setTimeframe(t.v)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all ${timeframe === t.v ? 'bg-[#A855F7] text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="h-[520px] bg-white dark:bg-white/5 rounded-[4rem] p-10 border border-black/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <div className="w-32 h-8 bg-slate-100 dark:bg-slate-800 rounded-full mb-8" />
                <div className="w-full h-44 bg-slate-50 dark:bg-slate-800/40 rounded-[3rem]" />
              </div>
            ))
          ) : (
            resorts.map((resort) => {
              let snow = 0; let totalPrec = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                totalPrec += p;
                if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.2;
              });
              const s = getStatus(snow);

              return (
                <Link key={resort.id} href={`/resort/${resort.id}`} className="group bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 cursor-pointer hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 block">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ backgroundColor: s.color + '20', color: s.color }}>
                      {s.icon} {s.txt}
                    </div>
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 group-hover:text-[#A855F7] transition-colors">{resort.name}</h3>
                  <div className="h-44 rounded-[3rem] flex flex-col items-center justify-center mb-10 text-white shadow-inner relative overflow-hidden" style={{ backgroundColor: s.color }}>
                    <span className="text-7xl font-black italic drop-shadow-md">+{snow.toFixed(1)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">cm forecast</span>
                  </div>

                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2 flex items-center gap-2">
                    {getWeatherIcon(resort.current?.weather_code)} Current Status
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] flex flex-col items-center border border-black/5">
                       <Thermometer size={14} className="mb-2 opacity-30 text-[#A855F7]" />
                       <span className="text-xl font-black italic">{resort.current?.temperature_2m}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] flex flex-col items-center border border-black/5">
                       <Droplets size={14} className="mb-2 opacity-30 text-blue-500" />
                       <span className="text-xl font-black italic">{totalPrec.toFixed(1)}<span className="text-[10px] ml-1">mm</span></span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[2rem] flex flex-col items-center col-span-2 border border-black/5">
                       <div className="flex items-center gap-6">
                         <div className="flex flex-col items-center">
                            <Wind size={14} className="mb-1 opacity-30" />
                            <span className="text-xl font-black italic">{resort.current?.wind_speed_10m}<span className="text-[9px] ml-1">KMH</span></span>
                         </div>
                         <div className="w-[1px] h-8 bg-black/5 dark:bg-white/5" />
                         <Navigation size={20} style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="text-[#A855F7]" />
                       </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
      <style jsx global>{` @keyframes shimmer { 100% { transform: translateX(100%); } } `}</style>
    </div>
  );
}