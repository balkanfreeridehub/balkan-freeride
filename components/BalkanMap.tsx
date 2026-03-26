"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe, onSelect }: { resorts: any[], timeframe: number, onSelect: (resort: any) => void }) {
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

          return (
            <React.Fragment key={r.id}>
              <Marker coordinates={[r.lon, r.lat]} onMouseEnter={() => setHovered({ ...r, calcSnow })} onMouseLeave={() => setHovered(null)} onClick={() => onSelect(r)} className="cursor-pointer">
                <circle r={8} fill={calcSnow > 20 ? "#4f46e5" : "#94a3b8"} stroke="#fff" strokeWidth={2} />
              </Marker>

              {hovered?.id === r.id && (
                <Marker coordinates={[r.lon, r.lat]}>
                  <g transform="translate(-80, -105)">
                    {/* MOST: Nevidljiva zona koja spaja tacku i tooltip */}
                    <rect width="160" height="110" fill="transparent" onMouseEnter={() => setHovered(hovered)} onMouseLeave={() => setHovered(null)} />
                    <foreignObject width="160" height="90" className="pointer-events-none">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 shadow-xl rounded-2xl flex flex-col items-center pointer-events-auto cursor-pointer border border-black/5" onClick={() => onSelect(r)}>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{hovered.name}</span>
                        <span className="text-sm font-black text-blue-600 mt-1">+{hovered.calcSnow.toFixed(1)}cm</span>
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