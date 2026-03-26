"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { balkanResorts } from '../../../data/resorts';
import ThemeToggle from '../../../components/ThemeToggle';
import { ArrowLeft, Snowflake } from 'lucide-react';

const FlagUSA = () => ( <svg width="32" height="32" viewBox="0 0 64 64" className="rounded-full shadow-sm"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#428bc1" d="M16 6.6C10.1 11.2 2 20.4 2 32h30V2c-5.9 0-11.3 1.7-16 4.6z"/><path fill="#fff" d="M25 3l.5 1.5H27l-1.2 1l.4 1.5l-1.2-.9l-1.2.9l.4-1.5l-1.2-1h1.5z"/></svg> );
const FlagSRB = () => ( <svg width="32" height="32" viewBox="0 0 64 64" className="rounded-full shadow-sm"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/></svg> );

export default function ResortPage() {
  const params = useParams();
  const router = useRouter();
  const [lang, setLang] = useState<'sr' | 'en'>('sr');
  
  // FIX: Provera ID-a (neki su string, neki number u JSON-u)
  const resort = balkanResorts.find(r => r.id.toString() === params.id?.toString());

  if (!resort) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase italic">
        Planina nije pronađena... <button onClick={() => router.push('/')} className="ml-4 underline">Nazad</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Snowflake size={24} /></div>
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
        <button onClick={() => router.back()} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Back to Hub
        </button>

        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-2">{resort.name}</h1>
        <p className="text-xl font-bold text-slate-400 uppercase tracking-widest mb-12">{resort.country}</p>

        <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 border border-black/5 shadow-2xl">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 mb-8">Hourly Snow Forecast</h2>
           <div className="text-slate-400 italic">Apple Tiles Loading... (Next step)</div>
        </div>
      </main>
    </div>
  );
}