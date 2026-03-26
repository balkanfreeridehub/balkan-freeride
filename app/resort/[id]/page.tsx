"use client"
import React, { useEffect, useState, use } from 'react';
import { useParams } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { Snowflake, Thermometer, ChevronLeft, Wind, Droplets, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ResortPage() {
  const params = useParams();
  const id = params?.id;
  const [data, setData] = useState<any>(null);
  const [resort, setResort] = useState<any>(null);

  useEffect(() => {
    if (id) {
      // Dekodiramo ID u slučaju da URL ima čudne karaktere
      const decodedId = decodeURIComponent(id as string);
      const found = balkanResorts.find(r => r.id === decodedId);
      if (found) {
        setResort(found);
        getWeatherData(found.lat, found.lon).then(setData).catch(console.error);
      }
    }
  }, [id]);

  if (!resort) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617] text-black dark:text-white">
      <div className="w-12 h-12 border-4 border-[#3b82f6] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-widest text-xs opacity-50">Tražim planinu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors">
      {/* HEADER JE OVDE */}
      <nav className="p-8 flex justify-between items-center border-b border-black/5">
        <Link href="/" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-60 dark:text-white hover:opacity-100">
          <ChevronLeft size={16} /> Nazad
        </Link>
        <div className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
          Balkan<span className="text-[#3b82f6] ml-0.5">Freeride</span>
        </div>
        <div className="w-10"></div>
      </nav>

      {!data ? (
        <div className="max-w-6xl mx-auto px-8 py-16 animate-pulse">
           <div className="h-20 bg-slate-100 dark:bg-white/5 rounded-3xl mb-10 w-2/3"></div>
           <div className="grid grid-cols-3 gap-6">
              <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-[3rem]"></div>
              <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-[3rem]"></div>
              <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-[3rem]"></div>
           </div>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-8 py-16">
          <header className="mb-20">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="text-[#3b82f6]" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-50 dark:text-white">{resort.country}</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter dark:text-white leading-none mb-8">{resort.name}</h1>
          </header>

          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 dark:text-white mb-6">Current Conditions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-slate-50 dark:bg-white/5 p-12 rounded-[3.5rem] border border-black/5 text-center">
              <div className="flex justify-center mb-4"><Thermometer size={32} className="text-[#3b82f6]" /></div>
              <div className="text-6xl font-black dark:text-white">{data.current.temperature_2m.toFixed(0)}°</div>
              <p className="text-[10px] font-black uppercase opacity-30 mt-2 dark:text-white">Temperatura</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-12 rounded-[3.5rem] border border-black/5 text-center">
              <div className="flex justify-center mb-4"><Wind size={32} className="text-[#3b82f6]" /></div>
              <div className="text-6xl font-black dark:text-white">{data.current.wind_speed_10m.toFixed(0)}</div>
              <p className="text-[10px] font-black uppercase opacity-30 mt-2 dark:text-white">Vetar km/h</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-12 rounded-[3.5rem] border border-black/5 text-center">
              <div className="flex justify-center mb-4"><Droplets size={32} className="text-[#3b82f6]" /></div>
              <div className="text-6xl font-black dark:text-white">{data.current.relative_humidity_2m}%</div>
              <p className="text-[10px] font-black uppercase opacity-30 mt-2 dark:text-white">Vlažnost</p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}