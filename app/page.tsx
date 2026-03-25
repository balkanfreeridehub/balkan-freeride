"use client" // Promeni vrh u use client jer nam treba interakcija
import React, { useState, useEffect } from 'react';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';
import LiveCamModal from '../components/LiveCamModal';

export default function Home() {
  const [resortsWithData, setResortsWithData] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const data = await Promise.all(
        balkanResorts.map(async (resort) => {
          const weather = await getWeatherData(resort.lat, resort.lon);
          return { ...resort, forecast: weather?.forecast || 0, temp: weather?.temp || 0, wind: weather?.wind || 0 };
        })
      );
      setResortsWithData(data);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar & Header... (isto kao pre) */}

      <main className="max-w-7xl mx-auto px-6 py-12">
        <BalkanMap resorts={resortsWithData} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {resortsWithData.map((resort) => (
            <div key={resort.id} className="bg-zinc-900 border border-white/5 p-6 rounded-[2rem] hover:border-orange-600 transition-all group">
              <h3 className="text-xl font-black uppercase italic italic">{resort.name}</h3>
              {/* Vremenski podaci... */}

              <button 
                onClick={() => setSelectedResort(resort)}
                className="mt-6 w-full py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                View Live Cam
              </button>
            </div>
          ))}
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