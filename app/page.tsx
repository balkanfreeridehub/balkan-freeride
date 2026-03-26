"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import ThemeToggle from '@/components/ThemeToggle';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Zap, Rocket, CircleSlash } from 'lucide-react';

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

  const getStatus = (snow: number) => {
    if (snow >= 40) return { color: '#9333ea', txt: lang==='sr'?'EPSKI SNEG':'DEEP POWDER', icon: <Rocket size={14}/> };
    if (snow >= 15) return { color: '#3b82f6', txt: lang==='sr'?'ODLIČNO':'POWDER DAY', icon: <Snowflake size={14}/> };
    if (snow >= 5) return { color: '#22c55e', txt: lang==='sr'?'MOŽE':'RIDEABLE', icon: <Zap size={14}/> };
    return { color: '#94a3b8', txt: lang==='sr'?'SUVO':'NO SNOW', icon: <CircleSlash size={14}/> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] pb-20">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Snowflake /></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-blue-600">Freeride</span></h1>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="font-black text-xs uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-lg">
            {lang === 'sr' ? 'EN 🇬🇧' : 'SR 🇷🇸'}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* TIME SLIDER */}
        <div className="flex justify-center mb-10 overflow-x-auto py-2">
          <div className="bg-white dark:bg-white/5 p-2 rounded-3xl border border-black/5 flex gap-2">
            {TIMES.map(t => (
              <button key={t.v} onClick={() => setTimeframe(t.v)} className={`px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all ${timeframe === t.v ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 dark:hover:bg-white/10'}`}>
                {t.l}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setShowMap(!showMap)} className="w-full mb-10 py-6 bg-white dark:bg-white/5 border border-black/5 rounded-[2.5rem] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
          <MapIcon size={20} className="text-blue-600" /> {showMap ? (lang==='sr'?'Zatvori Mapu':'Hide Map') : (lang==='sr'?'Prikaži Mapu':'Show Map')}
        </button>

        {showMap && (
          <div className="h-[600px] mb-20 rounded-[3.5rem] overflow-hidden border border-black/5 bg-slate-100 shadow-inner">
            <BalkanMap resorts={resorts} timeframe={timeframe} onSelect={(r:any)=>router.push(`/resort/${r.id}`)} getStatus={getStatus} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-[500px] bg-white dark:bg-white/5 rounded-[4rem] p-10 border border-black/5 animate-[pulse_2s_infinite]">
                 <div className="w-32 h-8 bg-slate-200 dark:bg-slate-800 rounded-full mb-8" />
                 <div className="w-full h-48 bg-slate-100 dark:bg-slate-800/50 rounded-[3rem] mb-10" />
                 <div className="space-y-4">
                    <div className="w-full h-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl" />
                    <div className="w-2/3 h-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl" />
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
                <div key={resort.id} onClick={()=>router.push(`/resort/${resort.id}`)} className="group bg-white dark:bg-white/5 p-10 rounded-[4rem] border border-black/5 cursor-pointer hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-4 transition-all duration-500">
                  <div className="flex justify-between items-start mb-8">
                    <div className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2" style={{ backgroundColor: s.color + '20', color: s.color }}>
                      {s.icon} {s.txt}
                    </div>
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 group-hover:text-blue-600 transition-colors">{resort.name}</h3>
                  
                  <div className="h-48 rounded-[3rem] flex flex-col items-center justify-center mb-10 relative overflow-hidden" style={{ backgroundColor: s.color }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <span className="text-7xl font-black italic text-white z-10">+{snow.toFixed(1)}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-white/60 z-10">cm SNOW</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] flex flex-col items-center">
                       <Thermometer size={16} className="mb-2 opacity-30" />
                       <span className="text-2xl font-black">{resort.current?.temperature_2m}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem] flex flex-col items-center">
                       <CloudRain size={16} className={`mb-2 ${rain > 0 ? 'text-blue-400' : 'opacity-30'}`} />
                       <span className="text-2xl font-black">{rain.toFixed(1)}<span className="text-[10px] ml-1">mm</span></span>
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