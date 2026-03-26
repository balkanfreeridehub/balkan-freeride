"use client"
import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts, timeframe }: { resorts: any[], timeframe: number }) {
  
  const getMapMarkerColor = (snow: number) => {
    if (snow >= 100) return '#ef4444'; // JAPAN STYLE - Crvena (Kao krug na zastavi)
    if (snow >= 50)  return '#9333ea'; // DEEP POWDER - Ljubičasta
    if (snow >= 20)  return '#4f46e5'; // POWDER DAY - Indigo
    if (snow >= 10)  return '#22c55e'; // RIDEABLE - Zelena
    if (snow >= 3)   return '#fbbf24'; // MAYBE - Žuta
    return '#94a3b8';                 // SKIP - Siva
  }

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
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
                className="text-white dark:text-[#0b1224]"
                stroke="#e2e8f0" // Veoma tanka i svetla granica
                strokeWidth={0.5} 
                style={{ 
                  default: { outline: "none" },
                  hover: { outline: "none" }, // IZBAČEN HOVER EFEKAT
                  pressed: { outline: "none" }
                }}
              />
            ))
          }
        </Geographies>
        
        {resorts.map((r) => {
          if (!r.hourly) return null;
          let calcSnow = 0;
          for (let i = 0; i < timeframe; i++) {
            const t_v = r.hourly.temperature_2m[i], p = r.hourly.precipitation[i] || 0;
            if (p > 0 && t_v <= 1) { 
              calcSnow += p * (t_v <= -5 ? 1.5 : (t_v <= 0 ? 1.2 : 0.8));
            }
          }

          return (
            <Marker key={r.id} coordinates={[r.lon, r.lat]}>
              <circle 
                r={7} 
                fill={getMapMarkerColor(calcSnow)}
                stroke="#fff" 
                strokeWidth={2} 
                className="cursor-pointer shadow-md transition-transform hover:scale-125" 
              />
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}