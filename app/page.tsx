"use client"
import React, { useState, useEffect } from 'react';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';
import LiveCamModal from '../components/LiveCamModal';

const timeOptions = [
  { label: '6h', value: 6 },
  { label: '12h', value: 12 },
  { label: '24h', value: 24 },
  { label: '48h', value: 48 },
  { label: '72h', value: 72 },
  { label: '7D', value: 168 }
];

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
            condition: weather?.condition ?? "Vedro",
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
    <div className="min-h-screen transition-colors duration-300">
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-6 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
          <BalkanMap resorts={resortsWithData} />
        </section>

        <div className="flex flex-wrap justify-center gap-1 mb-12 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit mx-auto border border-slate-200 dark:border-white/5">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                timeframe === opt.value 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'hover:bg-white dark:hover:bg-slate-800 opacity-50 text-slate-600 dark:text-slate-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resortsWithData.map((resort) => (
            <div key={resort.id} className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic leading-none">{resort.name}</h3>
                  <p className="text-[10px] font-bold text-blue-500 mt-2 uppercase tracking-[0.2em]">{resort.condition}</p>
                </div>
                <span className="text-3xl font-black italic">{resort.temp}°</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-black/40 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-3 text-center">Vetar</p>
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold transition-transform duration-1000 shadow-md"
                      style={{ transform: `rotate(${resort.windDir}deg)` }}
                    >
                      ↑
                    </div>
                    <span className="text-lg font-black">{resort.windSpeed}<span className="text-[10px] ml-1 opacity-50">m/s</span></span>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-black/40 p-5 rounded-3xl border border-slate-100 dark:border-white/5 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-3">Padavine</p>
                  <p className="text-2xl font-black">{resort.precip}<span className="text-[10px] ml-1 opacity-50 text-blue-600 font-bold tracking-tighter">MM</span></p>
                </div>
              </div>

              {/* Snow Forecast Box sa belom SVG pahuljom */}
              <div className="mb-8 bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-600/20 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Prognoza {timeframe}h</p>
                  <p className="text-4xl font-black italic">+{Math.round(resort.forecast * (timeframe/24))}cm</p>
                </div>
                {/* SVG Pahulja - Čisto bela */}
                <svg className="w-16 h-16 text-white opacity-20 absolute -right-2 top-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2v3.07l2.12-1.22 1 1.73L14 6.8v2.47l2.14-1.23.14 2.47 2.15-1.24 1 1.73-2.15 1.24 2.15 1.24-1 1.73-2.15-1.24-.14 2.47-2.14-1.23v2.47l2.12 1.22-1 1.73-2.12-1.22V22h-2v-3.07l-2.12 1.22-1-1.73 2.12-1.22v-2.47l-2.14 1.23-.14-2.47-2.15 1.24-1-1.73 2.15-1.24-2.15-1.24 1-1.73 2.15 1.24.14-2.47 2.14 1.23V6.8l-2.12 1.22-1-1.73 2.12-1.22V2h2z" />
                </svg>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg"
              >
                Launch Live Cam
              </button>
            </div>
          ))}
        </div>
      </main>

      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}