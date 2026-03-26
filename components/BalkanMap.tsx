"use client"
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse" />;

  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full bg-transparent overflow-visible">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        // FOKUS NA KOLAŠIN: hvata sve od BiH do MK
        projectionConfig={{ rotate: [-19.5, -42.8, 0], scale: 8000 }}
      >
        <ZoomableGroup center={[19.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill={isDark ? "#0f172a" : "#f1f5f9"} 
                  stroke={isDark ? "#334155" : "#cbd5e1"}
                  strokeWidth={0.8}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: isDark ? "#1e293b" : "#e2e8f0", outline: "none" },
                    pressed: { outline: "none" }
                  }}
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
                  {/* Animacija pulsa */}
                  <circle r="10" fill={s.color} className="animate-ping opacity-20" />
                  <circle r="6" fill={s.color} stroke="white" strokeWidth={2} onClick={() => router.push(`/resort/${resort.id}`)} className="transition-transform group-hover:scale-125" />
                  
                  {/* Ime planine (uvek vidljivo, diskretno) */}
                  <text textAnchor="middle" y="20" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-black uppercase pointer-events-none tracking-tighter">
                    {resort.name}
                  </text>

                  {/* FENSI TOOLTIP (Hover) */}
                  <g 
                    className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-auto"
                    onClick={() => router.push(`/resort/${resort.id}`)}
                  >
                    <rect x="-45" y="-60" width="90" height="40" rx="15" fill={s.color} className="shadow-2xl" />
                    <text textAnchor="middle" y="-45" className="fill-white text-[10px] font-black uppercase tracking-tighter">
                      {resort.name}
                    </text>
                    <text textAnchor="middle" y="-28" className="fill-white text-[14px] font-black">
                      {snow.toFixed(0)}cm
                    </text>
                    {/* Strelica tooltripa */}
                    <path d="M-6 -20 L0 -12 L6 -20 Z" fill={s.color} />
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