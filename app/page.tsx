"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { balkanResorts } from '@/data/resorts';
import { getAllWeatherData } from '@/lib/weather';
import { 
  Snowflake, Map as MapIcon, Thermometer, Navigation, 
  Settings, Moon, Ruler, Camera, Mail, 
  Sun, CloudRain, CloudSnow, Cloud, Zap, CloudFog, 
  CloudMoon, Moon as MoonIcon, Droplets, Languages
} from 'lucide-react';
import { getStatus, FLAGS } from '@/constants/design';
import ThemeToggle from '@/components/ThemeToggle';

const BalkanMap = dynamic(() => import('@/components/BalkanMap'), { ssr: false });

const WeatherIcon = ({ code, isDay, className }: { code: number, isDay: number, className?: string }) => {
  const isNight = isDay === 0;
  if (code >= 71 && code <= 77) {
    if (code === 71) return <Snowflake className={`${className} opacity-60`} />;
    if (code === 73) return <CloudSnow className={className} />;
    return <div className="relative"><CloudSnow className={className} /><Snowflake className="absolute -bottom-1 -right-1 w-3 h-3 animate-bounce" /></div>;
  }
  if (code >= 51 && code <= 67) return <CloudRain className={className} />;
  if (code >= 1 && code <= 3) return isNight ? <CloudMoon className={className} /> : <Cloud className={className} />;
  if (code >= 95) return <Zap className={`${className} text-amber-500 animate-pulse`} />;
  if (code === 45 || code === 48) return <CloudFog className={className} />;
  return isNight ? <MoonIcon className={`${className} text-indigo-300`} /> : <Sun className={`${className} text-amber-400`} />;
};

