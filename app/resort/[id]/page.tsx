"use client"
import React, { useState, useEffect, use as useReact } from 'react';
import Link from 'next/link';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { 
  Snowflake, Thermometer, Navigation, Droplets, 
  Wind, Sunrise, Sunset, ChevronLeft, Calendar, 
  MapPin, Activity, Zap, Star, ShieldAlert, UserCheck, Hotel, Clock, Gauge, Settings, Moon, Languages, Ruler, Cloud
} from 'lucide-react';
import { getStatus, FLAGS } from '@/constants/design';
import ThemeToggle from '@/components/ThemeToggle';

export default function ResortPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useReact(params);
  const id = resolvedParams?.id;

  const [data, setData] = useState<any>(null);
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [unit, setUnit] = useState<'metric' | 'us'>('metric');

  useEffect(() => {
    if (id) {
      const decodedId = decodeURIComponent(id as string);
      const found = balkanResorts.find(r => r.id === decodedId);
      if (found) {
        setResort(found);
        getWeatherData(found.lat, found.lon).then(setData).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [id]);

  if (loading || !resort) return (
    <div className="h-screen bg-background flex items-center justify-center">
      <Snowflake className="animate-spin text-blue-500 w-12 h-12 opacity-20" />
    </div>
  );

  // DATA MAPS
  const temp = data?.current?.temperature_2m ?? 0;
  const windSpeed = data?.current?.wind_speed_10m ?? 0;
  const windDir = data?.current?.wind_direction_10m ?? 0;
  const humidity = data?.current?.relative_humidity_2m ?? 0;
  const pressure = data?.current?.surface_pressure ?? 1013;
  const clouds = data?.current?.cloud_cover ?? 0;
  const precipArray = data?.hourly?.precipitation || [];
  
  const totalSnow24h = (precipArray.slice(0, 24).reduce((acc: number, curr: number) => acc + curr, 0) || 0) * 1.5;
  const s = getStatus(totalSnow24h);

  const t = {
    sr: { back: "Nazad", live: "Live Senzor", evolution: "24h Evolucija", theme: "Tema", lang: "Jezik", units: "Jedinice", forecast: "10-Dana Prognoza" },
    en: { back: "Back", live: "Live Sensor", evolution: "24h Evolution", theme: "Theme", lang: "Language", units: "Units", forecast: "10-Day Forecast" }
  }[lang];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans">
      
      {/* HEADER (Identical to Home) */}
      <nav className="sticky top-0 bg-background/90 backdrop-blur-md z-[100] px-8 py-5 border-b border-card-border flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Balkan<span className="text-blue-500">Freeride</span></h1>
        </Link>
        
        <div className="relative">
          <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 flex items-center justify-center bg-card border border-card-border hover:bg-card/80 transition-all">
            <Settings size={20} className={showSettings ? 'rotate-90 text-blue-500' : ''} />
          </button>
          {showSettings && (
            <div className="absolute right-0 mt-3 w-64 bg-card border border-card-border shadow-2xl p-4 z-[110] animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2 text-foreground/70"><Moon size={14} className="text-blue-500"/><span>{t.theme}</span></div>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2 text-foreground/70"><Languages size={14} className="text-blue-500"/><span>{t.lang}</span></div>
                  <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="font-black flex items-center gap-2 uppercase tracking-tighter">
                    {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />} {lang === 'sr' ? 'SRB' : 'ENG'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <div className="flex items-center gap-2 text-foreground/70"><Ruler size={14} className="text-blue-500"/><span>{t.units}</span></div>
                  <button onClick={() => setUnit(unit === 'metric' ? 'us' : 'metric')} className="font-black uppercase tracking-tighter">{unit === 'metric' ? 'Metric' : 'Imperial'}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 space-y-4 pt-6 pb-20">

        {/* 1. HERO & LIVE DATA BAR */}
        <section className="bg-card border border-card-border relative overflow-hidden">
          <div className="p-10 md:p-14 border-b border-card-border">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 mb-10 hover:opacity-70 transition-opacity tracking-[0.2em]">
              <ChevronLeft size={14} /> {t.back}
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">{t.live} / {resort.country}</span>
                </div>
                <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8] mb-2">
                  {resort.name}
                </h2>
                <p className="text-blue-500 font-black uppercase text-sm tracking-[0.3em] italic">{totalSnow24h > 15 ? 'Massive Loading' : 'Prime Session'}</p>
              </div>

              <div className="flex flex-col items-start lg:items-end">
                 <span className="text-[10px] font-black uppercase opacity-30 mb-2 tracking-widest text-right">Avalanche Danger</span>
                 <div className="px-8 py-4 bg-foreground text-background text-xs font-black uppercase tracking-[0.3em]">
                   {s.txt}
                 </div>
              </div>
            </div>
          </div>

          {/* INTEGRISANI LIVE BAR */}
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-card-border bg-background/50 border-t border-card-border">
            <div className="p-8 flex flex-col items-center justify-center gap-2">
              <Thermometer className="text-blue-500 mb-1" size={20} />
              <span className="text-4xl font-black tabular-nums">
                {unit === 'metric' ? `${temp.toFixed(1)}°` : `${((temp * 9/5) + 32).toFixed(1)}°`}
              </span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">Air Temp</span>
            </div>
            
            <div className="p-8 flex flex-col items-center justify-center gap-2 bg-blue-500/5">
              <div className="relative mb-1">
                <Navigation className="text-blue-500 transition-transform duration-1000" size={28} style={{ transform: `rotate(${windDir}deg)` }} />
              </div>
              <span className="text-3xl font-black tabular-nums tracking-tighter uppercase italic">
                {unit === 'metric' ? `${windSpeed.toFixed(0)}` : `${(windSpeed * 0.621).toFixed(0)}`}
                <span className="text-[10px] ml-1 opacity-40">{unit === 'metric' ? 'kmh' : 'mph'}</span>
              </span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest italic">{windDir}° NW</span>
            </div>

            <div className="p-8 flex flex-col items-center justify-center gap-2">
              <Cloud className="text-blue-500 mb-1" size={20} />
              <span className="text-4xl font-black tabular-nums">{clouds}%</span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">Clouds</span>
            </div>

            <div className="p-8 flex flex-col items-center justify-center gap-2">
              <Droplets className="text-blue-500 mb-1" size={20} />
              <span className="text-4xl font-black tabular-nums">{humidity}<span className="text-xs">%</span></span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">Humidity</span>
            </div>

            <div className="p-8 flex flex-col items-center justify-center gap-2 hidden md:flex">
              <Gauge className="text-blue-500 mb-1" size={20} />
              <span className="text-2xl font-black tabular-nums">{pressure.toFixed(0)}</span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">hPa Pressure</span>
            </div>
          </div>
          <Snowflake className="absolute right-[-5%] top-[-5%] w-[400px] h-[400px] opacity-[0.02] rotate-12 pointer-events-none" />
        </section>

        {/* 2. 24H HORIZONTAL TIMELINE */}
        <section className="bg-card border border-card-border p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 opacity-40 italic">
              <Clock size={16} className="text-blue-500" /> {t.evolution}
            </h3>
            <span className="text-[8px] font-black uppercase opacity-20 tracking-widest italic tracking-tighter">Slide to explore 24h timeline</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {precipArray.slice(0, 24).map((p: number, i: number) => {
              const hour = new Date(data.hourly.time[i]).getHours();
              const hTemp = data.hourly.temperature_2m[i] ?? 0;
              return (
                <div key={i} className="min-w-[110px] p-6 bg-background border border-card-border flex flex-col items-center gap-3 hover:border-blue-500 transition-colors cursor-crosshair">
                  <span className="text-[10px] font-black opacity-30">{hour}:00</span>
                  <Snowflake size={18} className={p > 0 ? "text-blue-500" : "opacity-10"} />
                  <span className="text-lg font-black italic">
                    {unit === 'metric' ? hTemp.toFixed(0) : ((hTemp * 9/5) + 32).toFixed(0)}°
                  </span>
                  <div className="w-full h-1 bg-card-border mt-2 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(p * 25, 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-blue-500">
                    {p > 0 ? `${(p * (unit === 'metric' ? 1.5 : 0.6)).toFixed(1)}${unit === 'metric' ? 'cm' : 'in'}` : '0'}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. 10-DAY GRID */}
        <section className="space-y-4">
          <h3 className="font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 opacity-40 italic">
            <Calendar size={16} className="text-blue-500" /> {t.forecast}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
            {Array.from({length: 10}).map((_, i) => {
              const daySnow = precipArray.slice(i*24, (i+1)*24).reduce((a:number, b:number) => a + b, 0) * 1.4;
              const isEpic = daySnow >= 20;
              const isGood = daySnow >= 8 && daySnow < 20;
              
              return (
                <div key={i} className={`p-8 border flex flex-col items-center justify-center transition-all
                  ${isEpic ? 'bg-[#8b57ff] border-transparent text-white shadow-[0_0_40px_rgba(139,87,255,0.2)] z-10 scale-105' : 
                    isGood ? 'bg-blue-600 border-transparent text-white' : 
                    'bg-card border-card-border opacity-50 hover:opacity-100'}`}>
                  <span className="text-[8px] font-black uppercase opacity-60 mb-4 tracking-tighter">D{i+1}</span>
                  <span className="text-4xl font-black tabular-nums tracking-tighter italic">
                    {unit === 'metric' ? daySnow.toFixed(0) : (daySnow * 0.39).toFixed(1)}
                  </span>
                  <span className="text-[9px] font-black uppercase opacity-40 mt-1 tracking-widest">{unit === 'metric' ? 'cm' : 'in'}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. PRO GEAR & EMERGENCY */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="lg:col-span-2 bg-foreground text-background p-10 flex flex-col justify-between relative overflow-hidden">
              <h4 className="text-4xl font-black uppercase tracking-tighter leading-none italic relative z-10">Pro Gear <br/> Demo Center</h4>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-4 relative z-10 italic">Test latest splitboards</p>
              <Star size={100} className="absolute right-[-20px] bottom-[-20px] opacity-10" fill="currentColor" />
           </div>
           
           <div className="bg-[#8b57ff] text-white p-10 flex flex-col justify-between group cursor-pointer overflow-hidden border border-transparent hover:border-white/20 transition-all">
              <Zap size={32} fill="white" className="mb-6 group-hover:scale-110 transition-transform" />
              <h5 className="text-xl font-black uppercase tracking-tighter italic leading-none">Ratrac Taxi <br/> Peak Drop</h5>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-2">Active Booking</span>
           </div>

           <div className="bg-red-600 text-white p-10 flex flex-col justify-between shadow-2xl shadow-red-600/20">
              <ShieldAlert size={32} className="mb-6" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1 italic">Rescue GSS</span>
                <span className="text-6xl font-black tabular-nums tracking-tighter italic leading-none">1212</span>
              </div>
           </div>
        </section>

      </main>

      {/* FOOTER (Identical to Home) */}
      <footer className="border-t border-card-border bg-card/30 pt-16 pb-8 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500 flex items-center justify-center text-white">
                  <Snowflake size={18}/>
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">Balkan<span className="text-blue-500">Freeride</span></h2>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 leading-relaxed italic">
                Prva regionalna platforma za freeride inteligenciju. 
                Svi podaci su generisani u realnom vremenu putem Open-Meteo senzora.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Info</span>
                <Link href="/" className="text-[10px] font-black uppercase hover:text-blue-500 transition-colors tracking-widest">O Projektu</Link>
                <Link href="/" className="text-[10px] font-black uppercase hover:text-blue-500 transition-colors tracking-widest italic">GSS Kontakti</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Social</span>
                <Link href="/" className="text-[10px] font-black uppercase hover:text-blue-500 transition-colors tracking-widest">Instagram</Link>
                <Link href="/" className="text-[10px] font-black uppercase hover:text-blue-500 transition-colors tracking-widest">Strava</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-card-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase tracking-[0.5em] opacity-30">
            <span>© 2026 BalkanFreeride — Engineered for the peaks</span>
            <div className="flex gap-8 italic">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}