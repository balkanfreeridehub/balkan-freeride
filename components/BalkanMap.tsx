"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';
import { Snowflake, Thermometer, Navigation, Sun, CloudRain, CloudSnow, Cloud } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
  switch (condition?.toLowerCase()) {
    case 'snow': return <CloudSnow className={className} />;
    case 'rain': return <CloudRain className={className} />;
    case 'cloudy': return <Cloud className={className} />;
    default: return <Sun className={className} />;
  }
};

export default function BalkanMap({ resorts = [], timeframe, getStatus, lang }: any) {
  const router = useRouter();
  const [hoveredResort, setHoveredResort] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const anchorRef = useRef<SVGGElement | null>(null);

  const config = { center: [19.786353, 42.805422], zoom: 2.64 };

  const syncPosition = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  }, []);

  useEffect(() => {
    if (hoveredResort) {
      window.addEventListener('scroll', syncPosition, { passive: true });
      window.addEventListener('resize', syncPosition);
      syncPosition();
    }
    return () => {
      window.removeEventListener('scroll', syncPosition);
      window.removeEventListener('resize', syncPosition);
    };
  }, [hoveredResort, syncPosition]);

  const handleMouseEnter = (resort: any, snow: number, s: any, e: React.MouseEvent<SVGGElement>) => {
    anchorRef.current = e.currentTarget;
    setHoveredResort({ ...resort, snow, status: s });
    syncPosition();
  };

  return (
    <div className="w-full h-full relative bg-transparent">
      
      <div className="w-full h-full pointer-events-none">
        <ComposableMap 
          projection="geoAzimuthalEqualArea" 
          projectionConfig={{ scale: 5000 }} 
          className="w-full h-full overflow-visible"
        >
          <ZoomableGroup 
            center={config.center as [number, number]} 
            zoom={config.zoom} 
            minZoom={config.zoom} 
            maxZoom={config.zoom}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }: { geographies: any[] }) => geographies.map((geo: any) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10 outline-none" 
                />
              ))}
            </Geographies>

            {resorts && resorts.map((resort: any) => {
              let snow = 0;
              resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
                if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
              });
              const s = getStatus(snow);

              const isJahorina = resort.id.toLowerCase().includes('jahorina') || resort.name.toLowerCase().includes('jahorina');
              const isBjelasnica = resort.id.toLowerCase().includes('bjelasnica') || resort.name.toLowerCase().includes('bjelasnica');
              
              return (
                <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                  <g 
                    className="cursor-pointer outline-none group pointer-events-auto" 
                    onClick={() => router.push(`/resort/${resort.id}`)}
                    onMouseEnter={(e) => handleMouseEnter(resort, snow, s, e)}
                    onMouseLeave={() => setHoveredResort(null)}
                  >
                    {/* Veći nevidljivi krug koji sprečava gubljenje hovera */}
                    <circle r="20" fill="transparent" />
                    <circle r="10" fill={s?.color || "#3b82f6"} className="opacity-20 animate-ping pointer-events-none" />
                    <circle r="5" fill={s?.color || "#3b82f6"} stroke="white" strokeWidth={2} className="pointer-events-none" />
                    
                    <text 
                      x={isBjelasnica ? -12 : 0}
                      y={0}
                      dy={isJahorina ? "-10" : "15"} 
                      textAnchor={isBjelasnica ? "end" : "middle"} 
                      className="text-[6px] font-black uppercase fill-slate-400 dark:fill-slate-600 tracking-tighter pointer-events-none transition-colors group-hover:fill-[#3b82f6]"
                    >
                      {resort.name}
                    </text>
                  </g>
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {hoveredResort && (
        <div 
          className="fixed z-[99999] pointer-events-auto"
          style={{ 
            left: tooltipPos.x, 
            top: tooltipPos.y - 5, // Blago podignuto da ne seče krug markera
            transform: 'translate(-50%, -100%)',
            willChange: 'top, left'
          }}
          // Ključno: sprečava MouseLeave markera dok si na tooltipu
          onMouseEnter={() => setHoveredResort(hoveredResort)}
          onMouseLeave={() => setHoveredResort(null)}
          onClick={() => router.push(`/resort/${hoveredResort.id}`)}
        >
          {/* Bridge: Nevidljivi prostor između markera i tooltipa koji drži hover aktivnim */}
          <div className="absolute h-10 w-full bottom-[-20px] left-0 bg-transparent" />

          <div className="p-6 rounded-[3rem] bg-white dark:bg-[#0f172a] border border-black/10 dark:border-white/10 w-64 cursor-pointer shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col items-center text-center transition-transform active:scale-95">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-white mb-3" style={{ backgroundColor: hoveredResort.status?.color }}>
              {hoveredResort.status?.icon} {hoveredResort.status?.txt}
            </div>

            <h3 className="text-xl font-black uppercase tracking-tighter dark:text-white mb-0.5 leading-none">{hoveredResort.name}</h3>
            <p className="text-[9px] font-bold uppercase opacity-30 dark:text-white mb-4 italic tracking-widest">{hoveredResort.country}</p>

            <div className="h-20 w-full rounded-[2.2rem] flex flex-col justify-center items-center text-white relative overflow-hidden mb-5 shadow-inner" style={{ backgroundColor: hoveredResort.status?.color }}>
               <div className="flex flex-col items-center z-10 scale-[0.7]">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-0">SNEG</span>
                  <div className="flex items-baseline gap-1 leading-none text-white">
                    <span className="text-5xl font-black tracking-tighter tabular-nums">{hoveredResort.snow.toFixed(0)}</span>
                    <span className="text-lg font-black opacity-40 uppercase italic ml-1">cm</span>
                  </div>
               </div>
               <Snowflake className="absolute right-[-5px] bottom-[-5px] w-14 h-14 opacity-10 rotate-12" />
            </div>

            <div className="grid grid-cols-3 gap-2 scale-90 w-full">
               <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-black/[0.05] dark:border-white/10">
                  <WeatherIcon condition={hoveredResort.condition || 'clear'} className="w-6 h-6 text-[#3b82f6]" />
               </div>
               <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-black/[0.05] dark:border-white/10">
                  <Thermometer size={14} className="text-[#3b82f6] mb-1" />
                  <span className="text-xs font-black dark:text-white">{hoveredResort.current?.temperature_2m.toFixed(0)}°C</span>
               </div>
               <div className="aspect-square bg-slate-100 dark:bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-black/[0.05] dark:border-white/10">
                  <Navigation size={14} fill="currentColor" className="text-[#3b82f6] mb-1" style={{ transform: `rotate(${hoveredResort.current?.wind_direction_10m}deg)` }} />
                  <span className="text-[10px] font-black dark:text-white leading-none">{hoveredResort.current?.wind_speed_10m.toFixed(0)}</span>
               </div>
            </div>
          </div>

          <div className="relative h-2.5 w-full flex justify-center">
             <div className="w-4 h-4 bg-white dark:bg-[#0f172a] rotate-45 -mt-[8px] border-r border-b border-black/10 dark:border-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}