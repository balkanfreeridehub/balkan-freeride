"use client"
import React from 'react'

export default function LiveCamModal({ isOpen, onClose, resort }: { isOpen: boolean, onClose: () => void, resort: any }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/10 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all"
        >
          ✕
        </button>
        
        <div className="p-8">
          <h3 className="text-2xl font-black uppercase italic mb-6">
            Live from <span className="text-orange-600">{resort.name}</span>
          </h3>
          
          <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden border border-white/5">
            {resort.videoType === 'youtube' ? (
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${resort.videoId}?autoplay=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <img 
                src={`${resort.videoId}?t=${new Date().getTime()}`} 
                alt="Live Cam" 
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="mt-6 flex justify-between items-center opacity-50 text-[10px] font-bold uppercase tracking-widest">
            <span>Powered by {resort.name} Ski Center</span>
            <span>Live Stream • 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}