"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Thermometer, CloudFog, Zap, Snowflake, CircleSlash, Rocket, Star, Map as MapIcon, ChevronUp, Droplets, Wind 
} from 'lucide-react';

const BalkanMap = dynamic(() => import('../components/BalkanMap'), { ssr: false });

// TVOJI ORIGINALNI SVGOVI - NIKAD VIŠE IH NE GUBIMO
const FlagUSA = () => (
  <svg width="32" height="32" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#ed4c5c" d="M32 15.8h25.3c-1.1-1.7-2.3-3.2-3.6-4.6H32z"/><path fill="#fff" d="M32 20.4h27.7c-.7-1.6-1.5-3.2-2.4-4.6H32z"/><path fill="#ed4c5c" d="M32 25h29.2c-.4-1.6-.9-3.1-1.5-4.6H32z"/><path fill="#fff" d="M32 29.7h29.9c-.1-1.6-.4-3.1-.7-4.6H32z"/><path fill="#ed4c5c" d="M61.9 29.7H32V32H2c0 .8 0 1.5.1 2.3h59.8c.1-.8.1-1.5.1-2.3s0-1.6-.1-2.3"/><path fill="#fff" d="M2.8 38.9h58.4c.4-1.5.6-3 .7-4.6H2.1c.1 1.5.4 3.1.7 4.6"/><path fill="#ed4c5c" d="M4.3 43.5h55.4c.6-1.5 1.1-3 1.5-4.6H2.8c.4 1.6.9 3.1 1.5 4.6"/><path fill="#fff" d="M6.7 48.1h50.6c.9-1.5 1.7-3 2.4-4.6H4.3c.7 1.6 1.5 3.1 2.4 4.6"/><path fill="#ed4c5c" d="M10.3 52.7h43.4c1.3-1.4 2.6-3 3.6-4.6H6.7c1 1.7 2.3 3.2 3.6 4.6"/><path fill="#fff" d="M15.9 57.3h32.2c2.1-1.3 3.9-2.9 5.6-4.6H10.3c1.7 1.8 3.6 3.3 5.6 4.6"/><path fill="#ed4c5c" d="M32 62c5.9 0 11.4-1.7 16.1-4.7H15.9c4.7 3 10.2 4.7 16.1 4.7"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2c-5.9 0-11.3 1.7-16 4.6"/><path fill="#fff" d="m25 3l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm4 6l.5 1.5H31l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H23l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm4 6l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H19l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H11l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm20 6l.5 1.5H31l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H23l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H15l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm12 6l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H19l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm-8 0l.5 1.5H11l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5zm2.8-14l1.2-.9l1.2.9l-.5-1.5l1.2-1h-1.5L13 9l-.5 1.5h-1.4l1.2.9zm-8 12l1.2-.9l1.2.9l-.5-1.5l1.2-1H5.5L5 21l-.5 1.5h-1c0 .1-.1.2-.1.3l.8.6z"/></svg>
);
const FlagSRB = () => (
  <svg width="32" height="32" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#ed4c5c" d="M15.5 21.7v16.2C15.5 43.5 20.2 48 26 48s10.5-4.5 10.5-10.1V21.7z"/><path fill="#fff" d="m29.8 46.3l-.2-.9l-.8-1.4l.3-.2l-.2-.9l-.7-1.1l.2-.1l-.2-.9l-.5-1l.8-1.5l.5 1.6l.4-.6l.6.9l.2-.6l.6.3l-.1-1.2l1.4.4l-1-1.3h.1l-.8-1.6l.2-.6l.5 1l.2-.4l.8 2.2v-.1l.4.8l.2-.4l.8 1.6l.3-.9l1.2.9s-.1-3-.1-3.9c.2-2.6 1.1-7.9.4-10.3c-.3-1.2-2.7-4.1-2.7-4.1s-.1 3.5-.7 4.6c-.2.4-2 1.5-2 1.5l-.7-.1l.3-.1l-1.3-1.3l.5-2.6l1.3-1.9l-2 .1l-1.5.4l.4.6l-.9 3.2l-.9-3.1l.4-.6l-1.5-.5l-2-.1l1.3 1.9l.5 2.6l-1.3 1.3l.3.1l-.8.2s-1.8-1.1-2-1.5c-.6-1-.7-4.6-.7-4.6s-2.4 2.9-2.7 4.1c-.7 2.5.3 7.8.4 10.3c.1 1-.1 3.9-.1 3.9l1.2-.9l.3.9l.8-1.6l.2.4l.4-.8v.1l.8-2.2l.2.4l.5-1l.2.6l-.8 1.6h.1l-1 1.3l1.4-.4V40l.6-.3l.2.6l.6-.9l.4.6l.5-1.6l.8 1.5l-.5 1l-.2.9l.2.1l-.7 1.1l-.2.9l.3.2l-.7 1.5l-.2.9z"/><path fill="#ffce31" d="m20 41.7l.2-.4l.9-.4l.6-.2h.4l.1-.1l-.6-.3l-.1-.1l-.5.2l-.4.3l.8-1l.7-1.6l-1.1.7l-1 1.8l-.4.2h-1l-.5-.1l-.6.3l.1.1h.4l.4.2l.9-.1l-1 .3l-.2.4v.6h.1l.1-.3h.5l.9-.8l-.7 1.1l-.1.5l.3.7l.2-.1v-.5l.4-.4zm11.9 0l-.1-.4l-.9-.4l-.6-.2h-.4l-.1-.1l.6-.3l.1-.1l.5.2l.4.3l-.8-1l-.7-1.6l1.1.7l1 1.8l.4.2h1l.5-.1l.6.3l-.1.1H34l-.4.2l-.9-.1l1 .3l.2.4v.6h-.1l-.1-.3h-.5l-.9-.8l.7 1.1l.1.5l-.3.7l-.2-.1v-.5l-.4-.4zM21.4 22.2c-1 .1-.9.8 0 1.7c.2.2.2.2.3 0c.1-.3.4-.5.6-.3c.1.2.1.3.5.2c.1.1.3.2.4.3c-.1 0-.5.1-1.1.2c-.5.1-.8-.1-1.2-.5c.1.5 1.3.8 1.2.8c.1.2.1.3.2.3c.4.1.8-.2 1.2-.1c.9.2-.6-2.3-.5-2.4c.1-.2-1.3-.6-1.6-.2m8.2 2.8c.1 0 .1 0 .2-.3c-.1 0 1.1-.3 1.2-.8c-.3.4-.7.6-1.2.5c-.6-.1-1-.3-1.1-.2c.1-.1.2-.2.4-.3c.4.1.4 0 .5-.2c.2-.2.5-.1.6.3q0 .3.3 0c.9-.9 1-1.6 0-1.7c-.2-.4-1.6 0-1.5.3c0 .1-1.4 2.6-.5 2.4c.3-.2.7 0 1.1 0"/><path fill="#ed4c5c" d="M21.6 28.6v7.3c0 2.2 2 4 4.4 4s4.4-1.8 4.4-4v-7.3z"/><g fill="#fff"><path d="M24.8 27.3h2.5v15h-2.5z"/><path d="M19.1 32.3h13.8v2.5H19.1zm4.9-1.9l-1 1l.3-1l-.3-.9zm0 6.3l-1 1l.3-1l-.3-1zm4-6.3l1 1l-.2-1l.2-.9zm0 6.3l1 1l-.2-1l.2-1z"/></g><path fill="#428bc1" d="M27 11.7h-2v2h2z"/><path fill="#ffce31" d="m25.1 10.4l.2.1l.2-.1h.3v1.2H25v.4h2v-.4h-.8v-1.2h.3l.2.1l.2-.1l.2-.2l-.2-.2l-.2-.2l-.2.2h-.3v-.4l.2-.2l-.2-.2L26 9l-.2.2l-.2.2l.2.2v.4h-.3l-.2-.2l-.2.2l-.2.2zm7.4 4c-1.3-.7-2.1-.9-2.4-.4c0 0 0 .1-.1.1c-1.6-.8-2.8-.9-4-.4c-1.2-.5-2.3-.4-4 .4c0-.1 0-.1-.1-.1c-.3-.5-1.1-.4-2.4.4c-1.3.7-2.5 1.7-2.2 2.1c.1.7.5 1.3 1.2 2c.8.4 2.4.5 4.1.4c2.2-.1 4.5-.1 6.7 0c1.7.1 3.3 0 4.1-.4c.7-.7 1.1-1.3 1.2-2c.4-.3-.9-1.3-2.1-2.1"/><path fill="#ed4c5c" d="M27.4 17.2c.8-.7 1.3-1.4 1.7-2.1c-.7-.2-1.4-.3-2-.2c.1.8.2 1.6.3 2.3m-2.8 0c.1-.8.2-1.6.4-2.4c-.6-.1-1.3 0-2 .2c.2.8.8 1.5 1.6 2.2m8-1.4c-.1-.1-.3-.3-.6-.4s-.6-.2-.8-.2c-.1.8-.4 1.6-1.1 2.4c.3 0 .6-.1.8-.2c.8-.4 1.3-.9 1.7-1.3q.15-.15 0-.3m-11.8-.7c-.2 0-.5.1-.8.2c-.5.2-.8.6-.6.7c.4.4.9.8 1.7 1.3c.2.1.5.1.8.2c-.7-.8-1-1.5-1.1-2.4"/><path fill="#ffce31" d="M18.6 18.5h14.8v2H18.6z"/><path fill="#428bc1" d="m18.6 18.9l-.4.7l.5.5l.7-.7zm14.8 0l-.8.5l.7.7l.5-.5zm-7.4-.5l-.8.7l.8.6l.8-.6z"/><path fill="#ed4c5c" d="m22.3 19.8l.7-.7l-.8-.5l-.7.6zm7.4 0l.8-.6l-.7-.6l-.8.5z"/></svg>
);

