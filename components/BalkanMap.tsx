"use client"
import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

// TopoJSON sa boljim granicama Evrope
const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts, timeframe }: { resorts: any[], timeframe: number }) {
  
  // Dinamička boja na mapi na osnovu količine snega
  const getMapMarkerColor = (snow: number) => {
    if (snow >= 100) return '#fbbf24'; // Japan Style - Zlatna
    if (snow >= 50)  return '#9333ea'; // Deep Powder - Ljubičasta
    if (snow >= 20)  return '#4f46e5'; // Powder Day - Indigo
    if (snow >= 10)  return '#22c55e'; // Rideable - Zelena
    if (snow >= 3)   return '#f59e0b'; // Maybe - Narandžasta
    return '#ef4444';                 // Skip - Crvena
  }

  return (
    <div className="w-full h-full bg-slate-100 dark:bg-[#020617] flex items-center justify-center">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-19.5, -42.8, 0], // Centrirano na Balkan
          scale: 12500 // Zoom
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="currentColor"
                // JASNIE GRANICE DRŽAVA
                className="text-white dark:text-[#020617]" // Boja unutrašnjosti
                stroke="#d1d5db" // Jaka siva boja granice
                strokeWidth={1.5} // Debljina granice
                style={{ 
                  default: { outline: "none" }, 
                  hover: { fill: "#e5e7eb", outline: "none" } 
                }}
              />
            ))
          }
        </Geographies>
        
        {resorts.map((r) => {
          if (!r.hourly) return null;
          let calcSnow = 0;
          if (r.hourly) {
            for (let i = 0; i < timeframe; i++) {
              const t_v = r.hourly.temperature_2m[i], p = r.hourly.precipitation[i] || 0;
              if (p > 0 && t_v <= 1) { 
                const ratio = t_v <= -5 ? 1.5 : (t_v <= 0 ? 1.2 : 0.8);
                calcSnow += p * ratio;
              }
            }
          }

          return (
            <Marker key={r.id} coordinates={[r.lon, r.lat]}>
              <circle 
                r={6} 
                fill={getMapMarkerColor(calcSnow)} // Dinamička boja markera
                stroke="#fff" 
                strokeWidth={2} 
                className="cursor-pointer shadow-lg hover:scale-110 transition-transform" 
              />
              <text textAnchor="middle" y={-12} className="font-bold uppercase fill-slate-900 dark:fill-slate-100 opacity-60 pointer-events-none" style={{ fontSize: "8px" }}>
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}