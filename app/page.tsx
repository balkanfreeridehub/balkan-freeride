"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

  const getFreerideStatus = (snow: number, temp: number, wind: number) => {
    let score = 0;
    if (snow > 10) score += 2;
    else if (snow > 3) score += 1;
    if (temp < 0) score += 1;
    if (wind < 8) score += 1;

    if (score >= 4) return { cls: 'bg-[#00c853]', label: 'POWDER ALERT' };
    if (score >= 2) return { cls: 'bg-[#ffd600] text-black', label: 'RIDEABLE' };
    return { cls: 'bg-[#d50000]', label: 'SKIP' };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50 px-6">
        <div className="max-w-7xl mx-auto h-20 flex justify-between items-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/test" className="text-[10px] font-black uppercase px-3 py-1.5 bg-slate-100 dark:bg-white/10 rounded-lg hover:bg-blue-600 hover:text-white transition-all">Lab 🧪</Link>
            <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="text-[10px] font-black uppercase px-3 py-1.5 bg-slate-100 dark:bg-white/10 rounded-lg border dark:border-white/5">
                {lang === 'sr' ? 'EN' : 'SR'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-10 shadow-2xl bg-slate-50 dark:bg-slate-900 min-h-[400px]">
          <BalkanMap resorts={resorts} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/5 shadow-inner">
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
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase italic opacity-20 animate-pulse tracking-widest">Skeniranje Balkana...</div>
          ) : (
            resorts.map((resort) => {
              if (!resort.hourly) return null;

              // --- NAPREDNA BALKAN SLR MATEMATIKA ---
              let calcSnow = 0;
              let calcRain = 0;
              for (let i = 0; i < timeframe; i++) {
                const t = resort.hourly.temperature_2m[i];
                const p = resort.hourly.precipitation[i] || 0;
                if (p > 0) {
                  if (t <= -5) calcSnow += p * 1.3;
                  else if (t <= 0) calcSnow += p * 1.0;
                  else if (t <= 2) calcSnow += p * 0.5;
                  else calcRain += p;
                }
              }

              const status = getFreerideStatus(calcSnow, resort.current.temp, resort.current.windSpeed);

              return (
                <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[3rem] hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black mb-3 uppercase tracking-tighter shadow-sm ${status.cls}`}>
                        {status.label}
                      </div>
                      <h3 className="text-2xl font-black uppercase italic leading-none">{resort.name}</h3>
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">{resort.country}</p>
                    </div>
                    <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">🏔️</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border dark:border-white/5 shadow-sm">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Temp</p>
                        <p className="text-2xl font-black italic">{resort.current.temp}°C</p>
                    </div>
                    <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border dark:border-white/5 shadow-sm">
                        <p className="text-[8px] font-black uppercase opacity-40 mb-1">Vetar</p>
                        <p className="text-2xl font-black italic">{resort.current.windSpeed} <span className="text-xs">m/s</span></p>
                    </div>
                  </div>

                  <div className="mb-8 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase opacity-70 mb-1 italic">Sneg (+{timeframe}h)</p>
                      <p className="text-5xl font-black italic">
                        +{calcSnow.toFixed(1)} <span className="text-2xl uppercase font-normal">cm</span>
                      </p>
                      {calcRain > 0 && (
                        <p className="text-[9px] font-bold mt-2 bg-black/20 w-fit px-2 py-0.5 rounded-full border border-white/10">
                          ⚠️ Moguća kiša: {calcRain.toFixed(1)} mm
                        </p>
                      )}
                    </div>
                    {status.label === 'POWDER ALERT' && (
                        <div className="absolute -right-2 -bottom-2 opacity-10 text-8xl rotate-12">❄️</div>
                    )}
                  </div>

                  <button 
                    onClick={() => setSelectedResort(resort)}
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-black/5 dark:shadow-none"
                  >
                    {lang === 'sr' ? 'KAMERE' : 'LIVE CAMS'}
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