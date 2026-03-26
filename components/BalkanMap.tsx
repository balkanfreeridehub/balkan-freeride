"use client"
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-[#f1f5f9] dark:bg-[#020617] relative">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-20.5, -42.8, 0], scale: 11000 }} // EXPERT ZOOM ZA BALKAN
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[20.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
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
                  style={{ default: { outline: "none" }, hover: { outline: "none" } }}
                />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 2.5; // POJAČAN SNEG
            });
            const s = getStatus(snow);

            return (
              <Marker 
                key={resort.id} 
                coordinates={[resort.lon, resort.lat]}
                onMouseEnter={() => setHovered(resort.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/resort/${resort.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <circle r="10" fill={s.color} className="animate-ping" opacity="0.1" />
                <circle r="4" fill={s.color} stroke="white" strokeWidth="2" />
                
                {/* Ime planine - fiksno, nema promene boje na hover */}
                <text textAnchor="middle" y={14} className="fill-slate-500 dark:fill-slate-400 text-[7px] font-black uppercase pointer-events-none">
                  {resort.name}
                </text>

                {hovered === resort.id && (
                  <g transform="translate(0, -30)">
                    <rect x="-30" y="-22" width="60" height="24" rx="6" fill="white" className="shadow-xl" />
                    <path d="M-5 2 L0 7 L5 2 Z" fill="white" />
                    <text textAnchor="middle" y="-6" fill="#0f172a" fontSize="8" fontWeight="900" className="uppercase">
                      {snow.toFixed(0)}cm
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