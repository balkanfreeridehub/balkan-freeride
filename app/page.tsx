"use client"
import React, { useState, useEffect } from 'react';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
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
    // "dark:bg-[#020617]" je ključno ovde da bi Toggle radio
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300">
      <nav className="p-6 flex justify-between items-center border-b dark:border-white/10">
        <h1 className="text-xl font-black italic uppercase">Balkan <span className="text-blue-600">Freeride</span></h1>
        <ThemeToggle />
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resorts.map((resort) => (
            <div key={resort.id} className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-white/5 border dark:border-white/10">
              <h3 className="text-2xl font-black italic mb-4">{resort.name}</h3>
              
              <div className="mb-6 bg-blue-600 p-6 rounded-3xl text-white relative overflow-hidden">
                <p className="text-[10px] font-bold uppercase opacity-70">Sneg (Prognoza)</p>
                {/* Ovde sada ide popravljena cifra */}
                <p className="text-5xl font-black italic">+{Math.round(resort.forecast * (timeframe/6))}cm</p>
                <span className="absolute right-2 top-2 text-4xl opacity-20">❄️</span>
              </div>

              <div className="flex justify-between font-bold text-sm opacity-60">
                <span>Temp: {resort.temp}°C</span>
                <span>Vetar: {resort.windSpeed}m/s</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}