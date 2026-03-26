"use client"
import React, { useState, use } from 'react';
import { balkanResorts } from '@/data/resorts';
import { Snowflake, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

// SVGOVI MORAJU BITI TU ZA JEZIK
const FlagUSA = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M48 6.6C43.3 3.7 37.9 2 32 2v4.6z"/><path fill="#fff" d="M32 11.2h21.6C51.9 9.5 50 7.9 48 6.6H32z"/><path fill="#428bc1" d="M16 6.6c-2.1 1.3-4 2.9-5.7 4.6c-1.4 1.4-2.6 3-3.6 4.6c-.9 1.5-1.8 3-2.4 4.6c-.6 1.5-1.1 3-1.5 4.6c-.4 1.5-.6 3-.7 4.6c-.1.8-.1 1.6-.1 2.4h30V2c-5.9 0-11.3 1.7-16 4.6"/></svg>;
const FlagSRB = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64"><path fill="#ed4c5c" d="M32 2C18.9 2 7.8 10.4 3.7 22h56.6C56.2 10.4 45.1 2 32 2"/><path fill="#f9f9f9" d="M32 62c13.1 0 24.2-8.3 28.3-20H3.7C7.8 53.7 18.9 62 32 62"/><path fill="#2872a0" d="M3.7 22C2.6 25.1 2 28.5 2 32s.6 6.9 1.7 10h56.6c1.1-3.1 1.7-6.5 1.7-10s-.6-6.9-1.7-10z"/></svg>;

export default function ResortPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [lang, setLang] = useState('sr');
  
  // ČISTIMO SVE ŠTO NIJE BROJ - ako dobije "id:123" pretvoriće u "123"
  const rawId = decodeURIComponent(resolvedParams.id);
  const cleanId = rawId.replace(/\D/g, "");
  
  const resort = balkanResorts.find(r => r.id.toString() === cleanId);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] font-sans">
      <nav className="sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-50 px-8 py-5 border-b border-black/5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black shadow-lg"><Snowflake size={24}/></div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Balkan<span className="text-[#A855F7] ml-1">Freeride</span></h1>
        </Link>
        <div className="flex gap-4 items-center">
          <button type="button" onClick={() => setLang(l => l==='sr'?'en':'sr')} className="cursor-pointer">{lang==='sr' ? <FlagSRB/> : <FlagUSA/>}</button>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 mb-10 transition-opacity">
          <ArrowLeft size={14}/> Back to list
        </Link>

        {!resort ? (
           <div className="bg-white dark:bg-white/5 p-20 rounded-[4rem] border border-black/5 text-center">
              <h2 className="text-3xl font-black uppercase mb-4 opacity-20 italic">Mountain Not Found</h2>
              <p className="text-sm font-bold opacity-40 mb-8 tracking-widest uppercase">ID debug: {cleanId} (raw: {rawId})</p>
              <Link href="/" className="bg-[#A855F7] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest shadow-xl">Back Home</Link>
           </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="bg-white dark:bg-white/5 p-16 rounded-[5rem] border border-black/5 shadow-2xl mb-10">
                <p className="text-[#A855F7] font-black uppercase tracking-[0.5em] mb-4">{resort.country}</p>
                <h1 className="text-8xl font-black italic uppercase tracking-tighter mb-4 leading-none">{resort.name}</h1>
                <div className="h-2 w-40 bg-[#A855F7] rounded-full mt-10" />
             </div>
             {/* Ovde idu detalji vremenske prognoze koje smo pre imali */}
          </div>
        )}
      </main>
    </div>
  );
}