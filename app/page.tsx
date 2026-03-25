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
          return { 
            ...resort, 
            forecast: weather?.forecast || 0, 
            temp: weather?.temp || 0, 
            wind: weather?.wind || 0,
            base: Math.floor(Math.random() * 40) + 20
          };
        })
      );
      setResortsWithData(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-600">
      <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">
            BFH <span className="text-orange-600 underline decoration-4 underline-offset-8">BALKAN</span>
          </h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-16 border-l-8 border-orange-600 pl-8">
          <h2 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter">
            Regional <br /> <span className="text-orange-600">Powder</span> Hub
          </h2>
          <p className="mt-6 text-xs font-black opacity-30 uppercase tracking-[0.4em]">Live data • Balkan Peninsula • 2026</p>
        </header>

        <section className="mb-20 rounded-[3rem] overflow-hidden border border-zinc-800 bg-zinc-900/20">
          <BalkanMap resorts={resortsWithData} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 opacity-20 font-black uppercase tracking-widest">Loading Snow Data...</div>
          ) : (
            resortsWithData.map((resort) => (
              <div key={resort.id} className="group bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2.5rem] hover:border-orange-600 hover:bg-zinc-900/60 transition-all duration-500">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-orange-600 transition-colors">{resort.name}</h3>
                  <span className="text-[10px] font-black bg-orange-600 px-3 py-1 rounded-full">{resort.country}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold opacity-30 uppercase mb-1">Temp</p>
                    <p className="text-2xl font-black italic">{resort.temp}°C</p>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-bold opacity-30 uppercase mb-1">Wind</p>
                    <p className="text-2xl font-black italic">{resort.wind}ms</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedResort(resort)}
                  className="w-full py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                  Watch Live
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <LiveCamModal 
        isOpen={!!selectedResort} 
        onClose={() => setSelectedResort(null)} 
        resort={selectedResort} 
      />
    </div>
  );
}