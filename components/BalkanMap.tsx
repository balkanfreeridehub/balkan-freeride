"use client"
import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ coordinates: [19.0, 42.5], zoom: 1 });

  useEffect(() => setMounted(true), []);

  function handleMoveEnd(newPosition: any) {
    setPosition(newPosition);
    console.log("MAPA - Center:", newPosition.coordinates, "Zoom:", newPosition.zoom);
  }

  if (!mounted) return <div className="w-full h-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-3xl" />;

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ scale: 5000 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup 
          center={position.coordinates as [number, number]} 
          zoom={position.zoom}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700 outline-none"
                />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            const s = getStatus(0); // Ovde ide tvoja logika za sneg po timeframe-u
            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g 
                  className="cursor-pointer group outline-none" 
                  onClick={() => router.push(`/resort/${resort.id}`)}
                >
                  <circle r="6" fill={s.color} className="animate-pulse opacity-40" />
                  <circle r="3" fill={s.color} stroke="white" strokeWidth={1.5} />
                  
                  <text 
                    textAnchor="middle" 
                    y={14} 
                    className="fill-slate-500 dark:fill-slate-400 text-[9px] font-bold uppercase pointer-events-none"
                  >
                    {resort.name}
                  </text>

                  {/* Veći InfoBox Tooltip */}
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <rect x="-45" y="-55" width="90" height="40" rx="6" fill="#020617" />
                    <text textAnchor="middle" y="-40" fill="white" className="text-[9px] font-bold">{resort.name}</text>
                    <text textAnchor="middle" y="-25" fill="#3b82f6" className="text-[8px]">KLIKNI ZA DETALJE</text>
                  </g>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/80 p-2 text-[10px] rounded border border-slate-200 dark:border-slate-800">
        Centriraj mapu mišem, pa javi koordinate iz konzole.
      </div>
    </div>
  );
}