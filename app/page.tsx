"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Thermometer, Navigation2, CloudFog, Zap, Snowflake, CircleSlash, Rocket, Star, Map as MapIcon, ChevronUp, Droplets 
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '1d', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }, { label: '10d', value: 240 }
];

// ELEGANTNIJE ZASTAVE (Gradients & Shadows)
const FlagSRB = () => (
  <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-slate-100">
    <svg viewBox="0 0 512 512" className="w-full h-full"><path fill="#ff5b5b" d="M0 0h512v170.7H0z"/><path fill="#f0f0f0" d="M0 170.7h512v170.7H0z"/><path fill="#405da8" d="M0 341.3h512V512H0z"/></svg>
  </div>
);
const FlagUSA = () => (
  <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-md flex items-center justify-center bg-slate-100">
    <svg viewBox="0 0 512 512" className="w-full h-full"><circle fill="#405da8" cx="256" cy="256" r="256"/><path fill="#f0f0f0" d="M256 0c-48 0-93.3 13.2-132.1 36.1h396.1C498.8 162.7 512 207.8 512 256s-13.2 93.3-36.1 132.1V36.1C436.7 13.2 391.4 0 343.3 0H256z"/><path fill="#ff5b5b" d="M475.9 388.1C436.7 462.7 353.1 512 256 512S75.3 462.7 36.1 388.1h439.8z"/></svg>
  </div>
);

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
      setResorts(balkanResorts.map((resort, index) => ({ ...resort, ...(data[index] || {}) })));
    }
    load();
  }, []);

  const getStatus = (snow: number) => {
    if (snow >= 100) return { cls: 'bg-red-600 text-white', txt: 'JAPAN STYLE', icon: <Star size={14} className="fill-white" /> };
    if (snow >= 50) return { cls: 'bg-purple-600 text-white', txt: 'DEEP POWDER', icon: <Rocket size={14} /> };
    if (snow >= 20) return { cls: 'bg-indigo-600 text-white', txt: 'POWDER DAY', icon: <Snowflake size={14} /> };
    return { cls: 'bg-slate-200 dark:bg-slate-800 text-slate-500', txt: 'SKIP', icon: <CircleSlash size={14} /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-20">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-black uppercase tracking-tighter">
          <h1 className="text-2xl italic">Balkan <span className="text-blue-600">Freeride Hub</span></h1>
          <div className="flex items-center gap-6">
             <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="hover:scale-110 transition-all flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5">
                {lang === 'sr' ? <FlagUSA /> : <FlagSRB />}
                <span className="text-[10px] pr-1">{lang === 'sr' ? 'EN' : 'SR'}</span>
             </button>
             <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-10 py-6 bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center gap-4 font-black uppercase text-[12px] tracking-[0.3em] rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
          {showMap ? <ChevronUp className="text-blue-600" /> : <MapIcon className="text-blue-600" />}
          {showMap ? "Zatvori Mapu" : "Prikaži Mapu Padavina"}
        </button>

        {/* KONTEJNER MAPE SA NOVOM SENKOM (3D EFEKAT) */}
        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showMap ? 'max-h-[650px] mb-20 opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="h-[600px] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.35)] dark:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.8)] border border-black/5 dark:border-white/10 overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
              <BalkanMap resorts={resorts} timeframe={timeframe} />
           </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16 p-2 bg-white dark:bg-white/5 rounded-[2.5rem] w-fit mx-auto shadow-2xl ring-1 ring-black/5">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase transition-all duration-500 ${timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-900'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {resorts.map((resort) => {
            let calcSnow = 0, totalP = 0, calcRain = 0;
            if (resort.hourly) {
              for (let i = 0; i < timeframe; i++) {
                const t_v = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                if (p > 0) {
                  totalP += p;
                  if (t_v <= 1) calcSnow += p * (t_v <= -5 ? 1.5 : (t_v <= 0 ? 1.2 : 0.8));
                  else calcRain += p;
                }
              }
            }
            const s = getStatus(calcSnow);

            return (
              <div key={resort.id} className="bg-white dark:bg-white/5 p-10 flex flex-col shadow-xl ring-1 ring-black/5 dark:ring-white/10 hover:ring-blue-500/50 dark:hover:ring-blue-400/50 transition-all duration-700 group rounded-[2.5rem] cursor-pointer hover:-translate-y-3">
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 shadow-sm ${s.cls}`}>{s.icon} {s.txt}</div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{resort.name}</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{resort.country}</p>
                </div>

                <div className="h-48 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl mb-8 flex flex-col justify-center">
                  <p className="text-7xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-xl font-normal opacity-40 ml-1">cm</span></p>
                  
                  {/* POPRAVLJEN RED ZA KIŠU */}
                  <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-widest items-center">
                    <span className="flex items-center gap-1.5 opacity-70"><Droplets size={12}/> {totalP.toFixed(1)}mm Total</span>
                    {calcRain > 0 && <span className="text-red-300 animate-pulse bg-red-950/30 px-2 py-0.5 rounded">! Kiša: {calcRain.toFixed(1)}mm</span>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                   <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] h-24 flex items-center justify-center shadow-inner text-slate-300 dark:text-slate-600 italic font-black">SKI</div>
                   <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] h-24 flex flex-col items-center justify-center shadow-inner">
                      <Thermometer size={16} className="text-slate-400 mb-1" />
                      <span className="text-2xl font-black tracking-tighter">{resort.current?.temp ?? '--'}°</span>
                   </div>
                   <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] h-24 flex flex-col items-center justify-center shadow-inner">
                      <Navigation2 size={16} className="text-blue-600 fill-blue-600 mb-1" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)` }} />
                      <span className="text-xl font-black tracking-tighter">{resort.current?.windSpeed ?? '--'}</span>
                   </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-end items-center border-t border-black/5 dark:border-white/5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">→</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}