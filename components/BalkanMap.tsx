"use client"
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-[#f1f5f9] dark:bg-[#0f172a] relative cursor-grab active:cursor-grabbing">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-19.0, -43.5, 0], scale: 8000 }} // DUPLO VEĆI ZOOM
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[19.5, 43.5]} zoom={1} minZoom={1} maxZoom={4}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e2e8f0"
                  stroke="#cbd5e1"
                  strokeWidth={0.5}
                  className="dark:fill-slate-800 dark:stroke-slate-700 outline-none"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#e2e8f0" }, // SKLONJEN HOVER PREKO DRŽAVA
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 2.0; // MALO JAČA MATEMATIKA ZA SNEG
            });
            const s = getStatus(snow);

            return (
              <Marker 
                key={resort.id} 
                coordinates={[resort.lon, resort.lat]}
                onMouseEnter={() => setHovered(resort.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/resort/${resort.id}`)}
              >
                <circle r="12" fill={s.color} className="animate-ping" opacity="0.15" />
                <circle r="5" fill={s.color} stroke="white" strokeWidth="2" className="shadow-2xl" />
                
                {/* Stalno vidljivo ime planine */}
                <text textAnchor="middle" y={15} className="fill-slate-400 dark:fill-slate-500 text-[8px] font-bold uppercase tracking-tighter pointer-events-none">
                  {resort.name}
                </text>

                {hovered === resort.id && (
                  <g transform="translate(0, -35)">
                    <rect x="-35" y="-20" width="70" height="28" rx="8" fill="#0f172a" />
                    <text textAnchor="middle" y="-2" fill="white" fontSize="9" fontWeight="900" className="uppercase tracking-widest">
                      {resort.name}
                    </text>
                    <text textAnchor="middle" y="10" fill={s.color} fontSize="11" fontWeight="900" italic="true">
                      +{snow.toFixed(0)}cm
                    </text>
                  </g>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}