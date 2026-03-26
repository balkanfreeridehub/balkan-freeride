"use client"
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { Snowflake, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

const FlagUSA = () => <svg width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6-1.4 1.4-2.6 3-3.6 4.6h23.3V2c-5.9 0-11.3 1.7-16 4.6"/></svg>;
const FlagSRB = () => <svg width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/></svg>;

export default function ResortPage() {
  const params = useParams();
  const [lang, setLang] = useState('sr');
  
  // Rešava id:XXXX bez obzira na URL encoding
  const rawId = decodeURIComponent(params.id?.toString() || "");
  const cleanId = rawId.match(/\d+/)?.[0] || "";
  const resort = balkanResorts.find(r => r.id.toString() === cleanId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-lg">
            <Snowflake size={24}/>
          </div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
            Balkan<span className="text-[#A855F7] ml-1">Freeride</span>
          </h1>
        </Link>
        <div className="flex gap-4 items-center">
          <button onClick={() => setLang(l => l==='sr'?'en':'sr')}>{lang==='sr' ? <FlagSRB/> : <FlagUSA/>}</button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {!resort ? (
           <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[4rem] border border-black/5">
              <h2 className="text-3xl font-black uppercase mb-6 text-slate-400">ID: {cleanId} - Planina nije pronađena</h2>
              <Link href="/" className="bg-[#A855F7] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest inline-block">NAZAD</Link>
           </div>
        ) : (
          <>
            <Link href="/" className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.3em] opacity-50 hover:opacity-100 hover:text-[#A855F7] transition-all">
              <ArrowLeft size={16} /> Back to Hub
            </Link>
            <div className="bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-black/5 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/10 blur-[100px] -mr-32 -mt-32" />
              <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4">{resort.name}</h1>
              <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.4em]">{resort.country}</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}