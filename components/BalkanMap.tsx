"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe }: { resorts: any[], timeframe: number }) {
  const [hovered, setHovered] = useState<any>(null);

  const getSnowColor = (snow: number) => {
    if (snow >= 100) return '#ef4444'; // Japan Style
    if (snow >= 50)  return '#9333ea'; // Deep
    if (snow >= 20)  return '#4f46e5'; // Powder
    if (snow >= 10)  return '#22c55e'; // Rideable
    return '#94a3b8';
  }

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] dark:bg-[#020617] flex items-center justify-center overflow-hidden">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-18.6, -43.4, 0], scale: 13500 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="currentColor"
                className="text-white dark:text-[#0b1224]"
                stroke="#cbd5e1" 
                strokeWidth={0.2}
                style={{ default: { outline: "none" } }}
              />
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

          const isJahorina = r.name.toLowerCase().includes('jahorina');
          const color = getSnowColor(calcSnow);

          return (
            <React.Fragment key={r.id}>
              <Marker 
                coordinates={[r.lon, r.lat]}
                onMouseEnter={() => setHovered({ ...r, calcSnow, color })}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer outline-none group"
              >
                <circle r={6} fill={color} stroke="#fff" strokeWidth={2} className="transition-all duration-300 group-hover:scale-[1.8]" />
                <text textAnchor="middle" y={isJahorina ? -18 : 22} className="font-black uppercase fill-slate-800 dark:fill-slate-200 pointer-events-none tracking-tighter text-[10px]">
                  {r.name}
                </text>
              </Marker>

              {/* TOOLTIP IZNAD MARKERA */}
              {hovered?.id === r.id && (
                <Marker coordinates={[r.lon, r.lat]}>
                  <g transform="translate(-100, -140)">
                    <foreignObject width="200" height="120">
                      <div className="animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 p-4 shadow-2xl rounded-[1.5rem] flex flex-col items-center">
                          <div className="w-10 h-1 rounded-full mb-3" style={{ backgroundColor: hovered.color }} />
                          <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase mb-1">{hovered.country}</span>
                          <span className="text-lg font-black tracking-tighter uppercase leading-none mb-3">{hovered.name}</span>
                          <div className="bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl w-full text-center">
                             <span className="text-sm font-black" style={{ color: hovered.color }}>+{hovered.calcSnow.toFixed(1)} cm</span>
                          </div>
                        </div>
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