"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe, onSelect, getStatus }: { resorts: any[], timeframe: number, onSelect: (resort: any) => void, getStatus: any }) {
  const [hovered, setHovered] = useState<any>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-200 dark:bg-[#050b1a]">
      <ComposableMap 
        projection="geoAzimuthalEqualArea" 
        // Centrirano na Balkan (Kolašin region) da se vide i MK planine
        projectionConfig={{ rotate: [-19.5, -42.5, 0], scale: 14000 }} 
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => (
            <Geography 
              key={geo.rsmKey} 
              geography={geo} 
              fill="currentColor" 
              // Jači kontrast pozadine
              className="text-white dark:text-[#0f172a]" 
              stroke="#64748b" 
              strokeWidth={0.5} 
              style={{ default: { outline: "none" } }} 
            />
          ))}
        </Geographies>
        
        {resorts.map((r) => {
          let calcSnow = 0;
          if (r?.hourly?.precipitation) {
            for (let i = 0; i < timeframe; i++) {
              if (r.hourly.precipitation[i] > 0 && r.hourly.temperature_2m[i] <= 1) calcSnow += r.hourly.precipitation[i] * 1.2;
            }
          }
          const status = getStatus(calcSnow);

          return (
            <React.Fragment key={r.id}>
              <Marker 
                coordinates={[r.lon, r.lat]} 
                onMouseEnter={() => setHovered({ ...r, calcSnow, status })} 
                onMouseLeave={() => setHovered(null)} 
                onClick={() => onSelect(r)} 
                className="cursor-pointer outline-none group"
              >
                <circle r={9} fill={status.color} stroke="#fff" strokeWidth={2.5} className="transition-all duration-300 group-hover:scale-150" />
                {/* Ime planine - fiksno, bez promene boje na hover */}
                <text textAnchor="middle" y={24} className="text-[10px] font-black uppercase fill-slate-600 dark:fill-slate-400 pointer-events-none tracking-tighter">
                  {r.name}
                </text>
              </Marker>

              {hovered?.id === r.id && (
                <Marker coordinates={[r.lon, r.lat]}>
                  <g transform="translate(-80, -135)">
                    {/* Nevidljivi most koji omogućava prelazak miša na tooltip */}
                    <rect width="160" height="140" fill="transparent" className="pointer-events-auto" onMouseEnter={() => setHovered(hovered)} onMouseLeave={() => setHovered(null)} />
                    <foreignObject width="160" height="120" style={{ overflow: 'visible' }}>
                      <div 
                        className="bg-white dark:bg-slate-900 p-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)] rounded-[2.5rem] flex flex-col items-center pointer-events-auto cursor-pointer border-2 border-slate-100 dark:border-white/5 animate-in fade-in zoom-in duration-150" 
                        onClick={() => onSelect(r)}
                      >
                        <div className="w-12 h-1.5 rounded-full mb-3" style={{ backgroundColor: hovered.status.color }} />
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{hovered.name}</span>
                        <span className="text-3xl font-black mt-1 tabular-nums" style={{ color: hovered.status.color }}>
                          +{hovered.calcSnow.toFixed(1)}
                        </span>
                        <span className="text-[8px] font-bold uppercase opacity-50">Click for details</span>
                      </div>
                    </foreignObject>
                  </g>
                </Marker>
              )}
            </React.Fragment>
          )
        })}
      </ComposableMap>
    </div>
  )
}