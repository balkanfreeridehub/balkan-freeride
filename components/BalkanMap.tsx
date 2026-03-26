"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe, onSelect }: { resorts: any[], timeframe: number, onSelect: (resort: any) => void }) {
  const [hovered, setHovered] = useState<any>(null);

  const getSnowColor = (snow: number) => {
    if (snow >= 100) return '#ef4444';
    if (snow >= 50)  return '#9333ea';
    if (snow >= 20)  return '#4f46e5';
    if (snow >= 10)  return '#22c55e';
    return '#94a3b8';
  }

  return (
    <div className="relative w-full h-full bg-slate-100 dark:bg-[#020617] flex items-center justify-center">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-18.6, -43.4, 0], scale: 13500 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="currentColor" className="text-white dark:text-[#0b1224]" stroke="#cbd5e1" strokeWidth={0.2} style={{ default: { outline: "none" } }} />
            ))
          }
        </Geographies>
        
        {resorts.map((r) => {
          let calcSnow = 0;
          if (r?.hourly?.precipitation) {
            for (let i = 0; i < Math.min(timeframe, r.hourly.precipitation.length); i++) {
              const t = r.hourly.temperature_2m[i], p = r.hourly.precipitation[i] || 0;
              if (p > 0 && t <= 1) calcSnow += p * (t <= -5 ? 1.5 : (t <= 0 ? 1.2 : 0.8));
            }
          }
          const color = getSnowColor(calcSnow);

          return (
            <React.Fragment key={r.id}>
              <Marker 
                coordinates={[r.lon, r.lat]}
                onMouseEnter={() => setHovered({ ...r, calcSnow, color })}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(r)}
                className="cursor-pointer outline-none"
              >
                <circle r={8} fill={color} stroke="#fff" strokeWidth={2} className="transition-transform duration-300 hover:scale-125" />
              </Marker>

              {hovered?.id === r.id && (
                <Marker coordinates={[r.lon, r.lat]}>
                  <g transform="translate(-80, -110)">
                    {/* Transparentni most za miš */}
                    <rect width="160" height="110" fill="transparent" onMouseEnter={() => setHovered(hovered)} onMouseLeave={() => setHovered(null)} />
                    <foreignObject width="160" height="100" className="pointer-events-none">
                      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-black/5 p-3 shadow-xl rounded-2xl flex flex-col items-center pointer-events-auto cursor-pointer" onClick={() => onSelect(r)}>
                        <div className="w-8 h-1 rounded-full mb-2" style={{ backgroundColor: hovered.color }} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{hovered.name}</span>
                        <span className="text-sm font-black mt-1" style={{ color: hovered.color }}>+{hovered.calcSnow.toFixed(1)}cm</span>
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