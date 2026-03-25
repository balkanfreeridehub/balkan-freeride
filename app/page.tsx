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
  const [timeframe, setTimeframe] = useState(24); // Default 24h

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await Promise.all(
        balkanResorts.map(async (resort) => {
          const weather = await getWeatherData(resort.lat, resort.lon);
          return { 
            ...resort, 
            temp: weather?.temp || 0,
            windSpeed: weather?.wind || 0,
            windDir: weather?.windDir || 0, // stepeni (0-360)
            snowNow: weather?.isSnowing || false,
            forecast: Math.round((weather?.forecast || 0) * (timeframe / 24)) // Gruba kalkulacija za timeframe
          };
        })
      );
      setResortsWithData(data);
      setLoading(false);
    }
    loadData();
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      <nav className="border-b border-blue-100 dark:border-blue-900/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-400">BFH <span className="italic">ICE</span></h1>
          <div className="flex items-center gap-4">
            {/* Selector za vreme */}
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="bg-blue-50 dark:bg-slate-900 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none focus:ring-2 ring-blue-500"
            >
              <option value={6}>6h</option>
              <option value={12}>12h</option>
              <option value={24}>24h</option>
              <option value={48}>48h</option>
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
            <div key={resort.id} className="bg-white dark:bg-slate-900/50 border border-blue-50 dark:border-blue-900/20 p-6 rounded-[2rem] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase italic">{resort.name}</h3>
                {resort.snowNow && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 animate-pulse">
                    ❄️ SNOWING NOW
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold opacity-40 uppercase">Temp</p>
                  <p className="text-xl font-black">{resort.temp}°C</p>
                </div>
                <div className="bg-blue-50/50 dark:bg-blue-500/5 p-4 rounded-2xl flex flex-col justify-between">
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Wind</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-black">{resort.windSpeed}m/s</p>
                    <span 
                      className="inline-block transform transition-transform duration-1000"
                      style={{ rotate: `${resort.windDir}deg` }}
                    >
                      ⬆️
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-2xl text-white">
                <p className="text-[10px] font-bold uppercase opacity-80">{timeframe}h Forecast</p>
                <p className="text-3xl font-black italic">{resort.forecast}cm</p>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all"
              >
                Live Cam
              </button>
            </div>
          ))}
        </div>
      </main>

      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}