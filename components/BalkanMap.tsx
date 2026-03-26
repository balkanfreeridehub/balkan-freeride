"use client"
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-[#f1f5f9] dark:bg-[#020617]">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-20.5, -42.8, 0], scale: 12000 }}
      >
        <ZoomableGroup center={[20.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#e2e8f0" stroke="#cbd5e1" className="dark:fill-slate-800 dark:stroke-slate-700 outline-none" />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
            });
            const s = getStatus(snow);
            const isJahorina = resort.name === "Jahorina";

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g 
                  onClick={() => router.push(`/resort/${resort.id}`)} 
                  onMouseEnter={() => setHovered(resort.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer outline-none"
                >
                  <circle r="14" fill={s.color} className="animate-ping" opacity="0.1" />
                  <circle r="7" fill={s.color} stroke="white" strokeWidth="2" />
                  
                  <text 
                    textAnchor="middle" 
                    y={isJahorina ? -25 : 30} 
                    className="fill-slate-900 dark:fill-white text-[16px] font-black uppercase tracking-tighter pointer-events-none drop-shadow-sm"
                  >
                    {resort.name}
                  </text>

                  {hovered === resort.id && (
                    <g transform="translate(0, -60)">
                      <rect x="-55" y="-40" width="110" height="50" rx="14" fill={isDark ? '#1e293b' : 'white'} className="shadow-2xl" />
                      <rect x="-55" y="-40" width="110" height="12" rx="4" fill={s.color} />
                      <text textAnchor="middle" y="-10" fill={isDark ? 'white' : '#0f172a'} fontSize="18" fontWeight="900">{snow.toFixed(0)}cm</text>
                      <text textAnchor="middle" y="4" fill={s.color} fontSize="8" fontWeight="900" className="uppercase tracking-widest">{s.txt}</text>
                    </g>
                  )}
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}