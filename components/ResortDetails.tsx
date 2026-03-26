"use client"
import React from 'react'
import { X, Thermometer, Droplets, Wind, Navigation2, Snowflake, Cloud, CloudRain } from 'lucide-material'

export default function ResortDetails({ resort, onClose, lang }: { resort: any, onClose: () => void, lang: 'sr' | 'en' }) {
  if (!resort || !resort.hourly) return null;

  const next24h = resort.hourly.time.slice(0, 24).map((time: string, i: number) => {
    const t = resort.hourly.temperature_2m[i];
    const p = resort.hourly.precipitation[i] || 0;
    return {
      hour: new Date(time).getHours() + ":00",
      temp: Math.round(t),
      precip: p,
      isSnow: t <= 1 && p > 0,
      isRain: t > 1 && p > 0
    };
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-800 p-8 flex justify-between items-start text-white">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">{resort.name}</h2>
            <p className="text-[10px] font-bold opacity-70 tracking-[0.2em] uppercase">{resort.country}</p>
          </div>
          <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"><X size={24} /></button>
        </div>

        <div className="p-8">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
            {lang === 'sr' ? 'PROGNOZA PO SATIMA' : 'HOURLY FORECAST'}
          </h4>
          
          {/* APPLE STYLE TILES */}
          <div className="flex gap-3 overflow-x-auto pb-8 snap-x no-scrollbar">
            {next24h.map((h: any, i: number) => (
              <div key={i} className="flex-shrink-0 w-20 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2rem] py-6 flex flex-col items-center snap-center hover:scale-105 transition-transform">
                <span className="text-[10px] font-black text-slate-400 mb-4">{h.hour}</span>
                <div className="mb-4">
                  {h.isSnow ? <Snowflake size={20} className="text-blue-500" /> : 
                   h.isRain ? <CloudRain size={20} className="text-blue-400" /> : 
                   <Cloud size={20} className="text-slate-300" />}
                </div>
                <span className="text-xl font-black tracking-tighter">{h.temp}°</span>
                {h.precip > 0 && <span className="text-[9px] font-black text-blue-500 mt-1">{h.precip.toFixed(1)}</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem]">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-4"><Wind size={14}/> Wind</div>
               <div className="text-3xl font-black tracking-tighter">{resort.current?.windSpeed}<span className="text-xs opacity-30 ml-1">km/h</span></div>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-[2.5rem]">
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase mb-4"><Thermometer size={14}/> Feels Like</div>
               <div className="text-3xl font-black tracking-tighter">{resort.current?.temp ?? '--'}°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}