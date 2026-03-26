"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Droplets } from 'lucide-react';
import { FLAGS, getStatus } from '@/constants/design';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [isDark, setIsDark] = useState(true);

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
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-20 transition-colors">
        
        <nav className="sticky top-0 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12">
              <Snowflake size={24}/>
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* SWITCH TOGGLE */}
            <div 
              onClick={() => setIsDark(!isDark)}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isDark ? 'bg-[#3b82f6]' : 'bg-slate-300'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>

            <button onClick={() => setLang(l => l==='sr'?'en':'sr')} className="cursor-pointer hover:scale-110 transition-transform">
              {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />}
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* Skeleton Loader dok se podaci učitavaju */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="h-[400px] bg-white dark:bg-white/5 rounded-[3rem] animate-pulse border border-black/5"></div>
              ))}
            </div>
          ) : (
            <>
              <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 bg-white dark:bg-white/5 border border-black/5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 dark:text-white shadow-sm">
                <MapIcon size={20} /> {showMap ? 'Zatvori Mapu' : 'Prikaži Mapu'}
              </button>

              {showMap && (
                <div className="h-[500px] mb-12 rounded-[2.5rem] overflow-hidden border border-black/5 relative shadow-xl">
                  <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} isDark={isDark} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resorts.map((resort) => {
                  let snow = 0;
                  let rain = 0;
                  resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
                    if (p > 0) {
                      if (resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
                      else rain += p;
                    }
                  });
                  const s = getStatus(snow);

                  return (
                    <Link key={resort.id} href={`/resort/${resort.id}`} className="bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-black/5 block group hover:shadow-2xl transition-all duration-500">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-md" style={{ backgroundColor: s.color }}>
                        {s.icon} {s.txt}
                      </div>

                      <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-8">{resort.name}</h3>
                      
                      <div className="h-56 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner transition-transform group-hover:scale-[0.98]" style={{ backgroundColor: s.color }}>
                         <div className="text-7xl font-black tracking-tighter">{snow.toFixed(0)}</div>
                         <div className="text-[10px] font-black uppercase opacity-60">Sneg (cm)</div>
                         {rain > 0 && (
                           <div className="absolute bottom-4 flex items-center gap-1 text-[9px] font-black uppercase bg-black/20 px-3 py-1 rounded-full">
                             <CloudRain size={10} /> Rain: {rain.toFixed(1)}mm
                           </div>
                         )}
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                           <Thermometer size={20} className="opacity-30 mb-1 dark:text-white" />
                           <span className="text-lg font-black dark:text-white">{resort.current?.temperature_2m.toFixed(0)}°</span>
                        </div>
                        <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                           <Wind size={20} className="opacity-30 mb-1 dark:text-white" />
                           <span className="text-lg font-black dark:text-white">{resort.current?.wind_speed_10m.toFixed(0)}</span>
                        </div>
                        <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                           <Droplets size={20} className="opacity-30 mb-1 dark:text-white" />
                           <span className="text-[10px] font-black dark:text-white uppercase tracking-tighter">Prec: {resort.current?.relative_humidity_2m}%</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}