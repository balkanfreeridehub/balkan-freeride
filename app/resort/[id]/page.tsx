"use client"
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { balkanResorts } from '@/data/resorts';
import { Snowflake, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function ResortPage() {
  const params = useParams();
  const router = useRouter();
  
  // Čupamo samo brojeve iz URL-a (rešava id:154967)
  const cleanId = params.id?.toString().replace(/\D/g, "");
  const resort = balkanResorts.find(r => r.id.toString() === cleanId);

  if (!resort) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <button onClick={() => router.push('/')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase">
          Planina nije nađena - Nazad na Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617]">
      <nav className="px-8 py-5 border-b border-black/5 flex justify-between items-center bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
           <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Snowflake size={24} /></div>
           <h1 className="text-2xl font-black italic uppercase tracking-tighter">Balkan<span className="text-blue-600">Freeride</span></h1>
        </div>
        <ThemeToggle />
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <button onClick={() => router.push('/')} className="mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest opacity-50 hover:opacity-100 transition-all">
          <ArrowLeft size={16} /> Back to Hub
        </button>
        <div className="bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-black/5">
          <h1 className="text-7xl font-black italic uppercase tracking-tighter mb-4">{resort.name}</h1>
          <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">{resort.country}</p>
        </div>
      </main>
    </div>
  );
}