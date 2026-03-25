"use client"
import React, { useState, useEffect } from 'react';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';
import LiveCamModal from '../components/LiveCamModal';

export default function Home() {
  const [resortsWithData, setResortsWithData] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await Promise.all(
        balkanResorts.map(async (resort) => {
          const weather = await getWeatherData(resort.lat, resort.lon);
          return { 
            ...resort, 
            temp: weather?.temp ?? 0,
            windSpeed: weather?.wind ?? 0,
            windDir: weather?.windDir ?? 0,
            condition: weather?.condition ?? "N/A",
            precip: weather?.precipAmount ?? 0,
            forecast: weather?.forecast ?? 0
          };
        })
      );
      setResortsWithData(data);
      setLoading(false);
    }
    loadData();
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <nav className="border-b border-blue-100 dark:border-blue-900/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">BFH <span className="italic">ICE</span></h1>
          <div className="flex items-center gap-4">
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="bg-blue-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none"
            >
              <option value={24}>Prognoza 24h</option>
              <option value={48}>Prognoza 48h</option>
            </select>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-12 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl">
          <BalkanMap resorts={resortsWithData} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resortsWithData.map((resort) => (
            <div key={resort.id} className="bg-white dark:bg-slate-900/50 border border-blue-50 dark:border-blue-900/20 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{resort.name}</h3>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-blue-500 uppercase">Trenutno</p>
                  <p className="text-sm font-black">{resort.condition}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-blue-50/50 dark:border-white/5">
                  <p className="text-[10px] font-bold opacity-40 uppercase mb-1 text-center">Temp / Vetar</p>
                  <div className="flex justify-around items-center">
                    <span className="text-lg font-black">{resort.temp}°</span>
                    <span 
                      className="text-lg inline-block transition-transform duration-700" 
                      style={{ transform: `rotate(${resort.windDir}deg)` }}
                    >
                      ⬆️
                    </span>
                    <span className="text-xs font-bold opacity-60">{resort.windSpeed}m/s</span>
                  </div>
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-500/5 p-4 rounded-2xl border border-blue-100/50 dark:border-blue-400/10">
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1 text-center">Padavine (Live)</p>
                  <p className="text-xl font-black text-center text-blue-600">{resort.precip}<span className="text-[10px] ml-1">mm</span></p>
                </div>
              </div>

              <div className="mb-6 bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-[1.5rem] text-white shadow-lg shadow-blue-500/20">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-80">Prognoza {timeframe}h</p>
                    <p className="text-4xl font-black italic">+{resort.forecast * (timeframe/24)}cm</p>
                  </div>
                  <span className="text-3xl">❄️</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all shadow-md"
              >
                Otvori Kameru
              </button>
            </div>
          ))}
        </div>
      </main>

      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}