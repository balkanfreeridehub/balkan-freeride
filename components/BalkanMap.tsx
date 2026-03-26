"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

export default function BalkanMap({ resorts, timeframe, getStatus, isDark }: any) {
  const router = useRouter();

  return (
    <div className="w-full h-full bg-slate-100 dark:bg-[#020617]">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-20.5, -42.8, 0], scale: 6500 }} // Normalan zoom
      >
        <ZoomableGroup center={[20.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill={isDark ? "#1e293b" : "#e2e8f0"} 
                  stroke={isDark ? "#334155" : "#cbd5e1"} 
                  className="outline-none" 
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
                <g onClick={() => router.push(`/resort/${resort.id}`)} className="cursor-pointer outline-none group">
                  <circle r="5" fill={s.color} stroke="white" strokeWidth="2" />
                  <text 
                    textAnchor="middle" 
                    y="18" 
                    className="fill-black dark:fill-white text-[11px] font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {resort.name}
                  </text>
                  {/* Uvek vidljiva manja imena bez opacity-0 ako želiš da se stalno vide */}
                  <text textAnchor="middle" y="18" className="fill-black dark:fill-white text-[10px] font-black uppercase tracking-tighter pointer-events-none opacity-40 group-hover:hidden">
                    {resort.name}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}