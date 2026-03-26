"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();

  return (
    <div className="w-full h-full bg-[#f1f5f9] dark:bg-[#020617] overflow-visible">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        // Centriran Kolašin (19.5E, 42.8N), scale 8000 da uhvati Makedoniju i BiH
        projectionConfig={{ rotate: [-19.5, -42.8, 0], scale: 8000 }}
      >
        <ZoomableGroup center={[19.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="currentColor" 
                  className="text-slate-300 dark:text-slate-800 transition-colors"
                  stroke={isDark ? "#1e293b" : "#cbd5e1"}
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
            });
            const s = getStatus(snow);

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g className="cursor-pointer outline-none group">
                  {/* Marker koji pulsira */}
                  <circle r="8" fill={s.color} className="animate-ping opacity-20" />
                  <circle r="5" fill={s.color} stroke="white" strokeWidth="2" onClick={() => router.push(`/resort/${resort.id}`)} />
                  
                  {/* Ime planine (uvek vidljivo) */}
                  <text textAnchor="middle" y="15" className="fill-slate-500 dark:fill-slate-400 text-[8px] font-black uppercase pointer-events-none">
                    {resort.name}
                  </text>

                  {/* FENSI TOOLTIP (Hover) */}
                  <g 
                    className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-auto"
                    onClick={() => router.push(`/resort/${resort.id}`)}
                  >
                    <rect x="-40" y="-55" width="80" height="35" rx="12" fill={s.color} className="shadow-2xl" />
                    <text textAnchor="middle" y="-42" className="fill-white text-[9px] font-black uppercase tracking-tighter">
                      {resort.name}
                    </text>
                    <text textAnchor="middle" y="-28" className="fill-white text-[12px] font-black">
                      {snow.toFixed(0)}cm
                    </text>
                  </g>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}