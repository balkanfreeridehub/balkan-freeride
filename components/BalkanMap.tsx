"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe }: { resorts: any[], timeframe: number }) {
  const [hovered, setHovered] = useState<any>(null);

  const getMapMarkerColor = (snow: number) => {
    if (snow >= 100) return '#ef4444'; 
    if (snow >= 50)  return '#9333ea'; 
    if (snow >= 20)  return '#4f46e5'; 
    if (snow >= 10)  return '#22c55e'; 
    return '#94a3b8';
  }

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] dark:bg-[#020617] flex items-center justify-center overflow-hidden">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        // FIKSIRAN ZOOM 13500 I KOORDINATE CENTRA
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

          return (
            <Marker 
              key={r.id} 
              coordinates={[r.lon, r.lat]}
              onMouseEnter={() => setHovered({ ...r, calcSnow })}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              <circle r={6} fill={getMapMarkerColor(calcSnow)} stroke="#fff" strokeWidth={2} className="transition-all hover:scale-150 shadow-md" />
              <text 
                textAnchor="middle" 
                y={isJahorina ? -15 : 20} // Jahorina iznad, ostali ispod
                className="font-black uppercase fill-slate-800 dark:fill-slate-200 pointer-events-none tracking-tighter" 
                style={{ fontSize: "11px", filter: "drop-shadow(0px 1px 2px rgba(255,255,255,1))" }}
              >
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>

      {hovered && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[130%] pointer-events-none z-20">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-0.5">{hovered.country}</span>
            <span className="text-lg font-black uppercase tracking-tighter">{hovered.name}</span>
            <div className="mt-2 px-3 py-0.5 bg-blue-600 text-white rounded-full text-[11px] font-black italic">
              +{hovered.calcSnow.toFixed(1)} cm
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 rotate-45 border-r border-b border-black/5 dark:border-white/10"></div>
          </div>
        </div>
      )}
    </div>
  )
}