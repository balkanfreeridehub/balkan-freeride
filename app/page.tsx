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
    sr: { wind: "Vetar", precip: "Padavine", forecast: "Prognoza", cam: "Kamera", temp: "Temp" },
    en: { wind: "Wind", precip: "Precip", forecast: "Forecast", cam: "Live Cam", temp: "Temp" }
  }[lang];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
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
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-10 shadow-2xl bg-slate-50 dark:bg-slate-900">
          <BalkanMap resorts={resorts} />
        </div>

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
            <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[2.5rem] hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic">{resort.name}</h3>
                  <p className="text-[10px] font-bold text-blue-500 uppercase">{resort.condition}</p>
                </div>
                <span className="text-3xl font-black italic">{resort.temp}°</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-black/20 p-5 rounded-3xl text-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-2">{t.wind}</p>
                  <p className="font-black">{resort.windSpeed} <span className="text-[9px] opacity-50">m/s</span></p>
                </div>
                <div className="bg-white dark:bg-black/20 p-5 rounded-3xl text-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-2">{t.precip}</p>
                  <p className="font-black">{resort.precip}<span className="text-[9px] opacity-50 ml-1">mm</span></p>
                </div>
              </div>

              <div className="mb-8 bg-blue-600 p-6 rounded-[2rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/20">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase opacity-70 mb-1">{t.forecast} {timeOptions.find(o=>o.value===timeframe)?.label[lang]}</p>
                  <p className="text-4xl font-black italic">+{Math.round(resort.forecast * (timeframe/24))}cm</p>
                </div>
                <svg className="w-16 h-16 absolute -right-2 top-2 opacity-20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M12 2v20M2 12h20M5.64 5.64l12.72 12.72M5.64 19.36L18.36 5.64" />
                </svg>
              </div>

              <button onClick={() => setSelectedResort(resort)} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors">
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