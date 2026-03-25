"use client"
import React, { useState, useEffect } from 'react';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';
import LiveCamModal from '../components/LiveCamModal';

const timeOptions = [
  { label: { sr: '6h', en: '6h' }, value: 6 },
  { label: { sr: '12h', en: '12h' }, value: 12 },
  { label: { sr: '1 Dan', en: '1 Day' }, value: 24 },
  { label: { sr: '3 Dana', en: '3 Days' }, value: 72 },
  { label: { sr: '7 Dana', en: '7 Days' }, value: 168 },
  { label: { sr: '10 Dana', en: '10 Days' }, value: 240 }
];

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

  const t = {
    sr: { forecast: "Prognoza", cam: "Kamera", wind: "Vetar" },
    en: { forecast: "Forecast", cam: "Live Cam", wind: "Wind" }
  }[lang];

  // Funkcija za vizuelni prikaz vremena
  const getWeatherIcon = (cond: string) => {
    if (cond?.toLowerCase().includes('sneg')) return '❄️';
    if (cond?.toLowerCase().includes('kiša')) return '🌧️';
    if (cond?.toLowerCase().includes('oblačno')) return '☁️';
    if (cond?.toLowerCase().includes('magla')) return '🌫️';
    return '☀️';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')}
              className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg border dark:border-white/5"
            >
              {lang === 'sr' ? 'English' : 'Srpski'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-10 shadow-2xl bg-slate-50 dark:bg-slate-900 min-h-[400px]">
          <BalkanMap resorts={resorts} />
        </div>

        {/* TIME SPAN SELECTOR */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/5">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {opt.label[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map((resort) => (
            <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[3rem] hover:shadow-2xl transition-all group">
              <h3 className="text-2xl font-black uppercase italic mb-6 leading-none">{resort.name}</h3>
              
              {/* VREME U JEDNOM REDU */}
              <div className="flex items-center justify-between bg-white dark:bg-black/20 p-4 rounded-2xl border dark:border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWeatherIcon(resort.condition)}</span>
                  <span className="text-xl font-black">{resort.temp}°</span>
                </div>
                <div className="flex items-center gap-3 border-l dark:border-white/10 pl-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold" style={{ transform: `rotate(${resort.windDir}deg)` }}>↑</div>
                  <span className="text-sm font-black">{resort.windSpeed}<span className="text-[10px] ml-1 opacity-50">m/s</span></span>
                </div>
              </div>

              {/* SNOW FORECAST BOX */}
              <div className="mb-8 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase opacity-70 mb-1">
                    {t.forecast} {timeOptions.find(o => o.value === timeframe)?.label[lang]}
                  </p>
                  <p className="text-5xl font-black italic">
                    +{Math.round(resort.forecast * (timeframe/24))} <span className="text-2xl">cm</span>
                  </p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24 absolute -right-4 -top-4 opacity-20 group-hover:rotate-90 transition-transform duration-1000">
                  <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M5.64 19.36L18.36 5.64M12 5l3 3m-6 0l3-3M5 12l3 3m0-6l-3 3M12 19l-3-3m6 0l-3 3M19 12l-3-3m0 6l3-3" />
                </svg>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg"
              >
                {t.cam}
              </button>
            </div>
          ))}
        </div>
      </main>

      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}