"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe, onSelect, getStatus }: any) {
  const [hovered, setHovered] = useState<any>(null);

  return (
    <div className="relative w-full h-full bg-slate-200 dark:bg-[#050b1a] overflow-hidden">
      <ComposableMap 
        projection="geoAzimuthalEqualArea" 
        // Rotacija -41.0 spušta mapu niže (centrira MK i CG bolje)
        projectionConfig={{ rotate: [-19.5, -41.0, 0], scale: 12500 }} 
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => (
            <Geography 
              key={geo.rsmKey} 
              geography={geo} 
              fill="currentColor" 
              className="text-white dark:text-[#0f172a] outline-none" 
              stroke="#64748b" 
              strokeWidth={0.5} 
            />
          ))}
        </Geographies>
        
        {resorts.map((r: any) => {
          let snow = 0;
          if (r?.hourly?.precipitation) {
            for (let i = 0; i < timeframe; i++) {
              if (r.hourly.precipitation[i] > 0 && r.hourly.temperature_2m[i] <= 1) snow += r.hourly.precipitation[i] * 1.2;
            }
          }
          const s = getStatus(snow);

          return (
            <g key={r.id} onMouseEnter={() => setHovered({...r, snow, s})} onMouseLeave={() => setHovered(null)}>
              {/* Nevidljiva zona klika oko markera */}
              <circle cx={0} cy={0} r={20} fill="transparent" className="cursor-pointer" />
              
              <Marker coordinates={[r.lon, r.lat]} onClick={() => onSelect(r)} className="cursor-pointer outline-none">
                <circle r={10} fill={s.color} stroke="#fff" strokeWidth={3} className="transition-transform hover:scale-150" />
                <text textAnchor="middle" y={25} className="text-[10px] font-black uppercase fill-slate-500 pointer-events-none">
                  {r.name}
                </text>
              </Marker>

              {hovered?.id === r.id && (
                <g transform="translate(0, -10)" onClick={() => onSelect(r)} className="cursor-pointer">
                  {/* Invisible bridge da hover ne nestane dok idete ka tooltipu */}
                  <rect x="-60" y="-100" width="120" height="100" fill="transparent" />
                  <foreignObject x="-75" y="-120" width="150" height="100" style={{ overflow: 'visible' }}>
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-2xl border border-black/5 flex flex-col items-center animate-in fade-in zoom-in duration-200">
                       <div className="w-8 h-1 rounded-full mb-2" style={{ backgroundColor: s.color }} />
                       <span className="text-[10px] font-black uppercase text-slate-400">{r.name}</span>
                       <span className="text-2xl font-black tabular-nums" style={{ color: s.color }}>+{snow.toFixed(1)}cm</span>
                    </div>
                  </foreignObject>
                </g>
              )}
            </g>
          );
        })}
      </ComposableMap>
    </div>
  );
}