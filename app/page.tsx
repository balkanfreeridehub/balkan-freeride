"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import ThemeToggle from '@/components/ThemeToggle';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Zap, Rocket, CircleSlash, Navigation } from 'lucide-react';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const TIMES = [
  { l: '6h', v: 6 }, { l: '12h', v: 12 }, { l: '1d', v: 24 }, { l: '2d', v: 48 }, 
  { l: '3d', v: 72 }, { l: '5d', v: 120 }, { l: '7d', v: 168 }, { l: '10d', v: 240 }
];

export default function Home() {
  const router = useRouter();
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

  // TVOJE KATEGORIJE I BOJE
  const getStatus = (snow: number) => {
    if (snow >= 50) return { color: '#8b57ff', txt: 'DEEP POWDER', icon: <Rocket size={14}/> };
    if (snow >= 20) return { color: '#8b57ff', txt: 'POWDER DAY', icon: <Snowflake size={14}/> };
    if (snow >= 10) return { color: '#22c55e', txt: 'RIDEABLE', icon: <Zap size={14}/> };
    return { color: '#94a3b8', txt: 'SKIP', icon: <CircleSlash size={14}/> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-10 h-10 bg-[#8b57ff] rounded-xl flex items-center justify-center text-white"><Snowflake /></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-[#8b57ff]">Freeride</span></h1>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="font-black text-[10px] uppercase tracking-widest px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full hover:bg-[#8b57ff] hover:text-white transition-all">
            {lang === 'sr' ? 'SRB 🇷🇸' : 'ENG 🇬🇧'}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* TIME SLIDER - #8b57ff BOJA */}
        <div className="flex justify-center mb-10 overflow-x-auto py-2">
          <div className="bg-white dark:bg-white/5 p-2 rounded-[2rem] border border-black/5 flex gap-2">
            {TIMES.map(t => (
              <button key={t.v} onClick={() => setTimeframe(t.v)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${timeframe === t.v ? 'bg-[#8b57ff] text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setShowMap(!showMap)} className="w-full mb-10 py-6 bg-white dark:bg-white/5 border border-black/5 rounded-[2.5rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
          <MapIcon size={20} className="text-[#8b57ff]" /> {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
          <div className="h-[600px] mb-20 rounded-[3.5rem] overflow-hidden border border-black/5 bg-slate-100 shadow-inner">
            <BalkanMap resorts={resorts} timeframe={timeframe} onSelect={(r:any)=>router.push(`/resort/${r.id}`)} getStatus={getStatus} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             [...Array(6)].map((_, i) => (
              <div key={i} className="h-[520px] bg-white dark:bg-white/5 rounded-[4rem] p-10 border border-black/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                <div className="w-32 h-8 bg-slate-200 dark:bg-slate-800 rounded-full mb-8" />
                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800/50 rounded-[3rem] mb-10" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl" />
                    <div className="h-20 bg-slate-50 dark:bg-slate-800/30 rounded-3xl" />
                </div>
              </div>
            ))
          ) : (
            resorts.map((resort) => {
              let snow = 0; let rain = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                if (p > 0) {
                  if (resort.hourly.temperature_2m[i] <= 1) snow += p * 1.2;
                  else rain += p;
                }
              });
              const s = getStatus(snow);

              return (
                <div key={resort.id} onClick={()=>router.push(`/resort/${resort.id}`)} className="group bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 cursor-pointer hover:shadow-2xl hover:-translate-y-4 transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ backgroundColor: s.color + '20', color: s.color }}>
                      {s.icon} {s.txt}
                    </div>
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 transition-colors group-hover:text-black dark:group-hover:text-white">
                    {resort.name}
                  </h3>
                  
                  <div className="h-48 rounded-[3rem] flex flex-col items-center justify-center mb-10 relative overflow-hidden" style={{ backgroundColor: s.color }}>
                    <span className="text-7xl font-black italic text-white">+{snow.toFixed(1)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60">cm SNOW</span>
                  </div>

                  {/* CURRENT STATUS GRID */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] flex flex-col items-center border border-black/5">
                       <Thermometer size={14} className="mb-2 opacity-30" />
                       <span className="text-xl font-black">{resort.current?.temperature_2m}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] flex flex-col items-center border border-black/5">
                       <CloudRain size={14} className={`mb-2 ${rain > 0 ? 'text-blue-400' : 'opacity-30'}`} />
                       <span className="text-xl font-black">{rain.toFixed(1)}<span className="text-[10px] ml-1">mm</span></span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] flex flex-col items-center border border-black/5 col-span-2 relative">
                       <Wind size={14} className="mb-2 opacity-30" />
                       <div className="flex items-center gap-3">
                         <span className="text-xl font-black">{resort.current?.wind_speed_10m}<span className="text-[10px] ml-1 uppercase">kmh</span></span>
                         <Navigation size={14} style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="text-[#8b57ff]" />
                       </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}