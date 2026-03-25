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
  { label: '1d', value: 24 },
  { label: '2d', value: 48 },
  { label: '3d', value: 72 },
  { label: '5d', value: 120 },
  { label: '7d', value: 168 },
  { label: '10d', value: 240 }
];

const translations = {
  sr: {
    scan: "Skeniranje planina...",
    snowfall: "Sneg",
    total: "Ukupno padavina",
    rain: "Kiša",
    temp: "Temp",
    wind: "Vetar",
    cams: "LIVE KAMERE",
    status: "Status"
  },
  en: {
    scan: "Scanning mountains...",
    snowfall: "Snowfall",
    total: "Total Precip",
    rain: "Rain",
    temp: "Temp",
    wind: "Wind",
    cams: "LIVE CAMS",
    status: "Status"
  }
};

const getWeatherIcon = (code: number) => {
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6;

  if (code >= 71 && code <= 77) return "🌨️";
  if (code >= 85 && code <= 86) return "🏔️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 80 && code <= 82) return "🚿";
  if (code >= 95) return "⛈️";
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code === 1 || code === 2) return isNight ? "☁️" : "⛅";
  if (code === 0) return isNight ? "🌙" : "☀️";
  return "✨";
};

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [timeframe, setTimeframe] = useState(24);
  const [loading, setLoading] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await Promise.all(balkanResorts.map(async (r) => {
        const w = await getWeatherData(r.lat, r.lon);
        return { ...r, ...w };
      }));
      setResorts(data);
      setLoading(false);
    }
    load();
  }, [timeframe]);

  const getFreerideStatus = (snow: number) => {
    if (snow >= 100) return { cls: 'bg-purple-600 text-white', label: 'JAPAN STYLE 🇯🇵', color: '#9333ea' };
    if (snow >= 50) return { cls: 'bg-slate-900 text-white border border-white/20', label: 'EXTREME POWDER 💀', color: '#0f172a' };
    if (snow >= 30) return { cls: 'bg-[#00c853] text-white', label: 'POWDER ALERT ❄️', color: '#00c853' };
    if (snow >= 10) return { cls: 'bg-[#ffd600] text-black', label: 'RIDEABLE', color: '#ffd600' };
    return { cls: 'bg-[#d50000] text-white', label: 'SKIP', color: '#d50000' };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50 px-6">
        <div className="max-w-7xl mx-auto h-20 flex justify-between items-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')}
              className="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-md border dark:border-white/10"
            >
              {lang === 'sr' ? 'SRB' : 'ENG'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-10 shadow-2xl bg-slate-50 dark:bg-slate-900 min-h-[400px]">
          <BalkanMap resorts={resorts} timeframe={timeframe} />
        </div>

        <div className="flex flex-wrap justify-center gap-1.5 mb-12 p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/5 shadow-inner">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-blue-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase italic opacity-20 animate-pulse tracking-widest">{t.scan}</div>
          ) : (
            resorts.map((resort) => {
              if (!resort.hourly) return null;

              let calcSnow = 0, calcRain = 0, totalPrecip = 0;
              for (let i = 0; i < timeframe; i++) {
                const t_val = resort.hourly.temperature_2m[i];
                const p = resort.hourly.precipitation[i] || 0;
                totalPrecip += p;
                if (p > 0) {
                  if (t_val <= -5) calcSnow += p * 1.3;
                  else if (t_val <= 0) calcSnow += p * 1.0;
                  else if (t_val <= 2) calcSnow += p * 0.5;
                  else calcRain += p;
                }
              }

              const status = getFreerideStatus(calcSnow);

              return (
                <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-7 rounded-[3rem] shadow-sm flex flex-col h-full transition-all hover:shadow-xl">
                  
                  <div className="h-20 mb-4">
                    <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black mb-3 uppercase tracking-tighter shadow-sm ${status.cls}`}>
                      {status.label}
                    </div>
                    <h3 className="text-2xl font-black uppercase italic leading-none tracking-tight">{resort.name}</h3>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">{resort.country}</p>
                  </div>

                  <div className="h-44 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30 mb-6 flex flex-col justify-center">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase opacity-70 mb-1 italic tracking-widest">{t.snowfall} (+{timeframe < 24 ? timeframe + 'h' : timeframe/24 + 'd'})</p>
                      <p className="text-5xl font-black italic mb-3 tracking-tighter">
                        +{calcSnow.toFixed(1)} <span className="text-2xl uppercase font-normal text-blue-200 tracking-normal">cm</span>
                      </p>
                      <div className="flex gap-3 pt-3 border-t border-white/10">
                        <span className="text-[9px] font-black uppercase opacity-60">{t.total}: {totalPrecip.toFixed(1)}mm</span>
                        {calcRain > 0 && <span className="text-[9px] font-black uppercase text-red-200 border-l border-white/20 pl-3">{t.rain}: {calcRain.toFixed(1)}mm</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-8 h-32">
                    <div className="bg-white dark:bg-white/5 rounded-3xl border dark:border-white/5 flex items-center justify-center text-5xl shadow-sm">
                      {getWeatherIcon(resort.current.weatherCode)}
                    </div>
                    
                    <div className="bg-white dark:bg-white/5 rounded-3xl border dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-2xl font-black italic">{resort.current.temp}°</span>
                      <span className="text-[9px] font-black uppercase opacity-30 mt-1">{t.temp}</span>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-3xl border dark:border-white/5 flex flex-col items-center justify-center shadow-sm">
                      <div className="text-4xl font-black" style={{ transform: `rotate(${resort.current.windDir}deg)`, transition: 'transform 2s' }}>↑</div>
                      <span className="text-[11px] font-black mt-1">{resort.current.windSpeed} <span className="opacity-40 font-normal">m/s</span></span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedResort(resort)}
                    className="mt-auto w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-black/5"
                  >
                    {t.cams}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </main>
      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}