"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import ThemeToggle from '@/components/ThemeToggle';
import { Snowflake, Map as MapIcon, Thermometer, Wind, Rocket, Zap, CircleSlash, Navigation, Cloud, Sun, CloudRain, CloudSnow, Moon } from 'lucide-react';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const FlagUSA = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#ed4c5c" d="M32 15.8h25.3c-1.1-1.7-2.3-3.2-3.6-4.6H32z"/><path fill="#fff" d="M32 20.4h27.7c-.7-1.6-1.5-3.2-2.4-4.6H32z"/><path fill="#ed4c5c" d="M32 25h29.2c-.4-1.6-.9-3.1-1.5-4.6H32z"/><path fill="#fff" d="M32 29.7h29.9c-.1-1.6-.4-3.1-.7-4.6H32z"/><path fill="#ed4c5c" d="M61.9 29.7H32V32H2c0 .8 0 1.5.1 2.3h59.8c.1-.8.1-1.5.1-2.3s0-1.6-.1-2.3"/><path fill="#fff" d="M2.8 38.9h58.4c.4-1.5.6-3 .7-4.6H2.1c.1 1.5.4 3.1.7 4.6"/><path fill="#ed4c5c" d="M4.3 43.5h55.4c.6-1.5 1.1-3 1.5-4.6H2.8c.4 1.6.9 3.1 1.5 4.6"/><path fill="#fff" d="M6.7 48.1h50.6c.9-1.5 1.7-3 2.4-4.6H4.3c.7 1.6 1.5 3.1 2.4 4.6"/><path fill="#ed4c5c" d="M10.3 52.7h43.4c1.3-1.4 2.6-3 3.6-4.6H6.7c1 1.7 2.3 3.2 3.6 4.6"/><path fill="#fff" d="M15.9 57.3h32.2c2.1-1.3 3.9-2.9 5.6-4.6H10.3c1.7 1.8 3.6 3.3 5.6 4.6"/><path fill="#ed4c5c" d="M32 62c5.9 0 11.4-1.7 16.1-4.7H15.9c4.7 3 10.2 4.7 16.1 4.7"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2c-5.9 0-11.3 1.7-16 4.6"/></svg>;
const FlagSRB = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#ed4c5c" d="M15.5 21.7v16.2C15.5 43.5 20.2 48 26 48s10.5-4.5 10.5-10.1V21.7z"/><path fill="#fff" d="m29.8 46.3l-.2-.9l-.8-1.4l.3-.2l-.2-.9l-.7-1.1l.2-.1l-.2-.9l-.5-1l.8-1.5l.5 1.6l.4-.6l.6.9l.2-.6l.6.3l-.1-1.2l1.4.4l-1-1.3h.1l-.8-1.6l.2-.6l.5 1l.2-.4l.8 2.2v-.1l.4.8l.2-.4l.8 1.6l.3-.9l1.2.9s-.1-3-.1-3.9c.2-2.6 1.1-7.9.4-10.3c-.3-1.2-2.7-4.1-2.7-4.1s-.1 3.5-.7 4.6c-.2.4-2 1.5-2 1.5l-.7-.1l.3-.1l-1.3-1.3l.5-2.6l1.3-1.9l-2 .1l-1.5.4l.4.6l-.9 3.2l-.9-3.1l.4-.6l-1.5-.5l-2-.1l1.3 1.9l.5 2.6l-1.3 1.3l.3.1l-.8.2s-1.8-1.1-2-1.5c-.6-1-.7-4.6-.7-4.6s-2.4 2.9-2.7 4.1c-.7 2.5.3 7.8.4 10.3c.1 1-.1 3.9-.1 3.9l1.2-.9l.3.9l.8-1.6l.2.4l.4-.8v.1l.8-2.2l.2.4l.5-1l.2.6l-.8 1.6h.1l-1 1.3l1.4-.4V40l.6-.3l.2.6l.6-.9l.4.6l.5-1.6l.8 1.5l-.5 1l-.2.9l.2.1l-.7 1.1l-.2.9l.3.2l-.7 1.5l-.2.9z"/></svg>;

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
    if (snow >= 100) return { color: '#ef4444', txt: 'JAPAN STYLE', icon: <Rocket size={14}/> };
    if (snow >= 50) return { color: '#8b5cf6', txt: 'DEEP POWDER', icon: <Snowflake size={14}/> };
    if (snow >= 20) return { color: '#3b82f6', txt: 'POWDER DAY', icon: <Snowflake size={14}/> };
    if (snow >= 5) return { color: '#22c55e', txt: 'RIDEABLE', icon: <Zap size={14}/> };
    return { color: '#94a3b8', txt: 'SKIP', icon: <CircleSlash size={14}/> };
  };

  const getWeatherIcon = (code: number) => {
    const isNight = new Date().getHours() > 19 || new Date().getHours() < 6;
    if (code >= 71) return <CloudSnow size={28} className="text-white/80" />;
    if (code >= 51) return <CloudRain size={28} className="text-white/80" />;
    if (code >= 1) return <Cloud size={28} className="text-white/80" />;
    if (isNight) return <Moon size={28} className="text-white/80" />;
    return <Sun size={28} className="text-white/80" />;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20 font-sans">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-lg"><Snowflake size={24}/></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Balkan<span className="text-[#A855F7] ml-1">Freeride</span></h1>
        </Link>
        <div className="flex gap-4 items-center">
          <button type="button" onClick={() => setLang(l => l==='sr'?'en':'sr')} className="cursor-pointer">{lang==='sr' ? <FlagSRB/> : <FlagUSA/>}</button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-6 py-6 bg-white dark:bg-white/5 border border-black/5 rounded-[2.5rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <MapIcon size={20} className="text-[#A855F7]" /> {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
          <div className="h-[550px] mb-10 rounded-[3.5rem] overflow-hidden border border-black/5 shadow-2xl bg-white dark:bg-[#020617]">
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
             [...Array(6)].map((_, i) => <div key={i} className="h-[600px] bg-slate-100 dark:bg-white/5 rounded-[4rem] animate-pulse" />)
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
                <Link key={resort.id} href={`/resort/${resort.id}`} className="group bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 hover:shadow-2xl transition-all duration-500 block">
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>

                  <div className="mb-8">
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-slate-900 transition-none">{resort.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 dark:text-white">{resort.country}</p>
                  </div>
                  
                  <div className="h-64 rounded-[3.5rem] p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-xl" style={{ backgroundColor: s.color }}>
                    <div className="flex items-baseline justify-center gap-1 mt-4">
                      <span className="text-8xl font-black italic tracking-tighter">+{snow.toFixed(0)}</span>
                      <span className="text-xl font-black italic opacity-60">cm</span>
                    </div>

                    <div className="bg-black/10 backdrop-blur-md p-6 rounded-3xl flex justify-between items-center">
                       <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Precipitation</span>
                          <span className="text-sm font-black italic">{totalPrec.toFixed(1)} mm</span>
                       </div>
                       <div className="flex flex-col gap-1 text-right">
                          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest text-blue-200">Rain</span>
                          <span className="text-sm font-black italic text-blue-100">{rain.toFixed(1)} mm</span>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2rem] flex items-center justify-center border border-black/5">
                       {getWeatherIcon(resort.current?.weather_code)}
                    </div>
                    {/* VERTIKALNO PORAVNANJE IKONA I VREDNOSTI */}
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-black/5 gap-2">
                       <Thermometer size={16} className="opacity-30" />
                       <span className="text-xl font-black italic leading-none">{resort.current?.temperature_2m}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-black/5 gap-2">
                       <Navigation size={16} style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="text-[#A855F7] opacity-60" />
                       <div className="flex flex-col items-center leading-none">
                         <span className="text-xl font-black italic">{resort.current?.wind_speed_10m}</span>
                         <span className="text-[7px] font-black opacity-30 uppercase tracking-tighter">km/h</span>
                       </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}