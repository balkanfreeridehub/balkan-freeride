"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Navigation, Sun, CloudRain, CloudSnow, Cloud } from 'lucide-react';
import { FLAGS, getStatus } from '@/constants/design';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
  switch (condition?.toLowerCase()) {
    case 'snow': return <CloudSnow className={className} />;
    case 'rain': return <CloudRain className={className} />;
    case 'cloudy': return <Cloud className={className} />;
    default: return <Sun className={className} />;
  }
};

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAllWeatherData(balkanResorts);
        setResorts(balkanResorts.map((r, i) => ({ ...r, ...data[i] })));
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const getSliderLabel = (v: number) => {
    if (v === 6) return '6h';
    if (v === 12) return '12h';
    if (v === 24) return '24h';
    if (v === 48) return lang === 'sr' ? '2 Dana' : '2 Days';
    if (v === 72) return lang === 'sr' ? '3 Dana' : '3 Days';
    if (v === 120) return lang === 'sr' ? '5 Dana' : '5 Days';
    if (v === 168) return lang === 'sr' ? '7 Dana' : '7 Days';
    if (v === 240) return lang === 'sr' ? '10 Dana' : '10 Days';
    return `${v}h`;
  };

  const t = {
    sr: { 
      map: "Prikaži Mapu", 
      close: "Zatvori Mapu", 
      snow: "Očekivani Sneg", 
      precip: "Očekivane padavine", 
      rain: "Količina kiše" 
    },
    en: { 
      map: "Show Map", 
      close: "Close Map", 
      snow: "Expected Snow", 
      precip: "Expected precipitation", 
      rain: "Amount of rain" 
    }
  }[lang];

  return (
    <div className="min-h-screen transition-colors bg-white dark:bg-[#020617] text-black dark:text-white">
      <nav className="sticky top-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter transition-none">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        </Link>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="hover:scale-110 transition-transform">
            {lang === 'sr' ? <FLAGS.USA /> : <FLAGS.SRB />}
          </button>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6">
        <div className="mt-8">
          <button 
            onClick={() => setShowMap(!showMap)} 
            className={`w-full py-5 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all border ${showMap ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'}`}
          >
            <MapIcon size={18} /> {showMap ? t.close : t.map}
          </button>
        </div>

        {showMap && (
          <div className="mt-4 h-[550px] rounded-[3.5rem] overflow-hidden border border-black/10 dark:border-white/10 relative shadow-2xl bg-slate-50 dark:bg-black/20">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} lang={lang} />
          </div>
        )}

        <div className="mt-8">
          <div className="w-full bg-slate-100/50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[3rem] p-2">
            <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar md:grid md:grid-cols-8">
              {[6, 12, 24, 48, 72, 120, 168, 240].map(v => (
                <button 
                  key={v} 
                  onClick={() => setTimeframe(v)} 
                  className={`flex-1 min-w-[110px] py-6 rounded-[2.5rem] text-[12px] font-black uppercase transition-all whitespace-nowrap ${timeframe === v ? 'bg-[#3b82f6] text-white shadow-2xl scale-[1.02]' : 'opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {getSliderLabel(v)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          {!loading && resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <Link 
                key={resort.id} 
                href={`/resort/${resort.id}`} 
                className="p-8 rounded-[3.5rem] block bg-white dark:bg-[#0f172a] border border-black/[0.04] dark:border-white/[0.04] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white mb-6" style={{ backgroundColor: s.color }}>
                  {s.icon} {s.txt}
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-1 leading-none group-hover:text-[#3b82f6] transition-colors">{resort.name}</h3>
                <p className="text-[9px] font-bold uppercase opacity-30 mb-6 tracking-widest">{resort.country}</p>
                
                <div className="h-40 rounded-[3rem] flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner" style={{ backgroundColor: s.color }}>
                   <div className="flex flex-col items-center z-10 scale-90">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-1">{t.snow}</span>
                      <div className="flex items-baseline gap-1 leading-none text-white">
                        <span className="text-6xl font-black tracking-tighter tabular-nums">{snow.toFixed(0)}</span>
                        <span className="text-lg font-black opacity-60 uppercase ml-1">cm</span>
                      </div>
                   </div>
                   <Snowflake className="absolute right-[-10px] bottom-[-10px] w-20 h-20 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                </div>

                <div className="mb-8 px-1">
                  <table className="w-full text-[10px] font-black uppercase tracking-widest">
                    <tbody>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="py-3 text-left opacity-30 leading-tight pr-4">{t.precip}</td>
                        <td className="py-3 text-right whitespace-nowrap">{prec.toFixed(1)}mm</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-left opacity-30 leading-tight pr-4">{t.rain}</td>
                        <td className="py-3 text-right font-black whitespace-nowrap">{rain.toFixed(1)}mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex items-center justify-center border border-black/[0.03] dark:border-white/5 group-hover:border-[#3b82f6]/20 transition-colors">
                      <WeatherIcon condition={resort.condition || 'clear'} className="w-7 h-7 text-[#3b82f6]" />
                  </div>
                  <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5 gap-1">
                      <Thermometer size={18} className="text-[#3b82f6]" />
                      <span className="text-sm font-black tabular-nums">{resort.current?.temperature_2m.toFixed(0)}°C</span>
                  </div>
                  <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-3xl flex flex-col items-center justify-center border border-black/[0.03] dark:border-white/5 gap-1">
                      <Navigation size={18} fill="currentColor" className="text-[#3b82f6]" style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} />
                      <span className="text-sm font-black tabular-nums">{resort.current?.wind_speed_10m.toFixed(0)}<span className="text-[8px] ml-0.5 opacity-50">km/h</span></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}