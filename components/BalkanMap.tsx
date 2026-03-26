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
              <Marker coordinates={[r.lon, r.lat]} onMouseEnter={() => setHovered({ ...r, calcSnow, status })} onMouseLeave={() => setHovered(null)} onClick={() => onSelect(r)} className="cursor-pointer outline-none">
                <circle r={8} fill={status.color} stroke="#fff" strokeWidth={2} className="transition-transform duration-300 hover:scale-125" />
                <text textAnchor="middle" y={20} className="text-[8px] font-black uppercase fill-slate-400 pointer-events-none">{r.name}</text>
              </Marker>

              {hovered?.id === r.id && (
                <Marker coordinates={[r.lon, r.lat]}>
                  <g transform="translate(-80, -110)">
                    {/* MOST - Spaja tacku i tooltip */}
                    <rect width="160" height="120" fill="transparent" onMouseEnter={() => setHovered(hovered)} onMouseLeave={() => setHovered(null)} />
                    <foreignObject width="160" height="100" className="pointer-events-none">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl rounded-[2rem] flex flex-col items-center pointer-events-auto cursor-pointer border border-black/5 transition-all" onClick={() => onSelect(r)}>
                        <div className="w-8 h-1 rounded-full mb-2" style={{ backgroundColor: hovered.status.color }} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{hovered.name}</span>
                        <span className="text-lg font-black mt-1" style={{ color: hovered.status.color }}>+{hovered.calcSnow.toFixed(1)}cm</span>
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