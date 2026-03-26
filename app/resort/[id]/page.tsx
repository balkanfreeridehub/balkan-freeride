"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { balkanResorts } from '../../../data/resorts'; // Proveri putanju do data foldera
import { ArrowLeft, Snowflake, Wind, Thermometer } from 'lucide-react';

export default function ResortPage() {
  const params = useParams();
  const router = useRouter();
  
  // Pronalazimo planinu na osnovu ID-a iz URL-a
  const resort = balkanResorts.find(r => r.id.toString() === params.id);

  if (!resort) return <div className="p-20 font-black uppercase tracking-tighter">Planina nije pronađena...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans">
      {/* Header / Nav */}
      <nav className="p-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} /> Nazad
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-2">{resort.name}</h1>
        <p className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-12">{resort.country}</p>

        {/* OVDE ĆEMO DODATI APPLE STYLE HOURLY TILES */}
        <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-black/5 shadow-2xl">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-8">Hourly Forecast</h2>
           {/* Tu ide onaj horizontalni skrol što smo pričali */}
           <div className="text-slate-400 italic">Ovde sleću Apple Tiles...</div>
        </div>

        {/* DODATNI SADRŽAJ (Webcam, Staze, Info...) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="h-64 bg-slate-100 dark:bg-white/5 rounded-[3rem] flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-slate-400">
               Live Webcam (Coming Soon)
            </div>
            <div className="h-64 bg-slate-100 dark:bg-white/5 rounded-[3rem] flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-slate-400">
               Ski Slopes Info
            </div>
        </div>
      </main>
    </div>
  );
}