"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();

  return (
    <div className="w-full h-full bg-[#f8fafc] dark:bg-[#020617] overflow-hidden">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        // Optimizovano da hvata Jahorinu do Mavrova u fokusu
        projectionConfig={{ rotate: [-19.5, -42.6, 0], scale: 7500 }}
      >
        <ZoomableGroup center={[19.5, 42.6]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="currentColor" 
                  className="text-slate-200 dark:text-slate-800/50 outline-none transition-colors"
                  stroke="currentColor"
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
                <g 
                  onClick={() => router.push(`/resort/${resort.id}`)} 
                  className="cursor-pointer outline-none group"
                >
                  {/* Animirani Marker */}
                  <circle r="6" fill={s.color} className="animate-pulse opacity-40" />
                  <circle r="4" fill={s.color} stroke="white" strokeWidth="2" className="transition-transform group-hover:scale-150" />
                  
                  {/* Tooltip na hover */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <rect x="-30" y="-35" width="60" height="20" rx="10" fill="black" />
                    <text 
                      textAnchor="middle" 
                      y="-21" 
                      className="fill-white text-[9px] font-black uppercase tracking-tighter"
                    >
                      {resort.name}
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