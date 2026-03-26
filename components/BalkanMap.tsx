"use client"
import React from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function BalkanMap({ resorts, timeframe, getStatus, config }: any) {
  const router = useRouter();

  return (
    <div className="w-full h-full cursor-default">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ scale: 5000 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Isključeni filteri za pomeranje i zumiranje */}
        <ZoomableGroup 
          center={config.center} 
          zoom={config.zoom}
          minZoom={config.zoom}
          maxZoom={config.zoom}
          filterZoomEvent={() => {}} // Onemogućava scroll zoom
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="fill-slate-100 dark:fill-white/5 stroke-slate-200 dark:stroke-white/10 outline-none"
                />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p:number, i:number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
            });
            const s = getStatus(snow);

            return (
              <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
                <g 
                  className="cursor-pointer group outline-none" 
                  onClick={() => router.push(`/resort/${resort.id}`)}
                >
                  {/* Veći marker sa pulse efektom */}
                  <circle r="12" fill={s.color} className="opacity-20 animate-ping" />
                  <circle r="5" fill={s.color} stroke="white" strokeWidth={2} />
                  
                  {/* Premium InfoBox Tooltip */}
                  <foreignObject x="-60" y="-85" width="120" height="70" className="pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-2">
                    <div className="bg-black/90 dark:bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/20 dark:border-black/10 flex flex-col items-center">
                      <span className="text-[10px] font-black uppercase text-white dark:text-black mb-1">{resort.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-blue-500">{snow.toFixed(0)}</span>
                        <span className="text-[8px] font-bold text-white/50 dark:text-black/40 uppercase">cm Snow</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 dark:bg-black/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '70%' }}></div>
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