const timeOptions = [
  { label: '24h', value: 24 },
  { label: '48h', value: 48 },
  { label: '5d', value: 120 },
  { label: '10d', value: 240 }
];

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  const [resorts, setResorts] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState(24);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
      setResorts(balkanResorts.map((resort, index) => ({ ...resort, ...(data[index] || {}) })));
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans pb-20">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
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
        <button onClick={() => setShowMap(!showMap)} className="w-full mb-10 py-6 bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center gap-4 font-black uppercase text-[12px] tracking-[0.3em] rounded-3xl hover:bg-slate-50 transition-all shadow-sm">
          {showMap ? <ChevronUp className="text-blue-600" /> : <MapIcon className="text-blue-600" />}
          {showMap ? (lang === 'sr' ? 'Zatvori Mapu' : 'Close Map') : (lang === 'sr' ? 'Prikaži Mapu' : 'Show Map')}
        </button>

        <div className={`transition-all duration-700 ${showMap ? 'max-h-[700px] mb-24 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
           <div className="h-[600px] border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-slate-900 overflow-hidden relative rounded-[3rem] shadow-2xl">
              <BalkanMap resorts={resorts} timeframe={timeframe} onSelect={(r) => router.push(`/resort/${r.id}`)} getStatus={getStatus} />
           </div>
        </div>

        {/* TIME SLIDER - Neutralno siva dugmad */}
        <div className="flex justify-center gap-2 mb-20 p-2 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] w-fit mx-auto border border-black/5 shadow-xl">
          {timeOptions.map((opt) => (
            <button key={opt.value} onClick={() => setTimeframe(opt.value)}
              className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase transition-all ${timeframe === opt.value ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-black shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {resorts.map((resort) => {
            let calcSnow = 0, calcRain = 0, totalP = 0;
            if (resort.hourly) {
              for (let i = 0; i < timeframe; i++) {
                const tv = resort.hourly.temperature_2m[i], p = resort.hourly.precipitation[i] || 0;
                totalP += p;
                if (p > 0) tv <= 1 ? calcSnow += p * 1.2 : calcRain += p;
              }
            }
            const s = getStatus(calcSnow);

            return (
              <div key={resort.id} onClick={() => router.push(`/resort/${resort.id}`)} className="bg-white dark:bg-white/5 p-10 flex flex-col shadow-xl border border-black/5 dark:border-white/5 rounded-[3.5rem] cursor-pointer hover:-translate-y-2 transition-all group">
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase mb-6 ${s.cls}`}>{s.icon} {s.txt}</div>
                  <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{resort.name}</h3>
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">{resort.country}</p>
                </div>

                {/* Smanjen font za sneg i boja pozadine prati status */}
                <div className="h-48 p-8 rounded-[2.8rem] text-white relative overflow-hidden shadow-2xl mb-8 flex flex-col justify-center" style={{ backgroundColor: s.color }}>
                  <div className="flex items-baseline font-black italic tracking-tighter tabular-nums leading-none">
                    <span className="text-5xl lg:text-6xl">+{calcSnow.toFixed(1)}</span>
                    <span className="text-lg ml-2 opacity-50 not-italic uppercase font-bold">cm</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex gap-4 text-[10px] font-black uppercase tracking-widest opacity-80">
                    <span className="flex items-center gap-1"><Droplets size={12}/> {totalP.toFixed(1)}mm Precip.</span>
                    {calcRain > 0 && <span className="text-red-200">! {calcRain.toFixed(1)}mm Rain</span>}
                  </div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2 italic">Current weather</p>
                <div className="grid grid-cols-3 gap-4">
                   <div className="bg-slate-50 dark:bg-white/5 rounded-[2.2rem] h-24 flex items-center justify-center text-slate-400 border border-black/5 shadow-sm"><CloudFog size={24} /></div>
                   <div className="bg-slate-50 dark:bg-white/5 rounded-[2.2rem] h-24 flex flex-col items-center justify-center font-bold tracking-tighter border border-black/5 shadow-sm">
                      <Thermometer size={14} className="mb-1 text-slate-400"/>
                      <span className="text-2xl">{resort.current?.temp ?? '--'}°</span>
                   </div>
                   <div className="bg-slate-50 dark:bg-white/5 rounded-[2.2rem] h-24 flex flex-col items-center justify-center font-bold tracking-tighter border border-black/5 shadow-sm">
                      <Wind size={14} className="mb-1 text-blue-600"/>
                      <span className="text-2xl">{resort.current?.windSpeed ?? '--'}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}