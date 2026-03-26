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
        projectionConfig={{ rotate: [-19.5, -43.0, 0], scale: 6500 }}
      >
        <ZoomableGroup center={[19.5, 43.0]} zoom={1} minZoom={1} maxZoom={1} disablePanning disableZooming>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill={isDark ? "#0f172a" : "#f1f5f9"} 
                  stroke={isDark ? "#1e293b" : "#cbd5e1"}
                  strokeWidth={0.8}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: isDark ? "#0f172a" : "#f1f5f9", outline: "none" },
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
            const isTopLabel = resort.name === 'Jahorina' || resort.name === 'Bjelašnica';

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g className="cursor-pointer outline-none group" onClick={() => router.push(`/resort/${resort.id}`)}>
                  <circle r="12" fill={s.color} className="animate-ping opacity-20" />
                  <circle r="6" fill={s.color} stroke="white" strokeWidth={2} className="transition-transform group-hover:scale-125" />
                  
                  <text 
                    textAnchor="middle" 
                    y={isTopLabel ? -15 : 22} 
                    className="fill-slate-500 dark:fill-slate-400 text-[10px] font-black uppercase pointer-events-none tracking-tighter"
                  >
                    {resort.name}
                  </text>

                  <g className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    <rect x="-40" y="-55" width="80" height="35" rx="12" fill="#020617" />
                    <text textAnchor="middle" y="-42" className="fill-white text-[9px] font-black uppercase tracking-widest">{snow.toFixed(0)}cm</text>
                    <text textAnchor="middle" y="-30" className="fill-blue-400 text-[7px] font-black uppercase tracking-widest">View Details</text>
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