"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe }: { resorts: any[], timeframe: number }) {
  const [hovered, setHovered] = useState<any>(null);

  const getMapMarkerColor = (snow: number) => {
    if (snow >= 100) return '#ef4444'; // JAPAN STYLE
    if (snow >= 50)  return '#9333ea'; 
    if (snow >= 20)  return '#4f46e5'; 
    if (snow >= 10)  return '#22c55e'; 
    if (snow >= 3)   return '#fbbf24'; 
    return '#94a3b8';
  }

  return (
    <div className="relative w-full h-full bg-[#cbd5e1] dark:bg-[#020617] flex items-center justify-center overflow-hidden">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{ rotate: [-19.5, -42.8, 0], scale: 13500 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="currentColor"
                // KONTRAST: Svetlo sivo kopno na plavom moru (Light) / Tamno plavo na crnom (Dark)
                className="text-[#f8fafc] dark:text-[#0f172a]"
                stroke="#94a3b8" 
                strokeWidth={0.3}
                style={{ default: { outline: "none" } }}
              />
            ))
          }
        </Geographies>
        
        {resorts.map((r, idx) => {
          let calcSnow = 0;
          if (r?.hourly?.precipitation) {
            for (let i = 0; i < Math.min(timeframe, r.hourly.precipitation.length); i++) {
              const t = r.hourly.temperature_2m[i], p = r.hourly.precipitation[i] || 0;
              if (p > 0 && t <= 1) calcSnow += p * (t <= -5 ? 1.5 : (t <= 0 ? 1.2 : 0.8));
            }
          }

          return (
            <Marker 
              key={r.id || idx} 
              coordinates={[r.lon, r.lat]}
              onMouseEnter={() => setHovered({ ...r, calcSnow })}
              onMouseLeave={() => setHovered(null)}
            >
              <circle r={8} fill={getMapMarkerColor(calcSnow)} stroke="#fff" strokeWidth={2} className="cursor-pointer transition-all hover:scale-150" />
              <text 
                textAnchor="middle" 
                y={idx % 2 === 0 ? -18 : 22} // Sprečava preklapanje imena
                className="font-black uppercase fill-slate-800 dark:fill-slate-200 pointer-events-none" 
                style={{ fontSize: "11px", letterSpacing: "0.05em", filter: "drop-shadow(0px 1px 1px rgba(255,255,255,0.5))" }}
              >
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>

      {hovered && (
        <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-900 p-4 shadow-2xl rounded-2xl border dark:border-white/10 animate-in fade-in zoom-in duration-200">
          <p className="text-xl font-black uppercase tracking-tighter">{hovered.name}</p>
          <p className="text-blue-600 font-black italic">+{hovered.calcSnow.toFixed(1)} cm</p>
        </div>
      )}
    </div>
  )
}