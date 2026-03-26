"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe, onSelect, getStatus }: { resorts: any[], timeframe: number, onSelect: (resort: any) => void, getStatus: any }) {
  const [hovered, setHovered] = useState<any>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-18.6, -43.4, 0], scale: 13500 }} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) => geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} fill="currentColor" className="text-white dark:text-[#0b1224]" stroke="#cbd5e1" strokeWidth={0.2} style={{ default: { outline: "none" } }} />
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
              <Marker coordinates={[r.lon, r.lat]} onMouseEnter={() => setHovered({ ...r, calcSnow, status })} onMouseLeave={() => setHovered(null)} onClick={() => onSelect(r)} className="cursor-pointer outline-none group">
                <circle r={8} fill={status.color} stroke="#fff" strokeWidth={2} className="transition-all duration-300 group-hover:scale-150 group-hover:stroke-[3px]" />
                <text textAnchor="middle" y={22} className="text-[9px] font-black uppercase fill-slate-500 dark:fill-slate-400 pointer-events-none tracking-tighter shadow-sm">{r.name}</text>
              </Marker>

              {hovered?.id === r.id && (
                <Marker coordinates={[r.lon, r.lat]}>
                  <g transform="translate(-80, -125)">
                    {/* MOST: Veća nevidljiva zona sa pointer-events-auto */}
                    <rect width="160" height="130" fill="transparent" className="pointer-events-auto" onMouseEnter={() => setHovered(hovered)} onMouseLeave={() => setHovered(null)} />
                    <foreignObject width="160" height="110" className="pointer-events-none">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-[2.5rem] flex flex-col items-center pointer-events-auto cursor-pointer border border-black/5 scale-100 animate-in fade-in zoom-in duration-200" onClick={() => onSelect(r)}>
                        <div className="w-10 h-1.5 rounded-full mb-3" style={{ backgroundColor: hovered.status.color }} />
                        <span className="text-[11px] font-black uppercase tracking-tighter text-slate-500">{hovered.name}</span>
                        <span className="text-2xl font-black mt-1" style={{ color: hovered.status.color }}>+{hovered.calcSnow.toFixed(1)}cm</span>
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