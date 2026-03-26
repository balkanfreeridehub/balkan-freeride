"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { Snowflake, Map as MapIcon, Thermometer, Navigation, Sun, Moon, CloudRain, CloudSnow, Cloud, Info } from 'lucide-react';
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
  const { theme } = useTheme();

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

  // Tekstovi za prevod
  const t = {
    sr: { map: "Mapa", close: "Zatvori", day: "Dan", snow: "Očekivani Sneg", precip: "Total Precipitation", rain: "Possible Rain", forecast: "Detaljna Prognoza" },
    en: { map: "Map", close: "Close", day: "Day", snow: "Expected Snow", precip: "Total Precipitation", rain: "Possible Rain", forecast: "Full Forecast" }
  }[lang];

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3b82f6] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter dark:text-white">Balkan<span className="text-[#3b82f6]">Freeride</span></h1>
        </Link>
        
        <div className="flex items-center gap-6">
          {/* Dark Mode Ikona Fix */}
          <div className="flex items-center gap-2 text-[#3b82f6]">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            <ThemeToggle />
          </div>
          
          <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="hover:scale-110 transition-transform">
            {lang === 'sr' ? <FLAGS.USA /> : <FLAGS.SRB />}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-8 py-5 resort-card rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-2 dark:text-white">
          <MapIcon size={20} /> {showMap ? t.close + ' ' + t.map : t.map}
        </button>

        {showMap && (
          <div className="h-[600px] mb-12 rounded-[3.5rem] overflow-hidden border border-black/10 dark:border-white/10 relative shadow-2xl bg-slate-50 dark:bg-black/20">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} lang={lang} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {!loading && resorts.map((resort) => {
            let snow = 0; let prec = 0; let rain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              prec += p;
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              else if (p > 0) rain += p;
            });
            const s = getStatus(snow);

            return (
              <Link key={resort.id} href={`/resort/${resort.id}`} className="resort-card p-8 rounded-[4rem] block bg-white dark:bg-[#0f172a] shadow-xl hover:-translate-y-2 transition-all duration-500">
                {/* 1. Kategorija */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-4 shadow-md" style={{ backgroundColor: s.color }}>
                  {s.icon} {s.txt}
                </div>
                {/* 2. Ime i 3. Država */}
                <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white transition-none mb-1">{resort.name}</h3>
                <p className="text-[10px] font-bold uppercase opacity-30 dark:text-white mb-6 italic tracking-widest">{resort.country || 'Balkan'}</p>
                
                {/* Snow Box - Poboljšan vizual */}
                <div className="h-40 rounded-[3rem] flex flex-col justify-center items-center text-white relative overflow-hidden mb-8 shadow-inner" style={{ backgroundColor: s.color }}>
                   <div className="flex flex-col items-center mt-[-5px]">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{t.snow}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-7xl font-black tracking-tighter tabular-nums">{snow.toFixed(0)}</span>
                        <span className="text-xl font-black opacity-40 uppercase italic ml-1">cm</span>
                      </div>
                   </div>
                   <Snowflake className="absolute right-[-10px] bottom-[-10px] w-24 h-24 opacity-10 rotate-12" />
                </div>

                {/* Tabela Padavina - Crni tekst */}
                <div className="mb-8 px-2">
                  <table className="w-full text-[11px] font-black uppercase tracking-widest text-black dark:text-white">
                    <tbody>
                      <tr className="border-b border-black/5 dark:border-white/5">
                        <td className="py-3 text-left opacity-30 italic">{t.precip}</td>
                        <td className="py-3 text-right italic">{prec.toFixed(1)}mm</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-left opacity-30 italic">{t.rain}</td>
                        <td className="py-3 text-right italic">{rain.toFixed(1)}mm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tri Boxića - Poravnati i ojačani */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-[2.2rem] flex items-center justify-center border border-black/[0.05] dark:border-white/10">
                      <WeatherIcon condition={resort.condition || 'clear'} className="w-9 h-9 text-[#3b82f6]" />
                  </div>
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-[2.2rem] flex flex-col items-center justify-center border border-black/[0.05] dark:border-white/10 gap-2">
                      <Thermometer size={22} className="text-[#3b82f6]" />
                      <span className="text-xl font-black tabular-nums leading-none dark:text-white">{resort.current?.temperature_2m.toFixed(0)}°C</span>
                  </div>
                  <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-[2.2rem] flex flex-col items-center justify-center border border-black/[0.05] dark:border-white/10 gap-2">
                      <Navigation size={22} fill="currentColor" className="text-[#3b82f6]" style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} />
                      <span className="text-xl font-black tabular-nums leading-none dark:text-white">{resort.current?.wind_speed_10m.toFixed(0)}<span className="text-[8px] ml-0.5">km/h</span></span>
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