"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { balkanResorts } from '../../../data/resorts';
import { Snowflake, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../../../components/ThemeToggle';

export default function ResortPage() {
  const params = useParams();
  const router = useRouter();
  
  // CLEANER: Uzmi samo brojeve iz URL-a
  const rawId = params.id?.toString() || "";
  const cleanId = rawId.replace(/\D/g, ""); 
  
  const resort = balkanResorts.find(r => r.id.toString() === cleanId);

  if (!resort) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
      <div className="text-center p-10 bg-white dark:bg-white/5 rounded-[3rem] shadow-2xl">
        <h2 className="text-2xl font-black uppercase mb-6">Planina nije pronađena</h2>
        <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all">Nazad na Hub</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]">
      <nav className="px-8 py-5 border-b border-black/5 flex justify-between items-center bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Snowflake size={24} />
           </div>
           <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-blue-600">Freeride</span></h1>
        </div>
        <ThemeToggle />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <button onClick={() => router.push('/')} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] hover:text-blue-600 transition-all">
          <ArrowLeft size={16} /> Back to Hub
        </button>
        
        <div className="bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-black/5 shadow-2xl">
          <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4">{resort.name}</h1>
          <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.3em] mb-12">{resort.country}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="h-64 bg-slate-50 dark:bg-white/5 rounded-[3rem] p-8">
                <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-4">Location Data</span>
                <p className="text-slate-500 font-bold uppercase">Lat: {resort.lat}</p>
                <p className="text-slate-500 font-bold uppercase">Lon: {resort.lon}</p>
             </div>
             <div className="h-64 bg-slate-50 dark:bg-white/5 rounded-[3rem] flex items-center justify-center">
                <span className="text-slate-300 font-black italic text-xl uppercase opacity-30">Apple Tiles Loading...</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}