"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link'; // Za buduće rute
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Sun, Moon, Thermometer, Navigation2, CloudFog, Zap, Snowflake, 
  CircleSlash, Rocket, Star, Map as MapIcon, ChevronDown, ChevronUp 
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '1d', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }, { label: '10d', value: 240 }
];

const FlagSRB = () => <svg viewBox="0 0 36 24" className="w-5 h-5 rounded-full shadow-sm"><path fill="#C6363C" d="M0 0h36v8H0z"/><path fill="#fff" d="M0 8h36v8H0z"/><path fill="#2D4D8F" d="M0 16h36v8H0z"/></svg>;
const FlagUSA = () => <svg viewBox="0 0 36 24" className="w-5 h-5 rounded-full shadow-sm"><path fill="#fff" d="M0 0h36v24H0z"/><path fill="#B22234" d="M0 0h36v1.8H0zm0 3.6h36v1.8H0z"/><path fill="#3C3B6E" d="M0 0h14.4v12.6H0z"/></svg>;

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState(24);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
      setResorts(balkanResorts.map((resort, index) => ({ ...resort, ...(data[index] || {}) })));
      setLoading(false);
    }
    load();
  }, []);

  const getStatus = (snow: number) => {
    if (snow >= 100) return { cls: 'bg-red-600 text-white', txt: 'JAPAN STYLE', icon: <Star className="w-3.5 h-3.5 fill-white" /> };
    if (snow >= 50) return { cls: 'bg-purple-600 text-white', txt: 'DEEP POWDER', icon: <Rocket className="w-3.5 h-3.5" /> };
    if (snow >= 20) return { cls: 'bg-indigo-600 text-white', txt: 'POWDER DAY', icon: <Snowflake className="w-3.5 h-3.5" /> };
    if (snow >= 10) return { cls: 'bg-green-500 text-white', txt: 'RIDEABLE', icon: <Zap className="w-3.5 h-3.5" /> };
    if (snow >= 3) return { cls: 'bg-amber-400 text-slate-900', txt: 'MAYBE', icon: <Info className="w-3.5 h-3.5" /> };
    return { cls: 'bg-slate-200 dark:bg-slate-800 text-slate-500', txt: 'SKIP', icon: <CircleSlash className="w-3.5 h-3.5" /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500 pb-20">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-6 py-4 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Balkan <span className="text-blue-600 italic">Freeride Hub</span>
          </h1>
          <div className="flex items-center gap-6">
            <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="hover:scale-110 transition-transform">
              {lang === 'sr' ? <FlagUSA /> : <FlagSRB />}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* MAP TOGGLE SA SMOOTH ANIMACIJOM */}
        <button 
          onClick={() => setShowMap(!showMap)}
          className="w-full mb-8 py-5 bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center gap-3 font-black uppercase text-[12px] tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-white/10 transition-all rounded-xl"
        >
          {showMap ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <MapIcon className="w-4 h-4 text-blue-600" />}
          {showMap ? "Sakrij mapu" : "Prikaži mapu padavina"}
        </button>

        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showMap ? 'max-h-[600px] mb-12 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="h-[550px] shadow-2xl ring-1 ring-black/10 dark:ring-white/10">
            <BalkanMap resorts={resorts} timeframe={timeframe} />
          </div>
        </div>

        {/* TIME SELECTOR */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 p-2 bg-white dark:bg-white/5 rounded-[2.2rem] w-fit mx-auto shadow-xl ring-1 ring-black/5 dark:ring-white/5">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-6 py-3 rounded-[1.8rem] text-[11px] font-black uppercase transition-all duration-300 ${timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* RESORT GRID - KARTICE SU KLIKABILNE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resorts.map((resort) => {
            let calcSnow = 0;
            if (resort.hourly) {
              for (let i = 0; i < timeframe; i++) {
                const t_v = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                if (p > 0 && t_v <= 1) calcSnow += p * (t_v <= -5 ? 1.5 : (t_v <= 0 ? 1.2 : 0.8));
              }
            }
            const s = getStatus(calcSnow);

            return (
              <div 
                key={resort.id} 
                onClick={() => console.log(`Navigacija na /resort/${resort.id}`)}
                className="cursor-pointer bg-white dark:bg-white/5 p-8 flex flex-col h-full shadow-xl ring-1 ring-black/5 dark:ring-white/5 hover:translate-y-[-8px] hover:shadow-2xl transition-all duration-500 group relative"
              >
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase mb-5 shadow-sm ${s.cls}`}>
                    {s.icon} {s.txt}
                  </div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1 group-hover:text-blue-600 transition-colors">{resort.name}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{resort.country}</p>
                </div>

                <div className="h-44 bg-blue-600 p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl mb-8 flex flex-col justify-center">
                  <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest italic">Prognoza (+{timeframe}h)</p>
                  <p className="text-7xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-xl font-normal opacity-40 uppercase ml-1">cm</span></p>
                  {/* Efekat snega u pozadini box-a */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl">❄</div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex items-center justify-center shadow-inner ring-1 ring-black/[0.02]">
                    <CloudFog className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex flex-col items-center justify-center shadow-inner ring-1 ring-black/[0.02]">
                    <Thermometer className="w-4 h-4 mb-1 text-slate-400" />
                    <span className="text-xl font-black">{resort.current?.temp ?? '--'}°</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex flex-col items-center justify-center shadow-inner ring-1 ring-black/[0.02]">
                    <Navigation2 className="w-4 h-4 mb-1 text-blue-600 fill-blue-600" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)` }} />
                    <span className="text-lg font-black tracking-tighter">{resort.current?.windSpeed ?? '--'}</span>
                  </div>
                </div>
                
                {/* Suptilna indikacija klikabilnosti */}
                <div className="mt-6 flex justify-end">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-blue-600 transition-colors">Detalji & Kamere →</span>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}