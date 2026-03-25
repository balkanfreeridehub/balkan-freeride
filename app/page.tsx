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

  useEffect(() => {
    async function loadData() {
      const data = await Promise.all(
        balkanResorts.map(async (resort) => {
          const weather = await getWeatherData(resort.lat, resort.lon);
          return { ...resort, forecast: weather?.forecast || 0, temp: weather?.temp || 0, wind: weather?.wind || 0 };
        })
      );
      setResortsWithData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      {/* Navbar sa staklenim efektom */}
      <nav className="border-b border-blue-100 dark:border-zinc-800 bg-white/70 dark:bg-black/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase text-blue-600 dark:text-blue-400">
            BFH <span className="text-slate-400">|</span> <span className="italic">POWDER</span>
          </h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-tight tracking-tighter text-slate-900 dark:text-white">
            Balkan <span className="text-blue-500">Ski</span> Forecast
          </h2>
          <div className="h-2 w-24 bg-blue-500 mt-4 rounded-full"></div>
        </header>

        {/* Mapa u svetlim tonovima */}
        <section className="mb-20 rounded-[3rem] overflow-hidden border border-blue-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-blue-100/50 dark:shadow-none">
          <BalkanMap resorts={resortsWithData} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 animate-pulse text-blue-400 font-bold uppercase tracking-widest">Scanning Peaks...</div>
          ) : (
            resortsWithData.map((resort) => (
              <div key={resort.id} className="group bg-white dark:bg-zinc-900 border border-blue-50 dark:border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-none">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-black uppercase italic text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">{resort.name}</h3>
                  <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 px-3 py-1 rounded-full uppercase">{resort.country}</span>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-black/20 p-4 rounded-2xl">
                    <span className="text-xs font-bold opacity-40 uppercase">Temperature</span>
                    <span className="text-xl font-black">{resort.temp}°C</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-blue-400 uppercase">New Snow</span>
                    <span className="text-xl font-black text-blue-600">{resort.forecast}cm</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedResort(resort)}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all shadow-lg"
                >
                  Open Live Cam
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}