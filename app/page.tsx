"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import ThemeToggle from '@/components/ThemeToggle';
import { Snowflake, Map as MapIcon, Thermometer, Wind, Rocket, Zap, CircleSlash, Navigation, Cloud, Sun, CloudRain, CloudSnow, Moon } from 'lucide-react';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

// TVOJI SVETI SVG-OVI
const FlagUSA = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#ed4c5c" d="M32 15.8h25.3c-1.1-1.7-2.3-3.2-3.6-4.6H32z"/><path fill="#fff" d="M32 20.4h27.7c-.7-1.6-1.5-3.2-2.4-4.6H32z"/><path fill="#ed4c5c" d="M32 25h29.2c-.4-1.6-.9-3.1-1.5-4.6H32z"/><path fill="#fff" d="M32 29.7h29.9c-.1-1.6-.4-3.1-.7-4.6H32z"/><path fill="#ed4c5c" d="M61.9 29.7H32V32H2c0 .8 0 1.5.1 2.3h59.8c.1-.8.1-1.5.1-2.3s0-1.6-.1-2.3"/><path fill="#fff" d="M2.8 38.9h58.4c.4-1.5.6-3 .7-4.6H2.1c.1 1.5.4 3.1.7 4.6"/><path fill="#ed4c5c" d="M4.3 43.5h55.4c.6-1.5 1.1-3 1.5-4.6H2.8c.4 1.6.9 3.1 1.5 4.6"/><path fill="#fff" d="M6.7 48.1h50.6c.9-1.5 1.7-3 2.4-4.6H4.3c.7 1.6 1.5 3.1 2.4 4.6"/><path fill="#ed4c5c" d="M10.3 52.7h43.4c1.3-1.4 2.6-3 3.6-4.6H6.7c1 1.7 2.3 3.2 3.6 4.6"/><path fill="#fff" d="M15.9 57.3h32.2c2.1-1.3 3.9-2.9 5.6-4.6H10.3c1.7 1.8 3.6 3.3 5.6 4.6"/><path fill="#ed4c5c" d="M32 62c5.9 0 11.4-1.7 16.1-4.7H15.9c4.7 3 10.2 4.7 16.1 4.7"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2c-5.9 0-11.3 1.7-16 4.6"/></svg>;
const FlagSRB = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#ed4c5c" d="M15.5 21.7v16.2C15.5 43.5 20.2 48 26 48s10.5-4.5 10.5-10.1V21.7z"/><path fill="#fff" d="m29.8 46.3l-.2-.9l-.8-1.4l.3-.2l-.2-.9l-.7-1.1l.2-.1l-.2-.9l-.5-1l.8-1.5l.5 1.6l.4-.6l.6.9l.2-.6l.6.3l-.1-1.2l1.4.4l-1-1.3h.1l-.8-1.6l.2-.6l.5 1l.2-.4l.8 2.2v-.1l.4.8l.2-.4l.8 1.6l.3-.9l1.2.9s-.1-3-.1-3.9c.2-2.6 1.1-7.9.4-10.3c-.3-1.2-2.7-4.1-2.7-4.1s-.1 3.5-.7 4.6c-.2.4-2 1.5-2 1.5l-.7-.1l.3-.1l-1.3-1.3l.5-2.6l1.3-1.9l-2 .1l-1.5.4l.4.6l-.9 3.2l-.9-3.1l.4-.6l-1.5-.5l-2-.1l1.3 1.9l.5 2.6l-1.3 1.3l.3.1l-.8.2s-1.8-1.1-2-1.5c-.6-1-.7-4.6-.7-4.6s-2.4 2.9-2.7 4.1c-.7 2.5.3 7.8.4 10.3c.1 1-.1 3.9-.1 3.9l1.2-.9l.3.9l.8-1.6l.2.4l.4-.8v.1l.8-2.2l.2.4l.5-1l.2.6l-.8 1.6h.1l-1 1.3l1.4-.4V40l.6-.3l.2.6l.6-.9l.4.6l.5-1.6l.8 1.5l-.5 1l-.2.9l.2.1l-.7 1.1l-.2.9l.3.2l-.7 1.5l-.2.9z"/><path fill="#ffce31" d="m20 41.7l.2-.4l.9-.4l.6-.2h.4l.1-.1l-.6-.3l-.1-.1l-.5.2l-.4.3l.8-1l.7-1.6l-1.1.7l-1 1.8l-.4.2h-1l-.5-.1l-.6.3l.1.1h.4l.4.2l.9-.1l-1 .3l-.2.4v.6h.1l.1-.3h.5l.9-.8l-.7 1.1l-.1.5l.3.7l.2-.1v-.5l.4-.4zm11.9 0l-.1-.4l-.9-.4l-.6-.2h-.4l-.1-.1l.6-.3l.1-.1l.5.2l.4.3l-.8-1l-.7-1.6l1.1.7l1 1.8l.4.2h1l.5-.1l.6.3l-.1.1H34l-.4.2l-.9-.1l1 .3l.2.4v.6h-.1l-.1-.3h-.5l-.9-.8l.7 1.1l.1.5l-.3.7l-.2-.1v-.5l-.4-.4zM21.4 22.2c-1 .1-.9.8 0 1.7c.2.2.2.2.3 0c.1-.3.4-.5.6-.3c.1.2.1.3.5.2c.1.1.3.2.4.3c-.1 0-.5.1-1.1.2c-.5.1-.8-.1-1.2-.5c.1.5 1.3.8 1.2.8c.1.2.1.3.2.3c.4.1.8-.2 1.2-.1c.9.2-.6-2.3-.5-2.4c.1-.2-1.3-.6-1.6-.2m8.2 2.8c.1 0 .1 0 .2-.3c-.1 0 1.1-.3 1.2-.8c-.3.4-.7.6-1.2.5c-.6-.1-1-.3-1.1-.2c.1-.1.2-.2.4-.3c.4.1.4 0 .5-.2c.2-.2.5-.1.6.3q0 .3.3 0c.9-.9 1-1.6 0-1.7c-.2-.4-1.6 0-1.5.3c0 .1-1.4 2.6-.5 2.4c.3-.2.7 0 1.1 0"/><path fill="#ed4c5c" d="M21.6 28.6v7.3c0 2.2 2 4 4.4 4s4.4-1.8 4.4-4v-7.3z"/><g fill="#fff"><path d="M24.8 27.3h2.5v15h-2.5z"/><path d="M19.1 32.3h13.8v2.5H19.1zm4.9-1.9l-1 1l.3-1l-.3-.9zm0 6.3l-1 1l.3-1l-.3-1zm4-6.3l1 1l-.2-1l.2-.9zm0 6.3l1 1l-.2-1l.2-1z"/></g><path fill="#428bc1" d="M27 11.7h-2v2h2z"/><path fill="#ffce31" d="m25.1 10.4l.2.1l.2-.1h.3v1.2H25v.4h2v-.4h-.8v-1.2h.3l.2.1l.2-.1l.2-.2l-.2-.2l-.2-.2l-.2.2h-.3v-.4l.2-.2l-.2-.2L26 9l-.2.2l-.2.2l.2.2v.4h-.3l-.2-.2l-.2.2l-.2.2zm7.4 4c-1.3-.7-2.1-.9-2.4-.4c0 0 0 .1-.1.1c-1.6-.8-2.8-.9-4-.4c-1.2-.5-2.3-.4-4 .4c0-.1 0-.1-.1-.1c-.3-.5-1.1-.4-2.4.4c-1.3.7-2.5 1.7-2.2 2.1c.1.7.5 1.3 1.2 2c.8.4 2.4.5 4.1.4c2.2-.1 4.5-.1 6.7 0c1.7.1 3.3 0 4.1-.4c.7-.7 1.1-1.3 1.2-2c.4-.3-.9-1.3-2.1-2.1"/><path fill="#ed4c5c" d="M27.4 17.2c.8-.7 1.3-1.4 1.7-2.1c-.7-.2-1.4-.3-2-.2c.1.8.2 1.6.3 2.3m-2.8 0c.1-.8.2-1.6.4-2.4c-.6-.1-1.3 0-2 .2c.2.8.8 1.5 1.6 2.2m8-1.4c-.1-.1-.3-.3-.6-.4s-.6-.2-.8-.2c-.1.8-.4 1.6-1.1 2.4c.3 0 .6-.1.8-.2c.8-.4 1.3-.9 1.7-1.3q.15-.15 0-.3m-11.8-.7c-.2 0-.5.1-.8.2c-.5.2-.8.6-.6.7c.4.4.9.8 1.7 1.3c.2.1.5.1.8.2c-.7-.8-1-1.5-1.1-2.4"/><path fill="#ffce31" d="M18.6 18.5h14.8v2H18.6z"/><path fill="#428bc1" d="m18.6 18.9l-.4.7l.5.5l.7-.7zm14.8 0l-.8.5l.7.7l.5-.5zm-7.4-.5l-.8.7l.8.6l.8-.6z"/><path fill="#ed4c5c" d="m22.3 19.8l.7-.7l-.8-.5l-.7.6zm7.4 0l.8-.6l-.7-.6l-.8.5z"/></svg>;

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
    if (code === 0 && isNight) return <Moon size={24} className="text-white/80" />;
    if (code >= 71) return <CloudSnow size={24} className="text-white/80" />;
    if (code >= 51) return <CloudRain size={24} className="text-white/80" />;
    if (code >= 1) return <Cloud size={24} className="text-white/80" />;
    return <Sun size={24} className="text-white/80" />;
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
             [...Array(6)].map((_, i) => <div key={i} className="h-[550px] bg-slate-100 dark:bg-white/5 rounded-[4rem] animate-pulse" />)
          ) : (
            resorts.map((resort) => {
              let snow = 0; let totalPrec = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                totalPrec += p;
                if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.2;
              });
              const rain = Math.max(0, totalPrec - (snow / 1.2));
              const s = getStatus(snow);

              return (
                <Link key={resort.id} href={`/resort/${resort.id}`} className="group bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 hover:shadow-2xl transition-all duration-500 block">
                  
                  {/* 1. KATEGORIJA PILL */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>

                  {/* 2. IME I DRŽAVA */}
                  <div className="mb-8">
                    <h3 className="text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white group-hover:text-slate-900 transition-none">{resort.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 dark:text-white">{resort.country}</p>
                  </div>
                  
                  {/* 3. VELIKI BOX SA SNEGOM I PADAVINAMA */}
                  <div className="h-64 rounded-[3.5rem] p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-xl" style={{ backgroundColor: s.color }}>
                    <div className="flex items-baseline justify-center gap-1 mt-4">
                      <span className="text-8xl font-black italic tracking-tighter">+{snow.toFixed(0)}</span>
                      <span className="text-xl font-black italic opacity-60">cm</span>
                    </div>

                    <div className="bg-black/10 backdrop-blur-md p-5 rounded-3xl flex justify-between items-center">
                       <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black uppercase opacity-60 tracking-widest">Total Prec:</span>
                             <span className="text-xs font-black italic">{totalPrec.toFixed(1)}mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black uppercase opacity-60 tracking-widest text-blue-300">Rain:</span>
                             <span className="text-xs font-black italic text-blue-200">{rain.toFixed(1)}mm</span>
                          </div>
                       </div>
                       <div className="h-10 w-[1px] bg-white/20 mx-2" />
                       <div className="text-right">
                          <div className="text-[8px] font-black uppercase opacity-60 tracking-widest mb-1 text-center">Snow Only</div>
                          <div className="text-xs font-black italic">{(snow).toFixed(1)}cm</div>
                       </div>
                    </div>
                  </div>

                  {/* 4. TRI BOXA STATUS */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-black/5">
                       {getWeatherIcon(resort.current?.weather_code)}
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-black/5">
                       <Thermometer size={14} className="mb-1 opacity-20" />
                       <span className="text-lg font-black italic">{resort.current?.temperature_2m}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center justify-center border border-black/5">
                       <div className="flex items-center gap-1">
                          <Navigation size={14} style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="text-[#A855F7]" />
                          <span className="text-lg font-black italic">{resort.current?.wind_speed_10m}</span>
                       </div>
                       <span className="text-[8px] font-black opacity-30 uppercase">km/h</span>
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