export default function Home() {
  const [resorts, setResorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [unit, setUnit] = useState<'metric' | 'us'>('metric');
  const [mounted, setMounted] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAllWeatherData(balkanResorts);
        setResorts(balkanResorts.map((r, i) => ({ ...r, ...(data?.[i] || {}) })));
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  const t = {
    sr: {
      mapOpen: 'Interaktivna Mapa',
      mapClose: 'Zatvori Mapu',
      today: 'Danas',
      snowAmount: 'Količina očekivanog snega',
      rain: 'Kiša',
      currentStatus: 'Trenutni vremenski uslovi',
      units: 'Jedinice',
      language: 'Jezik',
      theme: 'Dark Mode'
    },
    en: {
      mapOpen: 'Interactive Map',
      mapClose: 'Close Map',
      today: 'Today',
      snowAmount: 'Expected Snowfall',
      rain: 'Rain',
      currentStatus: 'Current Weather Status',
      units: 'Units',
      language: 'Language',
      theme: 'Dark Mode'
    }
  }[lang];

  const getNextTenDays = () => {
    const daysSr = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'];
    const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthsSr = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'];
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const days = [];
    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({ 
        label: i === 0 ? t.today : (lang === 'sr' ? daysSr[d.getDay()] : daysEn[d.getDay()]), 
        date: d.getDate(), 
        month: lang === 'sr' ? monthsSr[d.getMonth()] : monthsEn[d.getMonth()],
        hours: (i + 1) * 24 
      });
    }
    return days;
  };

  const formatTemp = (celsius: number) => {
    if (unit === 'metric') return `${celsius.toFixed(0)}°C`;
    return `${((celsius * 9/5) + 32).toFixed(0)}°F`;
  };

  const formatWind = (kmh: number) => {
    if (unit === 'metric') return `${kmh.toFixed(0)} km/h`;
    return `${(kmh * 0.621371).toFixed(0)} mph`;
  };

  const formatRain = (mm: number) => {
    if (unit === 'metric') return `${mm.toFixed(1)} mm`;
    return `${(mm * 0.0393701).toFixed(2)} in`;
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-xl z-[60] px-8 py-4 border-b border-card-border flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Balkan<span className="text-blue-500">Freeride</span></h1>
        </Link>
        
        <div className="relative" ref={settingsRef}>
          <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 flex items-center justify-center bg-card border border-card-border hover:bg-card/80 transition-all shadow-sm">
            <Settings size={20} className={showSettings ? 'rotate-90 text-blue-500' : ''} />
          </button>
          
          {showSettings && (
            <div className="absolute right-0 mt-3 w-64 bg-card border border-card-border shadow-2xl p-4 z-[70] animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2 text-foreground/70"><Moon size={14} className="text-blue-500"/><span>{t.theme}</span></div>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2 text-foreground/70"><Languages size={14} className="text-blue-500"/><span>{t.language}</span></div>
                  <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />}
                    <span className="font-black text-foreground">{lang === 'sr' ? 'SRB' : 'ENG'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2 text-foreground/70"><Ruler size={14} className="text-blue-500"/><span>{t.units}</span></div>
                  <button onClick={() => setUnit(unit === 'metric' ? 'us' : 'metric')} className="text-foreground font-black hover:text-blue-500 transition-colors">
                    {unit === 'metric' ? 'METRIC' : 'IMPERIAL'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6">
        
        <div className="mt-6">
          <button onClick={() => setShowMap(!showMap)} className="w-full py-4 font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 border border-card-border bg-card hover:bg-card/80 transition-all shadow-sm">
            <MapIcon size={16} /> {showMap ? t.mapClose : t.mapOpen}
          </button>
        </div>

        {showMap && (
          <div className="mt-4 h-[450px] overflow-hidden border border-card-border bg-card shadow-2xl relative">
            <BalkanMap resorts={resorts} timeframe={timeframe} getStatus={getStatus} lang={lang} />
          </div>
        )}

        {/* TIMELINE SLIDER */}
        <div className="mt-6 bg-card/30 border border-card-border shadow-inner relative overflow-hidden">
            <div className="overflow-x-auto no-scrollbar p-1.5">
              <div className="flex md:grid md:grid-cols-10 gap-1.5 min-w-max md:min-w-full">
                {getNextTenDays().map((d) => (
                  <button 
                    key={d.hours} 
                    onClick={() => setTimeframe(d.hours)} 
                    className={`relative py-3 transition-all duration-300 flex flex-col items-center justify-center border-2 min-w-[80px] md:min-w-0 ${
                      timeframe === d.hours 
                      ? 'bg-blue-500 text-white border-transparent shadow-lg scale-[1.05] z-10' 
                      : 'bg-transparent border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase leading-none mb-1 tracking-tighter">{d.label}</span>
                    <span className="text-xl font-black leading-none tabular-nums">{d.date}</span>
                    <span className="text-[8px] font-bold uppercase opacity-30 mt-0.5">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* RESORTS GRID */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {!loading && resorts.map((resort) => {
            let totalSnow = 0;
            let totalRain = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              if (p > 0) {
                if (resort.hourly.temperature_2m[i] <= 1) totalSnow += p * 1.5;
                else totalRain += p;
              }
            });
            const s = getStatus(totalSnow);

            return (
              <div key={resort.id} className="group">
                <Link href={`/resort/${resort.id}`} className="p-7 block bg-card border border-card-border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 text-[8px] font-black uppercase text-white mb-5 shadow-lg" style={{ backgroundColor: s.color }}>
                    {s.icon} {s.txt}
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-tighter mb-5 group-hover:text-blue-500 transition-colors">{resort.name}</h3>
                  
                  {/* SNOW BOX */}
                  <div className="h-40 flex flex-col justify-center items-center text-white relative overflow-hidden mb-4 shadow-inner px-4 text-center transition-colors" style={{ backgroundColor: s.color }}>
                    <span className="text-[8px] font-black uppercase opacity-70 mb-2 tracking-widest text-white/90">{t.snowAmount}</span>
                    <div className="flex items-baseline gap-0.5 mb-2">
                      <span className="text-5xl font-black tracking-tighter tabular-nums">
                        {unit === 'metric' ? totalSnow.toFixed(0) : (totalSnow * 0.39).toFixed(1)}
                      </span>
                      <span className="text-sm font-black opacity-60 uppercase">{unit === 'metric' ? 'cm' : 'in'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-1.5 px-3 bg-black/10 border border-white/10 text-[9px] font-bold uppercase backdrop-blur-sm tabular-nums">
                      <Droplets size={12} /> {t.rain}: {formatRain(totalRain)}
                    </div>
                    <Snowflake className="absolute right-[-10px] bottom-[-10px] w-20 h-20 opacity-10 rotate-12" />
                  </div>

                  {/* CURRENT STATUS */}
                  <span className="text-[8px] font-black uppercase mb-2 opacity-50 block text-center tracking-tighter">{t.currentStatus}</span>
                  
                  {/* TRI BOXICA - FIXED ALIGNMENT & HOVER */}
                  <div className="grid grid-cols-3 gap-0 border border-card-border group-hover:border-blue-500 transition-colors overflow-hidden">
                    {/* ICON BOX */}
                    <div className="aspect-square bg-background flex items-center justify-center border-r border-card-border group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-colors">
                      <WeatherIcon code={resort.current?.weather_code} isDay={resort.current?.is_day} className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    {/* TEMPERATURE BOX */}
                    <div className="aspect-square bg-background flex flex-col items-center justify-center border-r border-card-border group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-colors">
                      <div className="flex flex-col items-center">
                        <Thermometer size={16} className="text-blue-500 mb-1" />
                        <span className="text-[11px] font-bold tabular-nums uppercase leading-none text-foreground">
                          {formatTemp(resort.current?.temperature_2m || 0)}
                        </span>
                      </div>
                    </div>

                    {/* WIND BOX */}
                    <div className="aspect-square bg-background flex flex-col items-center justify-center group-hover:bg-blue-500/5 transition-colors">
                      <div className="flex flex-col items-center">
                        <Navigation 
                          size={16} 
                          className="text-blue-500 mb-1" 
                          style={{ transform: `rotate(${resort.current?.wind_direction_10m || 0}deg)` }} 
                        />
                        <span className="text-[11px] font-bold tabular-nums uppercase leading-none text-foreground">
                          {formatWind(resort.current?.wind_speed_10m || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="mt-4 border-t border-card-border bg-card/40 py-12 px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground flex items-center justify-center text-background">
              <Snowflake size={20}/>
            </div>
            <span className="text-lg font-black uppercase italic tracking-tighter leading-none">BalkanFreeride</span>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 border border-card-border flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                <Camera size={18} />
            </div>
            <div className="w-12 h-12 border border-card-border flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all cursor-pointer">
                <Camera size={18} className="rotate-90 opacity-0 absolute" /> {/* Placeholder */}
                <Mail size={18} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}