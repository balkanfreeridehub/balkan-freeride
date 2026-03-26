"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts, timeframe }: { resorts: any[], timeframe: number }) {
  const [hoveredResort, setHoveredResort] = useState<any>(null);

  const getMapMarkerColor = (snow: number) => {
    if (snow >= 100) return '#ef4444'; // JAPAN STYLE
    if (snow >= 50)  return '#9333ea'; // DEEP
    if (snow >= 20)  return '#4f46e5'; // POWDER
    if (snow >= 10)  return '#22c55e'; // RIDEABLE
    if (snow >= 3)   return '#fbbf24'; // MAYBE
    return '#94a3b8';                 // SKIP
  }

  return (
    <div className="relative w-full h-full bg-[#e0f2fe] dark:bg-[#020617] flex items-center justify-center overflow-hidden">
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
                // POJAČAN KONTRAST: Zemlja je svetlija/tamnija od mora
                className="text-[#f1f5f9] dark:text-[#0f172a]"
                stroke="#cbd5e1" // Suptilne ali vidljive granice
                strokeWidth={0.4}
                style={{ default: { outline: "none" } }}
              />
            ))
          }
        </Geographies>
        
        {resorts.map((r, idx) => {
          let calcSnow = 0;
          if (r.hourly) {
            for (let i = 0; i < timeframe; i++) {
              const t_v = r.hourly.temperature_2m[i], p = r.hourly.precipitation[i] || 0;
              if (p > 0 && t_v <= 1) calcSnow += p * (t_v <= -5 ? 1.5 : (t_v <= 0 ? 1.2 : 0.8));
            }
          }

          // Logika za izbegavanje preklapanja (offset za bliske planine)
          const yOffset = idx % 2 === 0 ? -18 : 18;

          return (
            <Marker 
              key={r.id} 
              coordinates={[r.lon, r.lat]}
              onMouseEnter={() => setHoveredResort({ ...r, calcSnow })}
              onMouseLeave={() => setHoveredResort(null)}
            >
              <circle 
                r={8} 
                fill={getMapMarkerColor(calcSnow)}
                stroke="#fff" 
                strokeWidth={2} 
                className="cursor-pointer shadow-xl transition-all duration-300 hover:scale-150" 
              />
              <text 
                textAnchor="middle" 
                y={yOffset} 
                className="font-black uppercase fill-slate-800 dark:fill-slate-200 pointer-events-none transition-opacity" 
                style={{ fontSize: "10px", letterSpacing: "0.05em", filter: "drop-shadow(0px 1px 2px rgba(255,255,255,0.8))" }}
              >
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>

      {/* TOOLTIP NA MAPI */}
      {hoveredResort && (
        <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-900 p-4 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 rounded-2xl animate-in fade-in zoom-in duration-200 z-10">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{hoveredResort.country}</p>
          <p className="text-xl font-black uppercase tracking-tighter mb-2">{hoveredResort.name}</p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[12px] font-black italic">
              +{hoveredResort.calcSnow.toFixed(1)} cm
            </div>
          </div>
        </div>
      )}
    </div>
  )
}