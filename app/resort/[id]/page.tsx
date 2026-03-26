"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { Snowflake, Thermometer, ChevronLeft, Wind, Droplets, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ResortPage() {
  const params = useParams();
  const id = params?.id; // Bezbedno čitanje ID-a
  const [data, setData] = useState<any>(null);
  const [resort, setResort] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const found = balkanResorts.find(r => r.id === id);
      if (found) {
        setResort(found);
        getWeatherData(found.lat, found.lon).then(setData).catch(console.error);
      }
    }
  }, [id]);

  if (!id || !resort) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617]">
      <div className="w-10 h-10 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-black uppercase tracking-widest text-[10px] opacity-30 dark:text-white">Provera planine...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors selection:bg-black selection:text-white">
      <nav className="p-8 flex justify-between items-center border-b border-black/5">
        <Link href="/" className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-40 hover:opacity-100 dark:text-white">
          <ChevronLeft size={16} /> Nazad
        </Link>
        <div className="text-xl font-black italic uppercase tracking-tighter dark:text-white">
          Balkan<span className="opacity-20 ml-0.5">Freeride</span>
        </div>
        <div className="w-10"></div>
      </nav>

      {!data ? (
        <div className="h-[50vh] flex items-center justify-center font-black uppercase opacity-20 text-[10px]">Učitavam podatke...</div>
      ) : (
        <main className="max-w-6xl mx-auto px-8 py-16">
          <header className="mb-20">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={14} className="opacity-30 dark:text-white" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 dark:text-white">{resort.country}</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter dark:text-white leading-none mb-8">{resort.name}</h1>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest">
                Update: {new Date().getHours()}:{new Date().getMinutes()}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[
              { label: 'Temp', val: `${data.current.temperature_2m.toFixed(0)}°`, icon: <Thermometer size={24}/> },
              { label: 'Vetar', val: `${data.current.wind_speed_10m.toFixed(0)}km/h`, icon: <Wind size={24}/> },
              { label: 'Vlažnost', val: `${data.current.relative_humidity_2m}%`, icon: <Droplets size={24}/> }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 dark:bg-white/5 p-12 rounded-[3rem] border border-black/5 text-center transition-transform hover:-translate-y-1">
                <div className="opacity-20 flex justify-center mb-4 dark:text-white">{stat.icon}</div>
                <div className="text-6xl font-black dark:text-white tracking-tighter">{stat.val}</div>
                <p className="text-[10px] font-black uppercase opacity-30 mt-2 dark:text-white">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-black dark:bg-white text-white dark:text-black p-12 rounded-[4rem]">
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 mb-10 text-center">Narednih 10 sati</h4>
             <div className="flex justify-between overflow-x-auto gap-8 no-scrollbar">
                {data.hourly.time.slice(0, 10).map((t: any, i: number) => (
                  <div key={i} className="flex flex-col items-center min-w-[70px]">
                    <span className="text-[10px] font-black opacity-40 mb-3">{new Date(t).getHours()}h</span>
                    <span className="text-2xl font-black">{data.hourly.temperature_2m[i].toFixed(0)}°</span>
                    <span className="text-[10px] font-black opacity-30 mt-2 text-blue-400">{data.hourly.precipitation[i]}mm</span>
                  </div>
                ))}
             </div>
          </div>
        </main>
      )}
    </div>
  );
}