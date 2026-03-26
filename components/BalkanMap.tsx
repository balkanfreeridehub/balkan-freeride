"use client"
import React, { useState } from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts = [], timeframe }: { resorts: any[], timeframe: number }) {
  const [hovered, setHovered] = useState<any>(null);

  const getMapMarkerColor = (snow: number) => {
    if (snow >= 100) return '#ef4444'; // Crvena - Japan Style
    if (snow >= 50)  return '#9333ea'; // Ljubičasta
    if (snow >= 20)  return '#4f46e5'; // Indigo
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

          return (
            <Marker 
              key={r.id} 
              coordinates={[r.lon, r.lat]}
              onMouseEnter={(e) => {
                // Uzimamo koordinate miša da bi tooltip bio tačno iznad tačke
                setHovered({ ...r, calcSnow });
              }}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer outline-none"
            >
              <circle r={6} fill={getMapMarkerColor(calcSnow)} stroke="#fff" strokeWidth={2} className="transition-all duration-300 hover:scale-[1.8] hover:stroke-blue-400" />
              <text 
                textAnchor="middle" 
                y={isJahorina ? -18 : 22} 
                className="font-black uppercase fill-slate-800 dark:fill-slate-200 pointer-events-none tracking-tighter select-none" 
                style={{ fontSize: "10px", filter: "drop-shadow(0px 1px 1px rgba(255,255,255,0.5))" }}
              >
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>

      {/* NOVI APPLE TOOLTIP (Sada je fiksiran u odnosu na kontejner ali centriran) */}
      {hovered && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
           <div className="animate-in fade-in zoom-in-90 slide-in-from-bottom-4 duration-300 ease-out">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/5 dark:border-white/10 p-4 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] flex flex-col items-center min-w-[140px]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mb-2 animate-pulse" />
                <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase mb-1">{hovered.country}</span>
                <span className="text-xl font-black tracking-tighter uppercase leading-none">{hovered.name}</span>
                <div className="mt-3 flex items-center gap-2 border-t border-black/5 dark:border-white/5 pt-2 w-full justify-center">
                    <span className="text-[10px] font-bold opacity-40 uppercase">Forecast</span>
                    <span className="text-sm font-black text-blue-600">+{hovered.calcSnow.toFixed(1)} cm</span>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}