"use client"
import React, { useState, useEffect } from 'react';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';
import LiveCamModal from '../components/LiveCamModal';

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [timeframe, setTimeframe] = useState(24);

  useEffect(() => {
    async function load() {
      const data = await Promise.all(balkanResorts.map(async (r) => {
        const w = await getWeatherData(r.lat, r.lon);
        return { ...r, ...w };
      }));
      setResorts(data);
    }
    load();
  }, []);

  return (
    // DODATA KLASA dark:bg-slate-950 i text-slate-900 dark:text-white
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span>
          </h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang==='sr'?'en':'sr')} className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg">
              {lang === 'sr' ? 'EN' : 'SR'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* MAPA JE OVDE PONOVO */}
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-10 shadow-2xl bg-slate-100 dark:bg-slate-900 min-h-[400px]">
          <BalkanMap resorts={resorts} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resorts.map((resort) => (
            <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[2.5rem] hover:shadow-2xl transition-all">
              <h3 className="text-2xl font-black uppercase italic mb-1">{resort.name}</h3>
              <p className="text-[10px] font-bold text-blue-500 uppercase mb-6">{resort.condition}</p>

              {/* SNEG BOX - AKO JE PROGNOZA > 0, nek blješti plavo */}
              <div className="mb-8 bg-blue-600 p-6 rounded-[2rem] text-white relative overflow-hidden shadow-lg">
                <p className="text-[10px] font-bold uppercase opacity-70">Prognoza snega (24h)</p>
                <p className="text-5xl font-black italic">+{resort.forecast}cm</p>
                <span className="absolute right-2 top-2 text-4xl opacity-20">❄️</span>
              </div>

              <div className="flex justify-between items-center px-2 opacity-70 font-bold text-sm">
                 <span>{resort.temp}°C</span>
                 <span>{resort.windSpeed} m/s</span>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] rounded-2xl hover:bg-blue-600 transition-colors"
              >
                Kamera
              </button>
            </div>
          ))}
        </div>
      </main>
      
      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}