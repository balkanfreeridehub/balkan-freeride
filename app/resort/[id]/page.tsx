"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { Snowflake, Wind, Thermometer, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ResortPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const resort = balkanResorts.find(r => r.id === id);

  useEffect(() => {
    if (resort) {
      getWeatherData(resort.lat, resort.lon).then(setData);
    }
  }, [resort]);

  if (!resort || !data) return <div className="p-20 text-center font-black uppercase opacity-20">Loading Mountain...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] p-8">
      <Link href="/" className="inline-flex items-center gap-2 mb-10 font-black uppercase text-[10px] tracking-widest opacity-40 hover:opacity-100 transition-opacity">
        <ChevronLeft size={16} /> Nazad na listu
      </Link>

      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <h1 className="text-7xl font-black uppercase tracking-tighter mb-4">{resort.name}</h1>
          <div className="flex gap-4">
             <span className="px-4 py-2 bg-slate-100 dark:bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">{resort.country}</span>
             <span className="px-4 py-2 bg-[#A855F7] text-white rounded-full text-[10px] font-black uppercase tracking-widest">{resort.lat.toFixed(2)}N, {resort.lon.toFixed(2)}E</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
           {/* Detailed stats here */}
           <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] text-center border border-black/5">
              <Thermometer size={40} className="mx-auto mb-4 text-[#A855F7]" />
              <div className="text-5xl font-black mb-2">{data.current.temperature_2m}°C</div>
              <div className="text-[10px] font-black uppercase opacity-30 tracking-widest">Temperatura</div>
           </div>
           <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] text-center border border-black/5">
              <Wind size={40} className="mx-auto mb-4 text-[#A855F7]" />
              <div className="text-5xl font-black mb-2">{data.current.wind_speed_10m}</div>
              <div className="text-[10px] font-black uppercase opacity-30 tracking-widest">Vetar (km/h)</div>
           </div>
           <div className="bg-slate-50 dark:bg-white/5 p-10 rounded-[3rem] text-center border border-black/5">
              <Snowflake size={40} className="mx-auto mb-4 text-[#A855F7]" />
              <div className="text-5xl font-black mb-2">PRO</div>
              <div className="text-[10px] font-black uppercase opacity-30 tracking-widest">Prognoza</div>
           </div>
        </div>

        {/* Forecast Table / Charts can go here */}
        <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl">
           <h2 className="text-2xl font-black uppercase mb-8 tracking-widest">7 Day Outlook</h2>
           <div className="space-y-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b border-white/10">
                   <span className="font-black opacity-40 uppercase text-xs">Day {i+1}</span>
                   <span className="font-black text-xl italic">+{(Math.random()*15).toFixed(0)}cm</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}