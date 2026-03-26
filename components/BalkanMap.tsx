"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus, lang }: any) {
  const router = useRouter();
  const config = { center: [19.786353, 42.805422], zoom: 2.64 };

  return (
    <div className="w-full h-full cursor-default">
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ scale: 5000 }} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup center={config.center as [number, number]} zoom={config.zoom} minZoom={config.zoom} maxZoom={config.zoom} filterZoomEvent={() => {}}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) => geographies.map((geo: any) => (
              <Geography key={geo.rsmKey} geography={geo} className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10 outline-none" />
            ))}
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
            });
            const s = getStatus(snow);
            
            // Dinamička pozicija tooltipa da ne izađe sa severa
            const isNorth = resort.lat > 43.5;

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g className="cursor-pointer group outline-none" onClick={() => router.push(`/resort/${resort.id}`)}>
                  <circle r="12" fill={s.color} className="opacity-20 animate-ping" />
                  <circle r="5" fill={s.color} stroke="white" strokeWidth={2} />
                  
                  {/* Ime planine stalno vidljivo */}
                  <text textAnchor="middle" y={18} className="text-[8px] font-black uppercase fill-slate-400 dark:fill-slate-500 pointer-events-none tracking-tighter">
                    {resort.name}
                  </text>

                  {/* Interaktivni Tooltip usklađen sa kategorijom */}
                  <foreignObject 
                    x="-65" 
                    y={isNorth ? 25 : -100} // Ako je na severu, spusti tooltip ISPOD markera
                    width="130" 
                    height="90" 
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto"
                  >
                    <div 
                      className="p-3 rounded-2xl shadow-2xl border flex flex-col items-center bg-white dark:bg-slate-900 shadow-xl"
                      style={{ borderColor: s.color }}
                    >
                      <span className="text-[10px] font-black uppercase mb-1 dark:text-white leading-tight">{resort.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{snow.toFixed(0)}</span>
                        <span className="text-[9px] font-bold opacity-40 dark:text-white/40 uppercase tracking-tighter">cm Snow</span>
                      </div>
                      <div className="mt-2 text-[8px] font-black uppercase text-slate-400 italic">Click for details</div>
                    </div>
                  </foreignObject>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}