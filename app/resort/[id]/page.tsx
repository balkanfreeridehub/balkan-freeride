"use client"
import React, { useEffect, useState, use as useReact } from 'react';
import { balkanResorts } from '@/data/resorts';
import { getWeatherData } from '@/lib/weather';
import { 
  Snowflake, Thermometer, ChevronLeft, Wind, 
  Droplets, MapPin, Camera, Star, Sun, 
  ShieldAlert, Clock, Calendar, ArrowRight, 
  Navigation, Plane, Mountain, Zap, Hotel, UserCheck, Info, Timer
} from 'lucide-react';
import Link from 'next/link';

export default function ResortPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useReact(params);
  const id = resolvedParams?.id;

  const [data, setData] = useState<any>(null);
  const [resort, setResort] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const decodedId = decodeURIComponent(id as string);
      const found = balkanResorts.find(r => r.id === decodedId);
      if (found) {
        setResort(found);
        getWeatherData(found.lat, found.lon).then(setData).finally(() => setLoading(false));
      }
    }
  }, [id]);

  if (loading || !resort) return <div className="h-screen bg-white dark:bg-[#020617]" />;

  const temp = data?.current?.temperature_2m || 0;
  const humidity = data?.current?.relative_humidity_2m || 0;
  
  // LOGIKA ZA KVALITET SNEGA (Champagne Powder vs Heavy)
  const snowQuality = temp < -5 && humidity < 60 ? 'Champagne Powder' : 
                     temp < 0 && humidity < 80 ? 'Dry & Cold' : 'Heavy / Wet';
  const qualityScore = temp < -5 ? 95 : temp < 0 ? 70 : 30;

  const totalSnow = data?.hourly?.precipitation?.slice(0, 240).reduce((acc: number, curr: number, idx: number) => {
    return data.hourly.temperature_2m[idx] <= 1 ? acc + curr : acc;
  }, 0) * 1.2;

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#020617] text-black dark:text-white pb-32">
      
      {/* HEADER - Fokus na Planinu i Sneg */}
      <header className="max-w-[1440px] mx-auto p-6 flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">{resort.name}</h1>
            <div className="flex items-center gap-4 mt-2 font-black uppercase text-[10px] tracking-[0.4em] opacity-40">
              <MapPin size={10} /> {resort.country} • <Timer size={10} /> Last Snow: 4h ago
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#3b82f6] p-6 rounded-[2.5rem] text-white min-w-[220px] shadow-xl">
            <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Accumulated (10d)</div>
            <div className="text-4xl font-black tabular-nums">{totalSnow.toFixed(0)}<span className="text-lg ml-1 text-white/50">cm</span></div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 space-y-6 pt-6">

        {/* 1. POWDER INTELLIGENCE GRID */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* 10-Day Japan Style (One Row) */}
          <div className="md:col-span-8 bg-white dark:bg-white/[0.03] rounded-[3rem] p-8 border border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black uppercase text-[11px] tracking-[0.4em] flex items-center gap-3">
                <Calendar size={16} className="text-[#3b82f6]" /> Snow Cycle Intensity
              </h3>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {Array.from({length: 10}).map((_, i) => {
                const daySnow = data?.hourly?.precipitation?.slice(i*24, (i+1)*24).reduce((a:number, b:number) => a + b, 0) * 1.2;
                const isPurple = daySnow >= 25;
                const isBlue = daySnow >= 10 && daySnow < 25;
                return (
                  <div key={i} className={`flex-1 min-w-[95px] p-5 rounded-[2rem] flex flex-col items-center justify-between transition-all border-2 
                    ${isPurple ? 'bg-[#8b57ff] border-transparent text-white shadow-lg' : 
                      isBlue ? 'bg-[#3b82f6] border-transparent text-white' : 
                      'bg-slate-50 dark:bg-white/5 border-black/[0.03] dark:border-white/5'}`}>
                    <span className="text-[8px] font-black uppercase opacity-60">Day {i+1}</span>
                    <span className="text-2xl font-black tabular-nums mt-4">{daySnow.toFixed(0)}</span>
                    <span className="text-[8px] font-black uppercase opacity-40">cm</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Snow Quality (The Trigger) */}
          <div className="md:col-span-4 bg-white dark:bg-white/[0.03] rounded-[3rem] p-8 border border-black/5 dark:border-white/10 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4 font-black uppercase text-[10px] tracking-widest text-[#8b57ff]">
              <Zap size={14} /> Powder Quality
            </div>
            <div>
              <div className="text-3xl font-black uppercase tracking-tighter mb-2">{snowQuality}</div>
              <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-[#8b57ff] transition-all duration-1000 shadow-[0_0_10px_#8b57ff]" style={{ width: `${qualityScore}%` }} />
              </div>
            </div>
            <p className="text-[9px] font-bold uppercase opacity-40 leading-relaxed mt-6">Based on Temp: {temp.toFixed(1)}°C & Humidity: {humidity}%</p>
          </div>
        </section>

        {/* 2. SERVICES & MONETIZATION GRID */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* EXCLUSIVE TOURS - Ratrac & Heli (Monetized) */}
          <div className="md:col-span-7 bg-black text-white rounded-[4rem] p-12 relative overflow-hidden group">
             <div className="relative z-10">
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">Secret Spots & <br/><span className="text-[#3b82f6]">Uncharted Peaks</span></h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-40 max-w-sm mb-12">Rezerviši vožnju ratrakom do vrhova gde nema gužve. Isključivo za freeride grupe.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer group/item">
                    <div className="flex justify-between items-start mb-6">
                      <Zap className="text-amber-400" />
                      <ArrowRight size={16} className="group-hover/item:translate-x-2 transition-transform" />
                    </div>
                    <div className="font-black uppercase text-sm">Ratrac Taxi</div>
                    <div className="text-[9px] opacity-40 font-bold uppercase mt-1">Starting from €40</div>
                  </div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer group/item">
                    <div className="flex justify-between items-start mb-6">
                      <Plane className="text-[#3b82f6]" />
                      <ArrowRight size={16} className="group-hover/item:translate-x-2 transition-transform" />
                    </div>
                    <div className="font-black uppercase text-sm">Heli-Drop</div>
                    <div className="text-[9px] opacity-40 font-bold uppercase mt-1">Check availability</div>
                  </div>
                </div>
             </div>
             <Mountain className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] opacity-[0.03] pointer-events-none" />
          </div>

          {/* RENTAL DEALS (Affiliate) */}
          <div className="md:col-span-5 bg-[#8b57ff] text-white rounded-[4rem] p-12 flex flex-col justify-between shadow-2xl shadow-[#8b57ff]/20">
             <div>
                <Star size={32} fill="currentColor" className="mb-8" />
                <h4 className="text-4xl font-black uppercase tracking-tighter leading-tight mb-4">Pro Gear <br/>Rental & Demo</h4>
                <p className="text-xs font-bold uppercase tracking-widest opacity-70">Jones, K2 & Nitro splitboards. Rezerviši u app i ostvari 15% popusta.</p>
             </div>
             <button className="w-full py-6 bg-white text-[#8b57ff] rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:scale-105 transition-transform mt-8 shadow-xl">
                Get Discount Code
             </button>
          </div>
        </section>

        {/* 3. EXPERT NETWORK & STAY */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Verified Guides */}
           <div className="bg-white dark:bg-white/[0.03] p-10 rounded-[3.5rem] border border-black/5 dark:border-white/10 flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-8 font-black uppercase text-[10px] tracking-widest text-[#8b57ff]">
                    <UserCheck size={14} /> Verified Guides
                 </div>
                 <div className="space-y-6">
                    {[
                      { name: 'Igor S.', role: 'Splitboard Expert', xp: '12y' },
                      { name: 'Nemanja T.', role: 'Freeride Guide', xp: '8y' }
                    ].map((g, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-black/5 dark:border-white/5 pb-4 last:border-0">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-[#8b57ff] rounded-full flex items-center justify-center font-black text-[10px] text-white shadow-lg">PRO</div>
                            <div>
                               <div className="text-xs font-black uppercase group-hover:text-[#8b57ff] transition-colors">{g.name}</div>
                               <div className="text-[9px] font-bold uppercase opacity-40">{g.role} • {g.xp} XP</div>
                            </div>
                         </div>
                         <ArrowRight size={14} className="opacity-20 group-hover:opacity-100 transition-all" />
                      </div>
                    ))}
                 </div>
              </div>
              <button className="w-full py-5 border-2 border-[#8b57ff] text-[#8b57ff] rounded-2xl font-black uppercase text-[10px] tracking-widest mt-8">View All Guides</button>
           </div>

           {/* Curated Accomodation */}
           <div className="bg-white dark:bg-white/[0.03] p-10 rounded-[3.5rem] border border-black/5 dark:border-white/10 flex flex-col justify-between">
              <div>
                 <div className="flex items-center gap-2 mb-8 font-black uppercase text-[10px] tracking-widest text-[#3b82f6]">
                    <Hotel size={14} /> Freeride Basecamp
                 </div>
                 <div className="space-y-6">
                    {[
                      { name: 'Termag Hotel', location: 'Ski-in / Ski-out', price: '€140' },
                      { name: 'Aparthotel Vučko', location: 'Near GSS Station', price: '€110' }
                    ].map((h, i) => (
                      <div key={i} className="group cursor-pointer border-b border-black/5 dark:border-white/5 pb-4 last:border-0 flex justify-between items-end">
                         <div>
                            <div className="text-xs font-black uppercase group-hover:text-[#3b82f6] transition-colors">{h.name}</div>
                            <div className="text-[9px] font-bold uppercase opacity-40 mt-1">{h.location}</div>
                         </div>
                         <div className="text-sm font-black text-right">{h.price}<span className="text-[8px] opacity-40 block">AVG/NIGHT</span></div>
                      </div>
                    ))}
                 </div>
              </div>
              <button className="w-full py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest mt-8 shadow-xl">Book a Room</button>
           </div>

           {/* Safety Card (GSS + Avalanche) */}
           <div className="bg-red-600 text-white p-10 rounded-[3.5rem] flex flex-col justify-between shadow-2xl shadow-red-600/20">
              <ShieldAlert size={40} className="mb-8" />
              <div>
                 <h4 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">Emergency Hub</h4>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-8">Uvek dostupan broj Gorske Službe Spašavanja za Jahorinu.</p>
                 <div className="text-6xl font-black tabular-nums tracking-tighter border-t border-white/20 pt-6">1212</div>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
}