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

  // Mapiranje Open-Meteo kodova u tekst
  const getConditionText = (code: number) => {
    if (code === 0) return lang === 'sr' ? "Vedro" : "Clear";
    if ([1, 2, 3].includes(code)) return lang === 'sr' ? "Malo oblačno" : "Partly Cloudy";
    if ([45, 48].includes(code)) return lang === 'sr' ? "Magla" : "Foggy";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return lang === 'sr' ? "Sneg veje" : "Snowing";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return lang === 'sr' ? "Kiša" : "Rain";
    return lang === 'sr' ? "Oblačno" : "Cloudy";
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return '☀️';
    if ([1, 2, 3].includes(code)) return '🌤️';
    if ([45, 48].includes(code)) return '🌫️';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return '🌧️';
    return '☁️';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')}
              className="text-[10px] font-black uppercase px-3 py-1 bg-slate-100 dark:bg-white/10 rounded-lg border dark:border-white/5 hover:bg-blue-600 hover:text-white transition-all"
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

        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/5">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'opacity-40 hover:opacity-100'
              }`}
            >
              {opt.label[lang]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resorts.map((resort) => (
            <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[3rem] hover:shadow-2xl transition-all group">
              <h3 className="text-2xl font-black uppercase italic mb-1 leading-none">{resort.name}</h3>
              <p className="text-[10px] font-bold text-blue-500 uppercase mb-6 tracking-widest">
                {getConditionText(resort.condition)}
              </p>

              <div className="flex items-center justify-between bg-white dark:bg-black/20 p-5 rounded-2xl border dark:border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getWeatherIcon(resort.condition)}</span>
                  <span className="text-2xl font-black italic">{resort.temp}°</span>
                </div>
                <div className="flex items-center gap-4 border-l dark:border-white/10 pl-5">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold mb-1 shadow-md" style={{ transform: `rotate(${resort.windDir}deg)`, transition: 'transform 1s' }}>↑</div>
                    <span className="text-[10px] font-black uppercase opacity-40">{t.wind}</span>
                  </div>
                  <span className="text-lg font-black">{resort.windSpeed}<span className="text-[10px] ml-0.5 opacity-50 uppercase text-blue-600 font-bold">m/s</span></span>
                </div>
              </div>

              <div className="mb-8 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase opacity-70 mb-1">
                    {t.forecast} (+{timeOptions.find(o => o.value === timeframe)?.label[lang]})
                  </p>
                  <p className="text-5xl font-black italic">
                    +{Math.round(resort.forecast * timeframe)} <span className="text-2xl uppercase">cm</span>
                  </p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 absolute -right-4 -top-4 opacity-20 group-hover:rotate-90 transition-transform duration-1000">
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                    <line x1="20" y1="12" x2="4" y2="12"></line>
                    <line x1="17.66" y1="17.66" x2="6.34" y2="6.34"></line>
                    <line x1="17.66" y1="6.34" x2="6.34" y2="17.66"></line>
                </svg>
              </div>

              <button 
                onClick={() => setSelectedResort(resort)}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-all shadow-lg"
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