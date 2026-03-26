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
        projectionConfig={{ rotate: [-20.5, -42.8, 0], scale: 12000 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[20.5, 42.8]} zoom={1} minZoom={1} maxZoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} className="dark:fill-slate-800 dark:stroke-slate-700 outline-none" />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 2.5;
            });
            const s = getStatus(snow);
            const isJahorina = resort.name === "Jahorina";

            return (
              <Marker 
                key={resort.id} 
                coordinates={[resort.lon, resort.lat]}
                onMouseEnter={() => setHovered(resort.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/resort/${resort.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <circle r="12" fill={s.color} className="animate-ping" opacity="0.1" />
                <circle r="5" fill={s.color} stroke="white" strokeWidth="2" />
                
                <text 
                  textAnchor="middle" 
                  y={isJahorina ? -15 : 18} // JAHORINA IZNAD, OSTALI ISPOD
                  className="fill-slate-700 dark:fill-slate-200 text-[10px] font-black uppercase tracking-tighter pointer-events-none"
                >
                  {resort.name}
                </text>

                {hovered === resort.id && (
                  <g transform="translate(0, -45)">
                    <rect x="-45" y="-30" width="90" height="40" rx="10" fill="white" className="shadow-2xl" />
                    <rect x="-45" y="-30" width="90" height="10" rx="4" fill={s.color} />
                    <text textAnchor="middle" y="-5" fill="#0f172a" fontSize="12" fontWeight="900" className="uppercase font-sans">
                      {snow.toFixed(0)}cm
                    </text>
                    <text textAnchor="middle" y="6" fill={s.color} fontSize="7" fontWeight="900" className="uppercase tracking-widest">
                      {s.txt}
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