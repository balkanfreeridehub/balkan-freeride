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
  { label: { sr: '5 Dana', en: '5 Days' }, value: 120 },
  { label: { sr: '7 Dana', en: '7 Days' }, value: 168 },
  { label: { sr: '10 Dana', en: '10 Days' }, value: 240 }
];

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resortsWithData, setResortsWithData] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [timeframe, setTimeframe] = useState(24);

  useEffect(() => {
    async function loadData() {
      const data = await Promise.all(
        balkanResorts.map(async (resort) => {
          const weather = await getWeatherData(resort.lat, resort.lon);
          return { ...resort, ...weather };
        })
      );
      setResortsWithData(data);
    }
    loadData();
  }, []);

  const t = {
    sr: { current: "Trenutno", wind: "Vetar", precip: "Padavine", forecast: "Prognoza", cam: "Kamera" },
    en: { current: "Current", wind: "Wind", precip: "Precipitation", forecast: "Forecast", cam: "Live Cam" }
  }[lang];

  return (
    <div className="min-h-screen transition-colors duration-300">
      <nav className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter uppercase italic">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {lang === 'sr' ? 'EN' : 'SR'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-8 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
          <BalkanMap resorts={resortsWithData} />
        </section>

        {/* Novi Timeline UI */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit mx-auto border border-slate-200 dark:border-white/5">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {opt.label[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resortsWithData.map((resort) => (
            <div key={resort.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic">{resort.name}</h3>
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{resort.condition}</p>
                </div>
                <span className="text-3xl font-black italic">{resort.temp}°</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-black/40 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex flex-col items-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-2">{t.wind}</p>
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mb-2 shadow-lg" style={{ transform: `rotate(${resort.windDir}deg)` }}>↑</div>
                  <span className="text-lg font-black">{resort.windSpeed}<span className="text-[10px] ml-1 opacity-50 uppercase">m/s</span></span>
                </div>
                <div className="bg-slate-50 dark:bg-black/40 p-5 rounded-3xl border border-slate-100 dark:border-white/5 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-bold opacity-30 uppercase mb-2">{t.precip}</p>
                  <p className="text-2xl font-black">{resort.precip}<span className="text-[10px] ml-1 text-blue-500 font-bold uppercase">mm</span></p>
                </div>
              </div>

              {/* Snow Forecast Box sa popravljenom pahuljom */}
              <div className="mb-8 bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-600/20 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase opacity-80 mb-1">{t.forecast} {timeOptions.find(o => o.value === timeframe)?.label[lang]}</p>
                  <p className="text-4xl font-black italic">+{Math.round(resort.forecast * (timeframe/24))}cm</p>
                </div>
                {/* Čista bela SVG pahulja - bez glitcheva */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 absolute -right-2 top-2 opacity-20">
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                    <line x1="20" y1="12" x2="4" y2="12"></line>
                    <line x1="17.66" y1="17.66" x2="6.34" y2="6.34"></line>
                    <line x1="17.66" y1="6.34" x2="6.34" y2="17.66"></line>
                    <polyline points="15 5 12 2 9 5"></polyline>
                    <polyline points="15 19 12 22 9 19"></polyline>
                    <polyline points="19 9 22 12 19 15"></polyline>
                    <polyline points="5 9 2 12 5 15"></polyline>
                </svg>
              </div>

              <button onClick={() => setSelectedResort(resort)} className="w-full py-5 bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all">
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