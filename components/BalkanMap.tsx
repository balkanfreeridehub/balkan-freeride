"use client"
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

// Pouzdaniji URL za mapu
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="w-full h-full bg-[#f1f5f9] dark:bg-[#0f172a] relative">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-20.0, -43.0, 0], scale: 5000 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[20, 43]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Filtriramo samo Balkan/Evropu radi brzine
                const isBalkan = ["SRB", "BIH", "MNE", "MKD", "ALB", "HRV", "SVN", "ROU", "BGR"].includes(geo.properties.iso_a3);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isBalkan ? "#e2e8f0" : "#f8fafc"}
                    stroke="#cbd5e1"
                    strokeWidth={0.5}
                    className="dark:fill-slate-800 dark:stroke-slate-700 outline-none transition-colors"
                    style={{
                      hover: { fill: "#A855F7", opacity: 0.2 },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
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
                <g transform="translate(-12, -24)">
                  <circle r="14" fill={s.color} className="animate-ping" opacity="0.2" />
                  <circle r="6" fill={s.color} stroke="white" strokeWidth="2" shadow-xl="true" />
                </g>
                
                {hovered === resort.id && (
                  <g transform="translate(0, -45)">
                    <rect x="-40" y="-25" width="80" height="35" rx="10" fill="black" opacity="0.8" />
                    <text textAnchor="middle" fill="white" fontSize="10" fontWeight="900" className="uppercase">
                      {resort.name}
                    </text>
                    <text textAnchor="middle" y="8" fill={s.color} fontSize="12" fontWeight="900">
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