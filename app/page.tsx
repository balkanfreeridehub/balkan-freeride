"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import LiveCamModal from '../components/LiveCamModal';
import { 
  Sun, Moon, Cloud, CloudSnow, CloudRain, Thermometer, Navigation2, 
  CloudFog, CloudLightning, Zap, Snowflake, Skull, CircleSlash, Rocket, Droplets, AlertTriangle
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

const timeOptions = [
  { label: '6h', value: 6 }, { label: '12h', value: 12 }, { label: '1d', value: 24 },
  { label: '3d', value: 72 }, { label: '7d', value: 168 }, { label: '10d', value: 240 }
];

const WeatherVisual = ({ code }: { code?: number }) => {
  if (code === undefined) return <CloudFog className="w-8 h-8 opacity-20" />;
  const hour = new Date().getHours();
  const isNight = hour >= 19 || hour < 6;
  const className = "w-8 h-8 text-slate-800 dark:text-white"; 
  if (code >= 71 && code <= 86) return <CloudSnow className={className} />;
  if (code >= 51 && code <= 67) return <CloudRain className={className} />;
  if (code === 1 || code === 2) return isNight ? <Moon className={className} /> : <Cloud className={className} />;
  return isNight ? <Moon className={className} /> : <Sun className={className} />;
};

export default function Home() {
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [selectedResort, setSelectedResort] = useState<any>(null);
  const [timeframe, setTimeframe] = useState(24);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // UKLONJEN TIMEFRAME IZ DEPENDENCY-JA: Učitava se samo jednom na startu!
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(false);
        const data = await Promise.all(balkanResorts.map(async (r) => {
          const w = await getWeatherData(r.lat, r.lon);
          return { ...r, ...w };
        }));
        setResorts(data);
      } catch (err) {
        console.error("API Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []); // PRAZAN NIZ - Zovemo API samo jednom

  const getStatus = (snow: number) => {
    if (snow >= 100) return { cls: 'bg-purple-600', txt: 'JAPAN STYLE', icon: <Rocket className="w-3.5 h-3.5" /> };
    if (snow >= 50) return { cls: 'bg-slate-900', txt: 'EXTREME POWDER', icon: <Skull className="w-3.5 h-3.5" /> };
    if (snow >= 30) return { cls: 'bg-green-500', txt: 'POWDER ALERT', icon: <Snowflake className="w-3.5 h-3.5" /> };
    if (snow >= 10) return { cls: 'bg-yellow-400 text-black', txt: 'RIDEABLE', icon: <Zap className="w-3.5 h-3.5" /> };
    return { cls: 'bg-red-500 text-white', txt: 'SKIP', icon: <CircleSlash className="w-3.5 h-3.5" /> };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans">
      <nav className="border-b dark:border-white/10 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md z-50 px-6">
        <div className="max-w-7xl mx-auto h-20 flex justify-between items-center">
          <h1 className="text-xl font-black uppercase tracking-tighter">
            Balkan <span className="text-blue-600 italic">Freeride</span> Hub
          </h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-md border dark:border-white/10 italic uppercase">
              {lang === 'sr' ? 'srb' : 'eng'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="rounded-[2.5rem] overflow-hidden border dark:border-white/10 mb-8 shadow-2xl h-[480px] bg-slate-50 dark:bg-slate-900/30">
          <BalkanMap resorts={resorts} timeframe={timeframe} />
        </div>

        {/* Dugmići za Timeframe sada rade INSTANT jer ne okidaju API poziv */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit mx-auto border dark:border-white/10">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${timeframe === opt.value ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-blue-500'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-10 p-6 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 rounded-3xl flex items-center gap-4 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
            <p className="font-bold uppercase text-xs tracking-widest">Došlo je do greške pri učitavanju. Osveži stranu.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20 font-black uppercase opacity-20 animate-pulse tracking-widest italic text-xl">
              Skeniranje Balkana...
            </div>
          ) : (
            resorts.map((resort) => {
              let calcSnow = 0, calcRain = 0, totalP = 0;
              
              if (resort.hourly) {
                // Kalkulacija se dešava u svakom renderu na osnovu timeframe-a, ali bez čekanja API-ja
                for (let i = 0; i < timeframe; i++) {
                  const t = resort.hourly.temperature_2m[i];
                  const p = resort.hourly.precipitation[i] || 0;
                  if (p > 0) {
                    totalP += p;
                    if (t <= -5) calcSnow += p * 1.5;
                    else if (t <= 0) calcSnow += p * 1.0;
                    else if (t <= 2) calcSnow += p * 0.5;
                    else calcRain += p;
                  }
                }
              }
              
              const s = getStatus(calcSnow);

              return (
                <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-7 rounded-[3.5rem] flex flex-col h-full hover:shadow-xl transition-all">
                  <div className="h-24 mb-4">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase mb-4 ${s.cls} text-white ${s.txt === 'RIDEABLE' ? 'text-black' : ''}`}>
                      {s.icon} {s.txt}
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">{resort.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{resort.country}</p>
                  </div>

                  <div className="h-44 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30 mb-8 flex flex-col justify-center transition-all duration-300">
                    <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Sneg (+{timeframe < 24 ? timeframe + 'h' : timeframe/24 + (timeframe === 24 ? ' dan' : ' dana')})</p>
                    <p className="text-6xl font-black italic tracking-tighter">+{calcSnow.toFixed(1)} <span className="text-2xl font-normal opacity-40 uppercase ml-1">cm</span></p>
                    
                    <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-[10px] font-black uppercase tracking-tighter opacity-70">
                      <div className="flex items-center gap-1.5"><Droplets className="w-3 h-3 text-blue-200" /> {totalP.toFixed(1)}mm</div>
                      {calcRain > 0 && <div className="text-red-200">Kiša: {calcRain.toFixed(1)}mm</div>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-10 text-center">
                    <div className="bg-white dark:bg-white/5 rounded-[2rem] border dark:border-white/5 h-24 flex items-center justify-center shadow-sm">
                      <WeatherVisual code={resort.current?.weatherCode} />
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-[2rem] border dark:border-white/5 h-24 flex flex-col items-center justify-center">
                      <Thermometer className="w-4 h-4 mb-1 text-slate-300" />
                      <span className="text-xl font-bold">{resort.current?.temp ?? '--'}°</span>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-[2rem] border dark:border-white/5 h-24 flex flex-col items-center justify-center">
                      <Navigation2 className="w-4 h-4 mb-1 text-blue-600 fill-blue-600" style={{ transform: `rotate(${resort.current?.windDir ?? 0}deg)`, transition: '2s' }} />
                      <span className="text-xl font-bold tracking-tighter">{resort.current?.windSpeed ?? '--'}<span className="text-[9px] font-normal opacity-30 ml-0.5 uppercase">m/s</span></span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedResort(resort)} className="mt-auto w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl hover:bg-blue-600 transition-all italic">
                    UŽIVO KAMERE
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