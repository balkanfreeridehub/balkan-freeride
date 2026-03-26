"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full bg-transparent overflow-visible">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-19.5, -42.8, 0], scale: 8000 }}
      >
        <ZoomableGroup center={[19.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill={isDark ? "#1e293b" : "#e2e8f0"} 
                  stroke={isDark ? "#334155" : "#cbd5e1"}
                  strokeWidth={0.5}
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
                <g className="cursor-pointer outline-none group">
                  <circle r="8" fill={s.color} className="animate-ping opacity-20" />
                  <circle r="5" fill={s.color} stroke="white" strokeWidth={2} onClick={() => router.push(`/resort/${resort.id}`)} />
                  
                  <text textAnchor="middle" y="18" className="fill-slate-400 dark:fill-slate-500 text-[8px] font-black uppercase pointer-events-none">
                    {resort.name}
                  </text>

                  <g className="opacity-0 group-hover:opacity-100 transition-all pointer-events-auto" onClick={() => router.push(`/resort/${resort.id}`)}>
                    <rect x="-40" y="-55" width="80" height="35" rx="12" fill={s.color} />
                    <text textAnchor="middle" y="-42" className="fill-white text-[9px] font-black uppercase">{resort.name}</text>
                    <text textAnchor="middle" y="-28" className="fill-white text-[12px] font-black">{snow.toFixed(0)}cm</text>
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