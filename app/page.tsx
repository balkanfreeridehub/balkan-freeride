"use client"
import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle'; // Ovde ćemo promeniti dizajn dugmeta
import LiveCamModal from '../components/LiveCamModal';
import { 
  Sun, Moon, Cloud, CloudSnow, CloudRain, Thermometer, Navigation2, 
  CloudFog, Zap, Snowflake, CircleSlash, Rocket, Droplets, Info, ChevronDown
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '1d', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }, { label: '10d', value: 240 }
];

const translations = {
  sr: { hub: "Freeride", live: "UŽIVO KAMERE", snow: "Sneg", total: "Ukupno", rain: "Kiša", scanning: "Skeniranje..." },
  en: { hub: "Freeride", live: "LIVE CAMS", snow: "Snow", total: "Total", rain: "Rain", scanning: "Scanning..." }
};

const WeatherVisual = ({ code }: { code?: number }) => {
  if (code === undefined) return <CloudFog className="w-8 h-8 opacity-20" />;
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6;
  const className = "w-8 h-8 text-slate-800 dark:text-white"; 
  if (code >= 71 && code <= 86) return <CloudSnow className={className} />;
  if (code >= 51 && code <= 67) return <CloudRain className={className} />;
  return isNight ? <Moon className={className} /> : <Sun className={className} />;
};

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [resorts, setResorts] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [timeframe, setTimeframe] = useState(24);
  const [loading, setLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
      const validData = balkanResorts.map((resort, index) => ({
        ...resort,
        ...(data[index] || {})
      }));
      setResorts(validData);
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
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-6 py-4 border-b dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Balkan <span className="text-blue-600 italic">{t.hub}</span>
          </h1>
          
          <div className="flex items-center gap-6">
            {/* Language Dropdown sa zastavicama */}
            <div className="relative">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:opacity-70 transition-all"
              >
                {lang === 'sr' ? '🇷🇸 SRB' : '🇺🇸 ENG'}
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-3 w-32 bg-white dark:bg-[#0f172a] shadow-2xl border dark:border-white/10 overflow-hidden z-[60]">
                  <button onClick={() => {setLang('sr'); setIsLangOpen(false)}} className="w-full px-4 py-3 text-left text-[10px] font-black hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2">
                    🇷🇸 SRBIJA
                  </button>
                  <button onClick={() => {setLang('en'); setIsLangOpen(false)}} className="w-full px-4 py-3 text-left text-[10px] font-black hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2 border-t dark:border-white/5">
                    🇺🇸 ENGLISH
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Mapa - BEZ rounded corners */}
        <div className="overflow-hidden mb-12 shadow-sm h-[500px] bg-white dark:bg-white/5 border dark:border-white/5">
          <BalkanMap resorts={resorts} timeframe={timeframe} />
        </div>

        {/* Time Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 p-1 bg-slate-200/50 dark:bg-white/5 w-fit mx-auto border dark:border-white/5 shadow-inner">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-6 py-2.5 text-[10px] font-black uppercase transition-all ${timeframe === opt.value ? 'bg-white dark:bg-white/20 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Grid - BEZ rounded corners na karticama */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase opacity-20 animate-pulse text-2xl tracking-tighter italic">{t.scanning}</div>
          ) : (
            resorts.map((resort) => {
              let calcSnow = 0, totalP = 0, calcRain = 0;
              if (resort.hourly) {
                for (let i = 0; i < timeframe; i++) {
                  const t_v = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                  if (p > 0) {
                    totalP += p;
                    if (t_v <= 2) calcSnow += p * (t_v <= -5 ? 1.5 : (t_v <= 0 ? 1 : 0.5));
                    else calcRain += p;
                  }
                }
              }
              const s = getStatus(calcSnow);

              return (
                <div key={resort.id} className="bg-white dark:bg-white/5 p-8 border dark:border-white/5 flex flex-col h-full hover:bg-slate-50 dark:hover:bg-white/[0.07] transition-all group">
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase mb-4 shadow-sm ${s.cls} text-white`}>
                      {s.icon} {s.txt}
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">{resort.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resort.country}</p>
                  </div>

                  <div className="h-40 bg-slate-950 dark:bg-blue-600 p-8 text-white relative overflow-hidden mb-8 flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase opacity-40 mb-1 tracking-widest">{t.snow} (+{timeframe}h)</p>
                    <p className="text-6xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-xl font-normal opacity-30 uppercase ml-1">cm</span></p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-[11px] font-bold uppercase opacity-60">
                      <span>{t.total}: {totalP.toFixed(1)}mm</span>
                      {calcRain > 0 && <span className="text-red-400">!! Kiša: {calcRain.toFixed(1)}mm</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1 mb-8">
                    <div className="bg-slate-50 dark:bg-white/5 h-24 flex items-center justify-center border dark:border-white/5">
                      <WeatherVisual code={resort.current?.weatherCode} />
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 h-24 flex flex-col items-center justify-center border dark:border-white/5">
                      <Thermometer className="w-4 h-4 mb-1 text-slate-300" />
                      <span className="text-xl font-black">{resort.current?.temp ?? '--'}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 h-24 flex flex-col items-center justify-center border dark:border-white/5">
                      <Navigation2 className="w-4 h-4 mb-1 text-blue-600 fill-blue-600" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)` }} />
                      <span className="text-lg font-black tracking-tighter">{resort.current?.windSpeed ?? '--'}</span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedResort(resort)} className="mt-auto w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-[0.98]">
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