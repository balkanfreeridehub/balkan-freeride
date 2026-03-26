"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import LiveCamModal from '../components/LiveCamModal';
import { 
  Sun, Moon, Cloud, CloudSnow, CloudRain, Thermometer, Navigation2, 
  CloudFog, Zap, Snowflake, CircleSlash, Rocket, Droplets, Info, Star
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '1d', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }, { label: '10d', value: 240 }
];

const translations = {
  sr: { hub: "Freeride Hub", live: "UŽIVO KAMERE", snow: "Prognoza snega", total: "Ukupno", rain: "Kiša", scanning: "Skeniranje Balkana...", error: "Greška..." },
  en: { hub: "Freeride Hub", live: "LIVE CAMS", snow: "Snow Forecast", total: "Total", rain: "Rain", scanning: "Scanning Balkans...", error: "Error..." }
};

// SVG ZASTAVE - Da bi se sigurno videle na Vercelu
const FlagSRB = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className="w-5 h-5 rounded-full"><path fill="#C6363C" d="M0 0h36v8H0z"/><path fill="#fff" d="M0 8h36v8H0z"/><path fill="#2D4D8F" d="M0 16h36v8H0z"/></svg>;
const FlagUSA = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" className="w-5 h-5 rounded-full"><path fill="#fff" d="M0 0h36v24H0z"/><path fill="#B22234" d="M0 0h36v1.8H0zm0 3.6h36v1.8H0zm0 3.6h36v1.8H0zm0 3.6h36v1.8H0zm0 3.6h36v1.8H0zm0 3.6h36v1.8H0z"/><path fill="#3C3B6E" d="M0 0h14.4v12.6H0z"/></svg>;

const WeatherVisual = ({ code }: { code?: number }) => {
  if (code === undefined) return <CloudFog className="w-8 h-8 opacity-20" />;
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6;
  const className = "w-8 h-8 text-slate-800 dark:text-white transition-colors"; 
  if (code >= 71 && code <= 86) return <CloudSnow className={className} />;
  if (code >= 51 && code <= 67) return <CloudRain className={className} />;
  return isNight ? <Moon className={className} /> : <Sun className={className} />;
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
      const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
      setResorts(balkanResorts.map((resort, index) => ({ ...resort, ...(data[index] || {}) })));
      setLoading(false);
    }
    load();
  }, []);

  const getStatus = (snow: number) => {
    if (snow >= 100) return { cls: 'bg-black text-yellow-400 border-2 border-yellow-400', txt: 'JAPAN STYLE', icon: <Star className="w-3.5 h-3.5 fill-yellow-400" /> };
    if (snow >= 50) return { cls: 'bg-purple-600 text-white', txt: 'DEEP POWDER', icon: <Rocket className="w-3.5 h-3.5" /> };
    if (snow >= 20) return { cls: 'bg-indigo-600 text-white', txt: 'POWDER DAY', icon: <Snowflake className="w-3.5 h-3.5" /> };
    if (snow >= 10) return { cls: 'bg-green-500 text-white', txt: 'RIDEABLE', icon: <Zap className="w-3.5 h-3.5" /> };
    if (snow >= 3) return { cls: 'bg-amber-500 text-white', txt: 'MAYBE', icon: <Info className="w-3.5 h-3.5" /> };
    return { cls: 'bg-slate-400 text-white', txt: 'SKIP', icon: <CircleSlash className="w-3.5 h-3.5" /> };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      <nav className="sticky top-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl z-50 px-6 py-4 shadow-sm ring-1 ring-black/5 dark:ring-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Balkan <span className="text-blue-600 italic">{t.hub}</span>
          </h1>
          
          <div className="flex items-center gap-6">
            {/* Language Switcher - Prikazuje samo DRUGU zastavicu */}
            <button 
              onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')}
              className="hover:scale-125 transition-transform active:scale-90"
              title={lang === 'sr' ? 'Prebaci na ENG' : 'Prebaci na SRB'}
            >
              {lang === 'sr' ? <FlagUSA /> : <FlagSRB />}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="overflow-hidden mb-12 shadow-2xl h-[550px] bg-white dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10">
          <BalkanMap resorts={resorts} timeframe={timeframe} />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-16 p-2 bg-white dark:bg-white/5 rounded-[2.2rem] w-fit mx-auto shadow-xl ring-1 ring-black/5 dark:ring-white/5">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-6 py-3 rounded-[1.8rem] text-[11px] font-black uppercase transition-all duration-300 ${timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase opacity-20 animate-pulse text-2xl tracking-widest italic">{t.scanning}</div>
          ) : (
            resorts.map((resort) => {
              let calcSnow = 0, totalP = 0, calcRain = 0;
              if (resort.hourly) {
                for (let i = 0; i < timeframe; i++) {
                  const t_v = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                  if (p > 0) {
                    totalP += p;
                    // Ispravljena matematika snega
                    if (t_v <= 1) { 
                      const ratio = t_v <= -5 ? 1.5 : (t_v <= 0 ? 1.2 : 0.8);
                      calcSnow += p * ratio;
                    } else { calcRain += p; }
                  }
                }
              }
              const s = getStatus(calcSnow);

              return (
                <div key={resort.id} className="bg-white dark:bg-white/5 p-8 flex flex-col h-full shadow-xl ring-1 ring-black/5 dark:ring-white/5 hover:translate-y-[-5px] transition-all duration-500 group">
                  <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase mb-5 shadow-md ${s.cls}`}>
                      {s.icon} {s.txt}
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1 group-hover:text-blue-600 transition-colors">{resort.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{resort.country}</p>
                  </div>

                  <div className="h-44 bg-blue-600 p-8 rounded-[2rem] text-white relative overflow-hidden shadow-xl mb-8 flex flex-col justify-center">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-widest">{t.snow} (+{timeframe}h)</p>
                    <p className="text-6xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-xl font-normal opacity-40 uppercase ml-1">cm</span></p>
                    <div className="flex gap-4 mt-4 pt-4 border-t border-white/20 text-[11px] font-black uppercase">
                      <span>{t.total}: {totalP.toFixed(1)}mm</span>
                      {calcRain > 0 && <span className="text-red-300 underline underline-offset-4 decoration-2">!! {t.rain}: {calcRain.toFixed(1)}mm</span>}
                    </div>
                  </div>

                  {/* TRI BOXA - SADA SVI IMAJU ISTI SHADOW-INNER EFEKAT */}
                  <div className="grid grid-cols-3 gap-3 mb-8 text-center">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex items-center justify-center shadow-inner">
                      <WeatherVisual code={resort.current?.weatherCode} />
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex flex-col items-center justify-center shadow-inner">
                      <Thermometer className="w-4 h-4 mb-1 text-slate-400 opacity-60" />
                      <span className="text-xl font-black">{resort.current?.temp ?? '--'}°</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] h-24 flex flex-col items-center justify-center shadow-inner">
                      <Navigation2 className="w-4 h-4 mb-1 text-blue-600 fill-blue-600" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)`, transition: '2s' }} />
                      <span className="text-lg font-black tracking-tighter">{resort.current?.windSpeed ?? '--'} <span className="text-[9px] opacity-30">m/s</span></span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedResort(resort)} className="mt-auto w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.2rem] hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-lg active:scale-95 italic">
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