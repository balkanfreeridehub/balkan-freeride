"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe, onSelect, getStatus }: any) {
  const [hovered, setHovered] = useState<any>(null);

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] dark:bg-[#050b1a]">
      <ComposableMap 
        projection="geoAzimuthalEqualArea" 
        projectionConfig={{ rotate: [-19.5, -42.8, 0], scale: 16000 }} 
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} fill="currentColor" className="text-white dark:text-[#0f172a] outline-none" stroke="#cbd5e1" strokeWidth={0.5} />
          ))}
        </Geographies>
        
        {resorts.map((r: any) => {
          let snow = 0;
          r.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
            if (p > 0 && r.hourly.temperature_2m[i] <= 1) snow += p * 1.2;
          });
          const s = getStatus(snow);

          return (
            <g key={r.id} onMouseEnter={() => setHovered({...r, snow, s})} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
              <Marker coordinates={[r.lon, r.lat]} onClick={() => onSelect(r)}>
                <circle r={8} fill={s.color} stroke="#fff" strokeWidth={2} />
                <text textAnchor="middle" y={20} className="text-[10px] font-black uppercase fill-slate-400 pointer-events-none tracking-tighter">
                  {r.name}
                </text>
              </Marker>

              {hovered?.id === r.id && (
                <foreignObject x={0} y={0} width="1" height="1" style={{ overflow: 'visible' }}>
                  <div className="absolute -translate-x-1/2 -translate-y-[150%] z-[100] pointer-events-none">
                    <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-black/5 flex flex-col items-center min-w-[120px]">
                      <span className="text-[9px] font-black uppercase text-slate-400">{r.name}</span>
                      <span className="text-xl font-black" style={{ color: s.color }}>+{snow.toFixed(1)}cm</span>
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </ComposableMap>
    </div>
  );
}