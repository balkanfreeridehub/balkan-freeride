"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Sun, Moon, Cloud, CloudSnow, CloudRain, Thermometer, Navigation2, 
  CloudFog, Zap, Snowflake, CircleSlash, Rocket, Star, Map as MapIcon, ChevronUp 
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

// SIGURAN RENDERER ZA IKONE (Sprečava Error #130)
const WeatherVisual = ({ code }: { code?: number }) => {
  const className = "w-8 h-8 text-slate-800 dark:text-white transition-colors";
  if (code === undefined) return <CloudFog className="w-8 h-8 opacity-20" />;
  if (code >= 71 && code <= 86) return <CloudSnow className={className} />;
  if (code >= 51 && code <= 67) return <CloudRain className={className} />;
  return (new Date().getHours() >= 19 || new Date().getHours() < 6) ? <Moon className={className} /> : <Sun className={className} />;
};

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
        setResorts(balkanResorts.map((resort, index) => ({ ...resort, ...(data[index] || {}) })));
      } catch (e) { console.error("Data fetch error", e); }
      setLoading(false);
    }
    load();
  }, []);

  const getStatus = (snow: number) => {
    if (snow >= 100) return { cls: 'bg-red-600 text-white', txt: 'JAPAN STYLE', icon: <Star className="w-3.5 h-3.5 fill-white" /> };
    if (snow >= 50) return { cls: 'bg-purple-600 text-white', txt: 'DEEP POWDER', icon: <Rocket className="w-3.5 h-3.5" /> };
    if (snow >= 20) return { cls: 'bg-indigo-600 text-white', txt: 'POWDER DAY', icon: <Snowflake className="w-3.5 h-3.5" /> };
    if (snow >= 3) return { cls: 'bg-amber-400 text-slate-900', txt: 'MAYBE', icon: <Zap className="w-3.5 h-3.5" /> };
    return { cls: 'bg-slate-200 dark:bg-slate-800 text-slate-500', txt: 'SKIP', icon: <CircleSlash className="w-3.5 h-3.5" /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-20 transition-colors duration-500">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-6 py-4 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xl font-black uppercase tracking-tighter">
          <h1>Balkan <span className="text-blue-600 italic">Freeride Hub</span></h1>
          <div className="flex items-center gap-6">
             <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="text-2xl hover:scale-110 transition-transform">
                {lang === 'sr' ? '🇺🇸' : '🇷🇸'}
             </button>
             <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 bg-white dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center gap-3 font-black uppercase text-[12px] tracking-[0.2em] rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
          {showMap ? <ChevronUp className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
          {showMap ? "Sakrij mapu" : "Prikaži mapu padavina"}
        </button>

        <div className={`overflow-hidden transition-all duration-700 ease-in-out ${showMap ? 'max-h-[600px] mb-12 opacity-100' : 'max-h-0 opacity-0'}`}>
           <div className="h-[550px] shadow-2xl ring-1 ring-black/10 dark:ring-white/10 rounded-lg overflow-hidden">
              <BalkanMap resorts={resorts} timeframe={timeframe} />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {resorts.map((resort) => {
            let calcSnow = 0;
            if (resort.hourly?.precipitation) {
              for (let i = 0; i < timeframe; i++) {
                const t = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                if (p > 0 && t <= 1) calcSnow += p * (t <= -5 ? 1.5 : (t <= 0 ? 1.2 : 0.8));
              }
            }
            const s = getStatus(calcSnow);

            return (
              <div key={resort.id} className="cursor-pointer bg-white dark:bg-white/5 p-8 flex flex-col shadow-xl ring-1 ring-black/5 dark:ring-white/5 hover:translate-y-[-8px] transition-all duration-500 group">
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase mb-5 shadow-sm ${s.cls}`}>{s.icon} {s.txt}</div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-1 group-hover:text-blue-600">{resort.name}</h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{resort.country}</p>
                </div>

                <div className="h-44 bg-blue-600 p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl mb-8 flex flex-col justify-center">
                  <p className="text-7xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-xl font-normal opacity-40 uppercase ml-1">cm</span></p>
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl">❄</div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex items-center justify-center shadow-inner"><WeatherVisual code={resort.current?.weatherCode} /></div>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex flex-col items-center justify-center shadow-inner"><Thermometer className="w-4 h-4 mb-1 text-slate-400" /><span className="text-xl font-black">{resort.current?.temp ?? '--'}°</span></div>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex flex-col items-center justify-center shadow-inner"><Navigation2 className="w-4 h-4 mb-1 text-blue-600 fill-blue-600" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)` }} /><span className="text-lg font-black">{resort.current?.windSpeed ?? '--'}</span></div>
                </div>
                <div className="mt-6 text-right"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-blue-600 transition-colors">Detalji & Kamere →</span></div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}