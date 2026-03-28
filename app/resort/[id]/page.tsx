"use client"
import React, { useState, useEffect, use as useReact } from 'react';
import Link from 'next/link';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { 
  Snowflake, Thermometer, Navigation, Droplets, 
  Wind, Sunrise, Sunset, ChevronLeft, Calendar, 
  MapPin, Activity, Zap, Star, ShieldAlert, UserCheck, Hotel, Clock, Gauge, Settings, Moon, Languages, Ruler, Eye
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

  const temp = data?.current?.temperature_2m ?? 0;
  const windSpeed = data?.current?.wind_speed_10m ?? 0;
  const windDir = data?.current?.wind_direction_10m ?? 0;
  const humidity = data?.current?.relative_humidity_2m ?? 0;
  const pressure = data?.current?.surface_pressure ?? 1013;
  const visibility = (data?.current?.visibility ?? 10000) / 1000; // u km
  const precipArray = data?.hourly?.precipitation || [];
  
  const totalSnow24h = (precipArray.slice(0, 24).reduce((acc: number, curr: number) => acc + curr, 0) || 0) * 1.5;
  const s = getStatus(totalSnow24h);

  const t = {
    sr: { 
      back: "Nazad", live: "Senzorski Podaci", evolution: "24h Evolucija", theme: "Tema", 
      lang: "Jezik", units: "Jedinice", forecast: "10-Dnevna Prognoza", 
      slide: "Prevucite za pregled", wind: "Vetar", vis: "Vidljivost", hum: "Vlažnost", press: "Pritisak"
    },
    en: { 
      back: "Back", live: "Sensor Data", evolution: "24h Evolution", theme: "Theme", 
      lang: "Language", units: "Units", forecast: "10-Day Forecast", 
      slide: "Slide to explore", wind: "Wind", vis: "Visibility", hum: "Humidity", press: "Pressure"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 font-sans overflow-x-hidden">
      
      {/* HEADER */}
      <nav className="sticky top-0 bg-background/90 backdrop-blur-md z-[100] px-6 md:px-8 py-5 border-b border-card-border flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-blue-500 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">Balkan<span className="text-blue-500">Freeride</span></h1>
        </Link>
        <button onClick={() => setShowSettings(!showSettings)} className="w-10 h-10 flex items-center justify-center bg-card border border-card-border">
          <Settings size={20} className={showSettings ? 'rotate-90 text-blue-500' : ''} />
        </button>
        {showSettings && (
          <div className="absolute right-6 top-full mt-2 w-64 bg-card border border-card-border shadow-2xl p-4 z-[110]">
             <div className="space-y-1.5">
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <span className="opacity-50">{t.theme}</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <span className="opacity-50">{t.lang}</span>
                  <button onClick={() => setLang(lang === 'sr' ? 'en' : 'sr')} className="font-black flex items-center gap-2">
                    {lang === 'sr' ? <FLAGS.SRB /> : <FLAGS.USA />} {lang === 'sr' ? 'SRB' : 'ENG'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 text-[10px] font-bold uppercase">
                  <span className="opacity-50">{t.units}</span>
                  <button onClick={() => setUnit(unit === 'metric' ? 'us' : 'metric')} className="font-black uppercase">{unit === 'metric' ? 'Metric' : 'Imperial'}</button>
                </div>
              </div>
          </div>
        )}
      </nav>

      <main className="max-w-[1440px] mx-auto px-4 md:px-6 space-y-4 pt-6 pb-20">

        {/* 1. HERO - POPRAVLJEN NASLOV */}
        <section className="bg-card border border-card-border relative overflow-hidden">
          <div className="p-8 md:p-14 border-b border-card-border">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 mb-6 hover:opacity-70 tracking-widest">
              <ChevronLeft size={14} /> {t.back}
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">{t.live} / {resort.country}</span>
                </div>
                {/* Responsive font size: ogroman na desktopu, manji na mobilnom */}
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-[0.9] break-words">
                  {resort.name}
                </h2>
              </div>

              <div className="flex flex-col items-start lg:items-end shrink-0">
                 <span className="text-[9px] font-black uppercase opacity-30 mb-2 tracking-widest text-right">Lavinost</span>
                 <div className="px-6 py-3 md:px-8 md:py-4 bg-foreground text-background text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                   {s.txt}
                 </div>
              </div>
            </div>
          </div>

          {/* LIVE BAR - UJEDNAČENA POZADINA */}
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-card-border bg-background/20">
            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-1 border-b md:border-b-0 border-card-border">
              <Thermometer className="text-blue-500 mb-1" size={18} />
              <span className="text-3xl md:text-4xl font-black tabular-nums">
                {unit === 'metric' ? `${temp.toFixed(1)}°` : `${((temp * 9/5) + 32).toFixed(1)}°`}
              </span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest leading-none">Temp</span>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-1 border-b md:border-b-0 border-card-border">
              <Navigation className="text-blue-500 mb-1 transition-transform" size={24} style={{ transform: `rotate(${windDir}deg)` }} />
              <span className="text-2xl md:text-3xl font-black tabular-nums tracking-tighter italic leading-none">
                {unit === 'metric' ? `${windSpeed.toFixed(0)}` : `${(windSpeed * 0.621).toFixed(0)}`}
                <span className="text-[10px] ml-1">{unit === 'metric' ? 'kmh' : 'mph'}</span>
              </span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest italic">{t.wind}</span>
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-1 border-b border-card-border md:border-b-0">
              <Eye className="text-blue-500 mb-1" size={18} />
              <span className="text-3xl md:text-4xl font-black tabular-nums">{visibility.toFixed(0)}<span className="text-xs ml-1">km</span></span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">{t.vis}</span>
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-1 border-b border-card-border md:border-b-0">
              <Droplets className="text-blue-500 mb-1" size={18} />
              <span className="text-3xl md:text-4xl font-black tabular-nums">{humidity}%</span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">{t.hum}</span>
            </div>

            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-1 hidden md:flex">
              <Gauge className="text-blue-500 mb-1" size={18} />
              <span className="text-2xl font-black tabular-nums">{pressure.toFixed(0)}</span>
              <span className="text-[9px] font-black uppercase opacity-30 tracking-widest">{t.press}</span>
            </div>
          </div>
          <Snowflake className="absolute right-[-5%] top-[-5%] w-[400px] h-[400px] opacity-[0.02] rotate-12 pointer-events-none" />
        </section>

        {/* 2. 24H EVOLUTION */}
        <section className="bg-card border border-card-border p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 opacity-40 italic">
              <Clock size={16} className="text-blue-500" /> {t.evolution}
            </h3>
            <span className="text-[8px] font-black uppercase opacity-20 tracking-tighter">{t.slide} →</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {precipArray.slice(0, 24).map((p: number, i: number) => {
              const hour = new Date(data.hourly.time[i]).getHours();
              const hTemp = data.hourly.temperature_2m[i] ?? 0;
              return (
                <div key={i} className="min-w-[110px] p-6 bg-background border border-card-border flex flex-col items-center gap-3 hover:border-blue-500 transition-colors">
                  <span className="text-[10px] font-black opacity-30">{hour}:00</span>
                  <Snowflake size={18} className={p > 0 ? "text-blue-500" : "opacity-10"} />
                  <span className="text-lg font-black italic">{unit === 'metric' ? hTemp.toFixed(0) : ((hTemp * 9/5) + 32).toFixed(0)}°</span>
                  <div className="w-full h-1 bg-card-border mt-1 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${Math.min(p * 25, 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-blue-500">{p > 0 ? `${(p * 1.5).toFixed(1)}cm` : '0'}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. 10-DAY GRID - FIX ZA MOBILNI */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
             <h3 className="font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 opacity-40 italic">
              <Calendar size={16} className="text-blue-500" /> {t.forecast}
            </h3>
            <span className="text-[8px] font-black uppercase opacity-20 md:hidden">{t.slide} →</span>
          </div>
          <div className="flex md:grid md:grid-cols-5 lg:grid-cols-10 gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
            {Array.from({length: 10}).map((_, i) => {
              const daySnow = (precipArray.slice(i*24, (i+1)*24).reduce((a:number, b:number) => a + b, 0) || 0) * 1.4;
              const isEpic = daySnow >= 20;
              const isGood = daySnow >= 8 && daySnow < 20;
              
              return (
                <div key={i} className={`min-w-[120px] md:min-w-0 p-8 border flex flex-col items-center justify-center transition-all
                  ${isEpic ? 'bg-[#8b57ff] border-transparent text-white shadow-[0_0_40px_rgba(139,87,255,0.2)] z-10' : 
                    isGood ? 'bg-blue-600 border-transparent text-white' : 
                    'bg-card border-card-border opacity-50'}`}>
                  <span className="text-[8px] font-black uppercase opacity-60 mb-4 tracking-tighter">DAN {i+1}</span>
                  <span className="text-4xl font-black tabular-nums tracking-tighter italic">
                    {unit === 'metric' ? daySnow.toFixed(0) : (daySnow * 0.39).toFixed(1)}
                  </span>
                  <span className="text-[9px] font-black uppercase opacity-40 mt-1 tracking-widest">{unit === 'metric' ? 'cm' : 'in'}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. EMERGENCY & SERVICES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="lg:col-span-2 bg-foreground text-background p-10 flex flex-col justify-between relative overflow-hidden">
              <h4 className="text-4xl font-black uppercase tracking-tighter leading-none italic relative z-10">Pro Gear <br/> Demo Center</h4>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-4 relative z-10">K2 & Jones Test Centar</p>
              <Star size={100} className="absolute right-[-20px] bottom-[-20px] opacity-10" fill="currentColor" />
           </div>
           <div className="bg-[#8b57ff] text-white p-10 flex flex-col justify-between">
              <Zap size={32} fill="white" className="mb-6" />
              <h5 className="text-xl font-black uppercase tracking-tighter italic leading-tight">Ratrac Taxi <br/> Peak Drop</h5>
           </div>
           <div className="bg-red-600 text-white p-10 flex flex-col justify-between">
              <ShieldAlert size={32} className="mb-6" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block mb-1">Rescue GSS</span>
                <span className="text-6xl font-black tabular-nums tracking-tighter italic leading-none">1212</span>
              </div>
           </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-card-border bg-card/30 pt-16 pb-8 px-6 md:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500 flex items-center justify-center text-white"><Snowflake size={18}/></div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter leading-none">Balkan<span className="text-blue-500">Freeride</span></h2>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 leading-relaxed italic">
                Prva regionalna platforma za freeride inteligenciju. 
                Svi podaci u realnom vremenu.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12">
              <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                <span className="text-blue-500 opacity-100">Info</span>
                <Link href="/">O Projektu</Link>
                <Link href="/">GSS Kontakti</Link>
              </div>
              <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                <span className="text-blue-500 opacity-100">Social</span>
                <Link href="/">Instagram</Link>
                <Link href="/">Strava</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-card-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-black uppercase tracking-[0.5em] opacity-30">
            <span>© 2026 BalkanFreeride — Made for the wild</span>
            <div className="flex gap-8 italic"><span>Privacy</span><span>Terms</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}