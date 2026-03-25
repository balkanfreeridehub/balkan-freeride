"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';
import LiveCamModal from '../components/LiveCamModal';

const timeOptions = [
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log("%c [System] Započinjem osvežavanje planina...", "font-weight: bold; color: #8b57ff");
      try {
        const data = await Promise.all(balkanResorts.map(async (r) => {
          const w = await getWeatherData(r.id);
          return { ...r, ...w };
        }));
        setResorts(data);
      } catch (err) {
        console.error("Fatalna greška pri učitavanju:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const t = {
    sr: { forecast: "Prognoza", cam: "Kamera", wind: "Vetar", loading: "Skeniranje vrhova..." },
    en: { forecast: "Forecast", cam: "Live Cam", wind: "Wind", loading: "Scanning peaks..." }
  }[lang];

  const translateCondition = (text: string) => {
    const low = text?.toLowerCase() || "";
    if (low.includes('snow') || low.includes('blizzard')) return lang === 'sr' ? "Sneg veje" : "Snowing";
    if (low.includes('rain')) return lang === 'sr' ? "Kiša" : "Rain";
    if (low.includes('cloud') || low.includes('overcast')) return lang === 'sr' ? "Oblačno" : "Cloudy";
    if (low.includes('mist') || low.includes('fog')) return lang === 'sr' ? "Magla" : "Foggy";
    if (low.includes('sunny') || low.includes('clear')) return lang === 'sr' ? "Vedro" : "Clear";
    return text || "...";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <h1 className="text-xl font-black italic uppercase tracking-tighter">
            Balkan <span className="text-blue-600">Freeride</span> Hub
          </h1>
          
          <div className="flex items-center gap-3">
            {/* TEST LAB DUGME */}
            <Link 
              href="/test" 
              className="text-[10px] font-black uppercase px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Test Lab 🧪
            </Link>

            <button 
              onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} 
              className="text-[10px] font-black uppercase px-3 py-1.5 bg-slate-100 dark:bg-white/10 rounded-lg border dark:border-white/5"
            >
              {lang === 'sr' ? 'EN' : 'SR'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* MAPA */}
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-10 shadow-2xl bg-slate-50 dark:bg-slate-900 min-h-[400px]">
          <BalkanMap resorts={resorts} />
        </div>

        {/* TIME SELECTOR */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/5 shadow-inner">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTimeframe(opt.value)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-blue-500'
              }`}
            >
              {opt.label[lang]}
            </button>
          ))}
        </div>

        {/* GRID KARTICA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase italic opacity-30 animate-pulse tracking-widest">
              {t.loading}
            </div>
          ) : (
            resorts.map((resort) => {
              if (!resort.dailyForecast) {
                return (
                  <div key={resort.id} className="p-8 border-2 border-dashed border-red-500/20 rounded-[3rem] text-center opacity-50">
                    <p className="text-[10px] font-black text-red-500 uppercase">Error: {resort.name}</p>
                  </div>
                );
              }

              const daysToSum = Math.ceil(timeframe / 24);
              const totalSnow = resort.dailyForecast.slice(0, daysToSum).reduce((acc: number, day: any) => {
                return day.avgTemp < 4 ? acc + day.precip : acc;
              }, 0);

              return (
                <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[3rem] hover:shadow-2xl transition-all group hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic leading-none">{resort.name}</h3>
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">{resort.country}</p>
                    </div>
                    <span className="text-2xl">❄️</span>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-black/20 p-5 rounded-2xl border dark:border-white/5 mb-6 shadow-sm">
                    <div className="text-2xl font-black italic">{resort.temp}°</div>
                    <div className="flex items-center gap-4 border-l dark:border-white/10 pl-5">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold mb-1 shadow-md" style={{ transform: `rotate(${resort.windDir}deg)`, transition: 'transform 1s' }}>↑</div>
                        <span className="text-[8px] font-black uppercase opacity-40">{t.wind}</span>
                      </div>
                      <span className="text-lg font-black">{resort.windSpeed}<span className="text-[10px] ml-1 opacity-50 uppercase text-blue-600 font-bold">m/s</span></span>
                    </div>
                  </div>

                  <div className="mb-8 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase opacity-70 mb-1">
                        {t.forecast} (+{timeframe/24} {lang === 'sr' ? 'D' : 'D'})
                      </p>
                      <p className="text-5xl font-black italic">
                        +{Math.round(totalSnow)} <span className="text-2xl uppercase">cm</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedResort(resort)}
                    className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-black/10 dark:shadow-none"
                  >
                    {t.cam}
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