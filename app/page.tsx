"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Thermometer, Navigation2, CloudFog, Zap, Snowflake, CircleSlash, Rocket, Star, Map as MapIcon, ChevronUp, Droplets, Wind 
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const FlagUSA = () => ( <svg width="32" height="32" viewBox="0 0 64 64" className="rounded-full shadow-md"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#428bc1" d="M16 6.6C10.1 11.2 2 20.4 2 32h30V2c-5.9 0-11.3 1.7-16 4.6z"/><path fill="#fff" d="M25 3l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5z"/></svg> );
const FlagSRB = () => ( <svg width="32" height="32" viewBox="0 0 64 64" className="rounded-full shadow-md"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/></svg> );

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '24h', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }
];

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

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
    if (snow >= 100) return { color: '#ef4444', cls: 'bg-red-600 text-white', txt: 'JAPAN STYLE', icon: <Star size={14} fill="white"/> };
    if (snow >= 50) return { color: '#9333ea', cls: 'bg-purple-600 text-white', txt: 'DEEP POWDER', icon: <Rocket size={14} /> };
    if (snow >= 20) return { color: '#4f46e5', cls: 'bg-indigo-600 text-white', txt: 'POWDER DAY', icon: <Snowflake size={14} /> };
    if (snow >= 10) return { color: '#22c55e', cls: 'bg-green-500 text-white', txt: 'RIDEABLE', icon: <Zap size={14} /> };
    return { color: '#94a3b8', cls: 'bg-slate-200 dark:bg-slate-800 text-slate-500', txt: 'SKIP', icon: <CircleSlash size={14} /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-20 selection:bg-blue-500/30">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:rotate-12 transition-all">
               <Snowflake size={24} />
            </div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-blue-600">Freeride</span>Hub</h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setLang(l => l === 'sr' ? 'en' : 'sr')} className="hover:scale-110 active:scale-95 transition-all">
                {lang === 'sr' ? <FlagUSA /> : <FlagSRB />}
             </button>
             <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center gap-4 font-black uppercase text-[12px] tracking-[0.3em] rounded-[2.5rem] hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
          {showMap ? <ChevronUp className="text-blue-600 animate-bounce" /> : <MapIcon className="text-blue-600" />}
          {showMap ? (lang === 'sr' ? 'Zatvori Mapu' : 'Close Map') : (lang === 'sr' ? 'Prikaži Mapu' : 'Show Map')}
        </button>

        <div className={`transition-all duration-700 ease-in-out ${showMap ? 'max-h-[700px] mb-20 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95 overflow-hidden'}`}>
           <div className="h-[600px] border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900/50 overflow-hidden relative rounded-[3.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-blue-900/10">
              <BalkanMap resorts={resorts} timeframe={timeframe} onSelect={(r) => router.push(`/resort/${r.id}`)} getStatus={getStatus} />
           </div>
        </div>

        {/* TIME SLIDER */}
        <div className="flex flex-wrap justify-center gap-2 mb-20 p-2 bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2.5rem] w-fit mx-auto shadow-xl ring-1 ring-black/5">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-8 py-4 rounded-[2rem] text-[11px] font-black uppercase transition-all duration-300 ${timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
             Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[500px] bg-white dark:bg-white/5 rounded-[3rem] border border-black/5 animate-pulse flex flex-col p-10">
                <div className="w-32 h-8 bg-slate-200 dark:bg-white/10 rounded-full mb-6" />
                <div className="w-full h-12 bg-slate-200 dark:bg-white/10 rounded-2xl mb-4" />
                <div className="w-1/2 h-4 bg-slate-200 dark:bg-white/10 rounded-full mb-10" />
                <div className="flex-1 bg-slate-100 dark:bg-white/10 rounded-[2.5rem] mb-8" />
                <div className="grid grid-cols-3 gap-4 mt-auto">
                   <div className="h-20 bg-slate-100 dark:bg-white/10 rounded-2xl" />
                   <div className="h-20 bg-slate-100 dark:bg-white/10 rounded-2xl" />
                   <div className="h-20 bg-slate-100 dark:bg-white/10 rounded-2xl" />
                </div>
              </div>
             ))
          ) : (
            resorts.map((resort) => {
              let calcSnow = 0, calcRain = 0;
              if (resort.hourly) {
                for (let i = 0; i < timeframe; i++) {
                  const tv = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                  if (p > 0) tv <= 1 ? calcSnow += p * 1.2 : calcRain += p;
                }
              }
              const s = getStatus(calcSnow);

              return (
                <div key={resort.id} onClick={() => router.push(`/resort/${resort.id}`)} className="bg-white dark:bg-white/5 p-10 flex flex-col shadow-xl border border-black/5 dark:border-white/5 rounded-[3.5rem] cursor-pointer hover:-translate-y-4 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group">
                  <div className="mb-8">
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 ${s.cls}`}>{s.icon} {s.txt}</div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2 group-hover:text-blue-600 transition-colors">{resort.name}</h3>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{resort.country}</p>
                  </div>

                  <div className="h-48 p-8 rounded-[2.8rem] text-white relative overflow-hidden shadow-2xl mb-8 flex flex-col justify-center transition-colors duration-700" style={{ backgroundColor: s.color }}>
                    <div className="flex items-baseline font-black italic tracking-tighter tabular-nums leading-none">
                      <span className="text-6xl lg:text-7xl">+{calcSnow.toFixed(1)}</span>
                      <span className="text-xl ml-2 opacity-60 not-italic uppercase font-bold">cm</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-4 text-[10px] font-black uppercase tracking-widest opacity-80">
                      {calcRain > 0 && <span className="bg-white/20 px-3 py-1 rounded-full text-red-100">! {calcRain.toFixed(1)}mm Rain Alert</span>}
                    </div>
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Current Status</p>
                  <div className="grid grid-cols-3 gap-4">
                     <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] h-24 flex items-center justify-center text-slate-400"><CloudFog size={24} /></div>
                     <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] h-24 flex flex-col items-center justify-center font-black tracking-tighter">
                        <Thermometer size={14} className="mb-1 text-slate-400"/>
                        <span className="text-2xl">{resort.current?.temp ?? '--'}°</span>
                     </div>
                     <div className="bg-slate-50 dark:bg-white/5 rounded-[2rem] h-24 flex flex-col items-center justify-center font-black tracking-tighter">
                        <Wind size={14} className="mb-1 text-blue-600"/>
                        <span className="text-xl">{resort.current?.windSpeed ?? '--'}</span>
                     </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}