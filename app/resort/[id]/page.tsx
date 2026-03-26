"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { Snowflake, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const FlagUSA = () => <svg width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6-1.4 1.4-2.6 3-3.6 4.6h23.3V2c-5.9 0-11.3 1.7-16 4.6"/></svg>;
const FlagSRB = () => <svg width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/></svg>;

export default function ResortPage() {
  const params = useParams();
  const router = useRouter();
  const [lang, setLang] = useState('sr');
  
  const cleanId = params.id?.toString().split(':').pop() || "";
  const resort = balkanResorts.find(r => r.id.toString() === cleanId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Snowflake size={24}/></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-[#f59e0b]">Freeride</span></h1>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')}>{lang==='sr'?<FlagUSA/>:<FlagSRB/>}</button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {!resort ? (
           <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[4rem] border border-black/5">
              <h2 className="text-3xl font-black uppercase mb-6">Planina nije pronađena</h2>
              <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold">NAZAD</button>
           </div>
        ) : (
          <>
            <button onClick={() => router.push('/')} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-50 hover:opacity-100">
              <ArrowLeft size={16} /> Back to Hub
            </button>
            <div className="bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-black/5 shadow-2xl">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4">{resort.name}</h1>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{resort.country}</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}