"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus, lang }: any) {
  const router = useRouter();
  const config = { center: [19.786353, 42.805422], zoom: 2.64 };

  return (
    <div className="w-full h-full cursor-default bg-[#f8fafc] dark:bg-[#020617]">
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ scale: 5000 }} style={{ width: "100%", height: "100%" }}>
        <ZoomableGroup center={config.center as [number, number]} zoom={config.zoom} minZoom={config.zoom} maxZoom={config.zoom} filterZoomEvent={() => {}}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) => geographies.map((geo: any) => (
              <Geography key={geo.rsmKey} geography={geo} className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10 outline-none" />
            ))}
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
            });
            const s = getStatus(snow);
            const isNorth = resort.lat > 43.5;

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g className="cursor-pointer group outline-none" onClick={() => router.push(`/resort/${resort.id}`)}>
                  <circle r="8" fill={s.color} className="opacity-10 animate-pulse" />
                  <circle r="4" fill={s.color} stroke="white" strokeWidth={1.5} />
                  
                  <text textAnchor="middle" y={14} className="text-[7px] font-bold uppercase fill-slate-400 dark:fill-slate-500 pointer-events-none tracking-widest text-center">{resort.name}</text>

                  <foreignObject x="-45" y={isNorth ? 20 : -65} width="90" height="50" className="opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto">
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-xl shadow-xl border border-black/5 dark:border-white/10 flex items-center overflow-hidden">
                      <div className="w-1 self-stretch" style={{ backgroundColor: s.color }} />
                      <div className="px-3 py-2 flex flex-col justify-center">
                        <span className="text-[8px] font-black uppercase text-slate-400 dark:text-white/40 leading-none mb-1 text-left">{resort.name}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-black dark:text-white">{snow.toFixed(0)}</span>
                          <span className="text-[7px] font-bold opacity-30 dark:text-white/30 uppercase">cm</span>
                        </div>
                      </div>
                    </div>
                  </foreignObject>
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}