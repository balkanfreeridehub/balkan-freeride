"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import LiveCamModal from '../components/LiveCamModal';
import { 
  Sun, Moon, Cloud, CloudSnow, CloudRain, Thermometer, Navigation2, 
  CloudFog, CloudLightning, Zap, Snowflake, Skull, CircleSlash, Rocket, Droplets, Info
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '1d', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }, { label: '10d', value: 240 }
];

// Rečnik za promenu jezika
const translations = {
  sr: { hub: "Freeride", live: "UŽIVO KAMERE", snow: "Prognoza snega", total: "Ukupno", rain: "Kiša", scanning: "Skeniranje...", loading: "Učitavanje..." },
  en: { hub: "Freeride", live: "LIVE CAMS", snow: "Snow Forecast", total: "Total", rain: "Rain", scanning: "Scanning...", loading: "Loading..." }
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
      const data = await Promise.all(balkanResorts.map(async (r) => {
        const w = await getWeatherData(r.lat, r.lon);
        return { ...r, ...w };
      }));
      setResorts(data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatus = (snow: number) => {
    if (snow >= 80) return { cls: 'bg-purple-600', txt: 'DEEP POWDER', icon: <Rocket className="w-3.5 h-3.5" /> };
    if (snow >= 30) return { cls: 'bg-indigo-600', txt: 'POWDER DAY', icon: <Snowflake className="w-3.5 h-3.5" /> };
    if (snow >= 10) return { cls: 'bg-green-500', txt: 'RIDEABLE', icon: <Zap className="w-3.5 h-3.5" /> };
    if (snow >= 3) return { cls: 'bg-amber-500', txt: 'MAYBE', icon: <Info className="w-3.5 h-3.5" /> };
    return { cls: 'bg-slate-400', txt: 'SKIP', icon: <CircleSlash className="w-3.5 h-3.5" /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      {/* Moderan Nav - bez jakog bordera */}
      <nav className="sticky top-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl z-50 px-6 py-4 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Balkan <span className="text-blue-600 italic">{t.hub}</span>
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="text-[11px] font-black px-4 py-2 bg-white dark:bg-white/5 rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10 hover:bg-slate-50 transition-all">
              {lang === 'sr' ? 'SRB' : 'ENG'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Mapa - Glassmorphism */}
        <div className="rounded-[3rem] overflow-hidden mb-12 shadow-2xl shadow-blue-500/10 h-[500px] bg-white dark:bg-white/5 p-4 ring-1 ring-black/5 dark:ring-white/5">
          <BalkanMap resorts={resorts} timeframe={timeframe} />
        </div>

        {/* Time Selector - Bez bordera, samo senka i ring */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 p-2 bg-white dark:bg-white/5 rounded-[2rem] w-fit mx-auto shadow-xl ring-1 ring-black/5 dark:ring-white/5">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-6 py-3 rounded-[1.5rem] text-[11px] font-black uppercase transition-all duration-300 ${timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase opacity-20 animate-pulse tracking-widest italic text-2xl">{t.scanning}</div>
          ) : (
            resorts.map((resort) => {
              let calcSnow = 0, calcRain = 0, totalP = 0;
              if (resort.hourly) {
                for (let i = 0; i < timeframe; i++) {
                  const t_val = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                  if (p > 0) {
                    totalP += p;
                    if (t_val <= -5) calcSnow += p * 1.5;
                    else if (t_val <= 0) calcSnow += p * 1.0;
                    else if (t_val <= 2) calcSnow += p * 0.5;
                    else calcRain += p;
                  }
                }
              }
              const s = getStatus(calcSnow);

              return (
                <div key={resort.id} className="bg-white dark:bg-white/5 p-8 rounded-[3.5rem] flex flex-col h-full shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-black/5 dark:ring-white/5 hover:translate-y-[-8px] transition-all duration-500">
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase mb-5 shadow-sm ${s.cls} text-white`}>
                      {s.icon} {s.txt}
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{resort.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{resort.country}</p>
                  </div>

                  <div className="h-48 bg-blue-600 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-600/40 mb-10 flex flex-col justify-center">
                    <p className="text-[11px] font-black uppercase opacity-70 mb-2 tracking-widest">{t.snow} (+{timeframe}h)</p>
                    <p className="text-7xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-2xl font-normal opacity-50 uppercase ml-1 tracking-normal">cm</span></p>
                    
                    {/* Padavine - Veći font i primetnije */}
                    <div className="flex gap-6 mt-6 pt-5 border-t border-white/20 text-[12px] font-black uppercase">
                      <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-blue-200" /> {t.total}: {totalP.toFixed(1)}mm</div>
                      {calcRain > 0 && <div className="text-red-300 font-black underline underline-offset-4 decoration-2">!! {t.rain}: {calcRain.toFixed(1)}mm</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-[2.2rem] h-28 flex items-center justify-center shadow-inner">
                      <WeatherVisual code={resort.current?.weatherCode} />
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-[2.2rem] h-28 flex flex-col items-center justify-center">
                      <Thermometer className="w-5 h-5 mb-2 text-slate-300" />
                      <span className="text-2xl font-black">{resort.current?.temp ?? '--'}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-[2.2rem] h-28 flex flex-col items-center justify-center">
                      <Navigation2 className="w-5 h-5 mb-2 text-blue-600 fill-blue-600" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)`, transition: '2s' }} />
                      <span className="text-xl font-black tracking-tighter">{resort.current?.windSpeed ?? '--'}<span className="text-[10px] font-normal opacity-40 ml-0.5">m/s</span></span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedResort(resort)} className="mt-auto w-full py-7 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[12px] tracking-[0.3em] rounded-[2rem] hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-xl active:scale-95 italic">
                    {t.live}
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