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
  { label: '3d', value: 72 },
  { label: '10d', value: 240 }
];

// PRO Weather Icon Logic sa NOĆNIM REŽIMOM
const getWeatherIcon = (code: number) => {
  const hour = new Date().getHours();
  const isNight = hour >= 18 || hour < 6;

  // Sneg
  if (code >= 71 && code <= 77) return code > 73 ? "🌨️" : "❄️";
  if (code >= 85 && code <= 86) return "🌨️❄️";
  // Kiša
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 80 && code <= 82) return "🌧️";
  // Grmljavina
  if (code >= 95) return "⛈️";
  // Oblaci/Magla
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code === 1 || code === 2) return isNight ? "☁️🌙" : "⛅";
  // Vedro
  if (code === 0) return isNight ? "🌙" : "☀️";
  return "✨";
};

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [timeframe, setTimeframe] = useState(24);
  const [loading, setLoading] = useState(true);

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
    if (snow >= 100) return { cls: 'bg-purple-600 text-white', label: 'JAPAN STYLE 🇯🇵' };
    if (snow >= 50) return { cls: 'bg-blue-900 text-white', label: 'EXTREME POWDER 💀' };
    if (snow >= 30) return { cls: 'bg-[#00c853] text-white', label: 'POWDER ALERT ❄️' };
    if (snow >= 10) return { cls: 'bg-[#ffd600] text-black', label: 'RIDEABLE' };
    return { cls: 'bg-[#d50000] text-white', label: 'SKIP' };
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
          <BalkanMap resorts={resorts} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/5">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-blue-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && resorts.map((resort) => {
            if (!resort.hourly) return null;

            let calcSnow = 0, calcRain = 0, totalPrecip = 0;
            for (let i = 0; i < timeframe; i++) {
              const t = resort.hourly.temperature_2m[i];
              const p = resort.hourly.precipitation[i] || 0;
              totalPrecip += p;
              if (p > 0) {
                if (t <= -5) calcSnow += p * 1.3;
                else if (t <= 0) calcSnow += p * 1.0;
                else if (t <= 2) calcSnow += p * 0.5;
                else calcRain += p;
              }
            }

            const status = getFreerideStatus(calcSnow);

            return (
              <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-7 rounded-[3rem] shadow-sm flex flex-col h-full hover:border-blue-500/30 transition-colors">
                
                <div className="h-20 mb-4">
                  <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black mb-3 uppercase tracking-tighter shadow-sm ${status.cls}`}>
                    {status.label}
                  </div>
                  <h3 className="text-2xl font-black uppercase italic leading-none tracking-tight">{resort.name}</h3>
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">{resort.country}</p>
                </div>

                <div className="h-44 bg-blue-600 p-6 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30 mb-6 flex flex-col justify-center transition-all">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase opacity-70 mb-1 italic tracking-widest">Snowfall (+{timeframe}h)</p>
                    <p className="text-5xl font-black italic mb-2 tracking-tighter">
                      +{calcSnow.toFixed(1)} <span className="text-2xl uppercase font-normal text-blue-200">cm</span>
                    </p>
                    <div className="flex gap-3 mt-1 pt-3 border-t border-white/10">
                        <div className="text-[9px] font-bold opacity-80 uppercase leading-none">
                            Total Precip: <span className="text-white ml-1 font-black">{totalPrecip.toFixed(1)}mm</span>
                        </div>
                        {calcRain > 0 && (
                            <div className="text-[9px] font-bold text-red-200 uppercase leading-none border-l border-white/20 pl-3">
                                Rain: <span className="ml-1 font-black">{calcRain.toFixed(1)}mm</span>
                            </div>
                        )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="bg-white dark:bg-black/20 rounded-2xl border dark:border-white/5 p-4 flex flex-col items-center justify-center shadow-sm h-28">
                    <span className="text-4xl mb-1">{getWeatherIcon(resort.current.weatherCode || 0)}</span>
                    <span className="text-[8px] font-black uppercase opacity-40 tracking-widest">Vreme</span>
                  </div>
                  
                  <div className="bg-white dark:bg-black/20 rounded-2xl border dark:border-white/5 p-4 flex flex-col items-center justify-center shadow-sm h-28">
                    <span className="text-2xl font-black italic">{resort.current.temp}°C</span>
                    <span className="text-[8px] font-black uppercase opacity-40 mt-1 tracking-widest">Temp</span>
                  </div>

                  <div className="bg-white dark:bg-black/20 rounded-2xl border dark:border-white/5 p-4 flex flex-col items-center justify-center shadow-sm h-28">
                    <div 
                      className="text-4xl font-black text-slate-900 dark:text-white"
                      style={{ transform: `rotate(${resort.current.windDir}deg)`, transition: 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      ↑
                    </div>
                    <span className="text-[8px] font-black uppercase opacity-40 mt-1 tracking-widest">{resort.current.windSpeed} m/s</span>
                  </div>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={() => setSelectedResort(resort)}
                        className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg active:scale-95"
                    >
                        {lang === 'sr' ? 'KAMERE' : 'LIVE CAMS'}
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <LiveCamModal isOpen={!!selectedResort} onClose={() => setSelectedResort(null)} resort={selectedResort} />
    </div>
  );
}