"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Wind, CloudRain, Navigation, Droplets } from 'lucide-react';
import { FLAGS, getStatus } from '@/constants/design';
import ThemeToggle from '@/components/ThemeToggle';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);

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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        </Link>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button className="hover:scale-110 transition-transform cursor-pointer"><FLAGS.SRB /></button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-center mb-12 overflow-x-auto pb-4 no-scrollbar">
           <div className="bg-white dark:bg-white/5 p-1.5 rounded-full border border-black/5 dark:border-white/10 flex gap-1 shadow-sm">
             {[6, 12, 24, 48, 72, 120, 168, 240].map(v => (
               <button key={v} onClick={() => setTimeframe(v)} className={`px-6 py-3 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${timeframe === v ? 'bg-[#3b82f6] text-white shadow-lg' : 'opacity-40 dark:text-white'}`}>
                 {v < 24 ? `${v}h` : v === 24 ? '1 Dan' : `${v/24}d`}
               </button>
             ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <Link key={resort.id} href={`/resort/${resort.id}`} className="bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-black/5 dark:border-white/5 block group hover:translate-y-[-8px] hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] transition-all duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-6 shadow-md" style={{ backgroundColor: s.color }}>
                  {s.icon} {s.txt}
                </div>

                {/* Naziv planine NE menja boju */}
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 dark:text-white transition-none">{resort.name}</h3>
                
                <div className="h-64 rounded-[3rem] p-8 flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner" style={{ backgroundColor: s.color }}>
                   <div className="flex items-baseline gap-1">
                      <span className="text-8xl font-black tracking-tighter">{snow.toFixed(0)}</span>
                      <span className="text-2xl font-black opacity-40 uppercase">cm</span>
                   </div>
                   <div className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mt-1">Sneg</div>
                   
                   {/* Prikaz padavina - Objašnjeno korisniku */}
                   <div className="absolute bottom-6 flex flex-col items-center gap-1 w-full px-8">
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden flex">
                         <div className="h-full bg-white" style={{ width: `${(snow/(prec+0.1))*100}%` }}></div>
                         <div className="h-full bg-blue-400" style={{ width: `${(rain/(prec+0.1))*100}%` }}></div>
                      </div>
                      <div className="flex justify-between w-full text-[8px] font-black uppercase opacity-80 tracking-tighter">
                         <span>Ukupno: {prec.toFixed(1)}mm</span>
                         {rain > 0 && <span className="text-blue-200 italic">Kiša: {rain.toFixed(1)}mm</span>}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                     <Snowflake size={32} className="text-blue-400 dark:text-blue-300" />
                  </div>
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                     <Thermometer size={24} className="opacity-30 mb-2 dark:text-white" />
                     <span className="text-xl font-black dark:text-white leading-none">{resort.current?.temperature_2m.toFixed(0)}°C</span>
                  </div>
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/5">
                     <Navigation 
                        size={24} 
                        fill="currentColor" // FILOVANA IKONA
                        className="opacity-30 mb-2 dark:text-white" 
                        style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} 
                     />
                     <span className="text-xl font-black dark:text-white leading-none">{resort.current?.wind_speed_10m.toFixed(0)}<span className="text-[10px] ml-0.5">kmh</span></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}