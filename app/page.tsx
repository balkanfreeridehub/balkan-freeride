"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Navigation, Sun, Wind } from 'lucide-react';
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
    <div className="min-h-screen transition-colors duration-500">
      <nav className="sticky top-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
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
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 resort-card rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm">
          <MapIcon size={20} /> {showMap ? (lang === 'sr' ? 'Zatvori Mapu' : 'Close Map') : (lang === 'sr' ? 'Prikaži Mapu' : 'Show Map')}
        </button>

        {showMap && (
          <div className="h-[550px] mb-12 rounded-[3.5rem] overflow-hidden border border-black/5 dark:border-white/10 relative shadow-2xl bg-white dark:bg-black/20">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} />
          </div>
        )}

        <div className="flex justify-center mb-16 overflow-x-auto pb-4 no-scrollbar">
           <div className="slider-container p-1.5 rounded-full flex gap-1 bg-slate-100/50 dark:bg-white/5 backdrop-blur-md">
             {[6, 12, 24, 48, 72, 120, 168, 240].map(v => (
               <button 
                key={v} 
                onClick={() => setTimeframe(v)} 
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer whitespace-nowrap ${timeframe === v ? 'bg-[#3b82f6] text-white shadow-lg scale-105' : 'opacity-40 hover:opacity-100 dark:text-white'}`}
               >
                 {v < 24 ? `${v}h` : v === 24 ? (lang === 'sr' ? '1 Dan' : '1 Day') : `${v/24}d`}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? [1,2,3,4,5,6].map(i => <div key={i} className="h-[450px] bg-slate-200 dark:bg-white/5 animate-pulse rounded-[3rem]" />) : 
           resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <div key={resort.id} className="resort-card p-8 rounded-[3rem] block group border border-black/5 dark:border-white/5 bg-white dark:bg-[#0f172a] shadow-xl hover:-translate-y-2 transition-all duration-500">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white group-hover:text-[#3b82f6] transition-colors">{resort.name}</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>
                </div>
                
                {/* Glavni Snow Prikaz - Čistiji dizajn */}
                <div className="h-48 rounded-[2.5rem] flex flex-col justify-center items-center text-slate-800 dark:text-white mb-8 border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5 shadow-inner">
                   <div className="flex items-baseline gap-1">
                      <span className="text-7xl font-black tracking-tighter tabular-nums">{snow.toFixed(0)}</span>
                      <span className="text-xl font-black opacity-30 uppercase italic">cm</span>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">Predicted Snow</span>
                </div>

                {/* Tabela Padavina - Umesto linije */}
                <div className="mb-8 rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <tbody>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="p-3 font-bold uppercase tracking-wider opacity-50 dark:text-white italic">Total Precipitation</td>
                        <td className="p-3 text-right font-black dark:text-white tabular-nums">{prec.toFixed(1)} mm</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold uppercase tracking-wider opacity-50 dark:text-white italic">Probable Rain</td>
                        <td className="p-3 text-right font-black text-blue-500 tabular-nums">{rain.toFixed(1)} mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tri Boxića: Ikona | Temp | Wind */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square bg-slate-100/50 dark:bg-white/5 rounded-[1.8rem] flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5">
                      <Sun size={24} className="text-amber-400 mb-1" />
                  </div>
                  <div className="aspect-square bg-slate-100/50 dark:bg-white/5 rounded-[1.8rem] flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5">
                      <span className="text-[8px] font-black uppercase opacity-40 dark:text-white mb-1">Temp</span>
                      <span className="text-lg font-black dark:text-white tabular-nums leading-none">{resort.current?.temperature_2m.toFixed(0)}°</span>
                  </div>
                  <div className="aspect-square bg-slate-100/50 dark:bg-white/5 rounded-[1.8rem] flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5">
                      <span className="text-[8px] font-black uppercase opacity-40 dark:text-white mb-1">Wind</span>
                      <div className="flex items-center gap-1">
                        <Navigation 
                          size={14} 
                          fill="currentColor"
                          className="text-[#3b82f6]" 
                          style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} 
                        />
                        <span className="text-lg font-black dark:text-white tabular-nums leading-none">{resort.current?.wind_speed_10m.toFixed(0)}</span>
                      </div>
                  </div>
                </div>

                <Link href={`/resort/${resort.id}`} className="mt-8 w-full py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest text-center block hover:bg-[#3b82f6] dark:hover:bg-[#3b82f6] dark:hover:text-white transition-colors">
                  {lang === 'sr' ? 'Detaljna Prognoza' : 'Full Forecast'}
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}