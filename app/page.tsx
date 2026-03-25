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
  { label: { sr: '2 Dana', en: '2 Days' }, value: 48 },
  { label: { sr: '3 Dana', en: '3 Days' }, value: 72 },
  { label: { sr: '4 Dana', en: '4 Days' }, value: 96 },
  { label: { sr: '5 Dana', en: '5 Days' }, value: 120 },
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
    sr: { wind: "Vetar", precip: "Padavine", forecast: "Prognoza", cam: "Kamera Uživo" },
    en: { wind: "Wind", precip: "Precip", forecast: "Forecast", cam: "Live Cam" }
  }[lang];

  return (
    <div className="min-h-screen pb-20 transition-colors duration-500 bg-slate-50 dark:bg-[#020617]">
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black uppercase italic tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')}
              className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              {lang === 'sr' ? 'English' : 'Srpski'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl mb-10 bg-white dark:bg-slate-900/50">
          <BalkanMap resorts={resorts} />
        </div>

        {/* Timeline Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 p-2 bg-slate-100 dark:bg-white/5 rounded-3xl w-fit mx-auto border border-slate-200 dark:border-white/10 shadow-inner">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase transition-all ${
                timeframe === opt.value 
                ? 'bg-blue-600 text-white shadow-xl scale-105' 
                : 'text-slate-400 hover:text-blue-500'
              }`}
            >
              {opt.label[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map((resort) => (
            <div key={resort.id} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-8 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic leading-none mb-2">{resort.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{resort.condition}</p>
                  </div>
                </div>
                <div className="text-4xl font-black italic">{resort.temp}°</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5 flex flex-col items-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-3 text-center">{t.wind}</p>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-2 shadow-lg" 
                       style={{ transform: `rotate(${resort.windDir}deg)`, transition: 'transform 1s' }}>
                    ↑
                  </div>
                  <span className="font-black">{resort.windSpeed}<span className="text-[10px] ml-1 opacity-50">m/s</span></span>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-slate-100 dark:border-white/5 flex flex-col items-center justify-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-3">{t.precip}</p>
                  <p className="text-2xl font-black">{resort.precip}<span className="text-xs ml-1 text-blue-600">mm</span></p>
                </div>
              </div>

              {/* Snow Forecast Box */}
              <div className="mb-8 bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-600/30 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase opacity-70 mb-1">
                    {t.forecast} {timeOptions.find(o => o.value === timeframe)?.label[lang]}
                  </p>
                  <p className="text-5xl font-black italic">+{Math.round(resort.forecast * (timeframe/24))} <span className="text-2xl">cm</span></p>
                </div>
                {/* Geometrijska pahulja - Čista bela */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 absolute -right-4 -top-4 opacity-20 group-hover:rotate-90 transition-transform duration-1000">
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                    <line x1="20" y1="12" x2="4" y2="12"></line>
                    <line x1="17.66" y1="17.66" x2="6.34" y2="6.34"></line>
                    <line x1="17.66" y1="6.34" x2="6.34" y2="17.66"></line>
                    <polyline points="15 5 12 2 9 5"></polyline>
                    <polyline points="15 19 12 22 9 19"></polyline>
                </svg>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg"
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