"use client"
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
        projectionConfig={{ 
          rotate: [-19.0, -42.5, 0], // Centrirano bliže Kolašinu
          scale: 6000 
        }}
      >
        <ZoomableGroup center={[19.0, 42.5]} zoom={1} minZoom={1} maxZoom={1} disablePanning disableZooming>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill={isDark ? "#0f172a" : "#f1f5f9"} 
                  stroke={isDark ? "#1e293b" : "#cbd5e1"}
                  strokeWidth={0.5}
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
            // Jahorina i Bjelašnica su blizu, Jahorinu dižemo gore
            const isJahorina = resort.name === 'Jahorina';

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g className="cursor-pointer outline-none group" onClick={() => router.push(`/resort/${resort.id}`)}>
                  <circle r="10" fill={s.color} className="animate-ping opacity-20" />
                  <circle r="5" fill={s.color} stroke="white" strokeWidth={2} />
                  
                  <text 
                    textAnchor="middle" 
                    y={isJahorina ? -12 : 18} 
                    className="fill-slate-500 dark:fill-slate-400 text-[9px] font-bold uppercase pointer-events-none tracking-tighter"
                  >
                    {resort.name}
                  </text>

                  {/* Info Box na Hover */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <rect x="-30" y="-45" width="60" height="25" rx="8" fill="#020617" />
                    <text textAnchor="middle" y="-28" className="fill-white text-[8px] font-black">{snow.toFixed(0)}cm</text>
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