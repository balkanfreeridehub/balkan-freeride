"use client"
import React from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps"

// Koristimo TopoJSON za Balkan koji smo imali na početku
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json"

interface Props {
  resorts: any[]
  timeframe: number
}

export default function BalkanMap({ resorts, timeframe }: Props) {
  const getStatusColor = (snow: number) => {
    if (snow >= 100) return '#9333ea'; // Japan
    if (snow >= 50) return '#0f172a';  // Extreme
    if (snow >= 30) return '#00c853';  // Powder
    if (snow >= 10) return '#ffd600';  // Rideable
    return '#ef4444';                 // Skip
  }

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-20.0, -43.0, 0],
          scale: 3500
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
                className="text-slate-200 dark:text-slate-800/50"
                stroke="#FFFFFF"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        
        {resorts.map((r) => {
          if (!r.hourly) return null;
          let snow = 0;
          for (let j = 0; j < timeframe; j++) {
            const t = r.hourly.temperature_2m[j];
            const p = r.hourly.precipitation[j] || 0;
            if (p > 0 && t <= 0) snow += p;
          }

          return (
            <Marker key={r.id} coordinates={[r.lon, r.lat]}>
              <circle 
                r={6} 
                fill={getStatusColor(snow)} 
                stroke="#fff" 
                strokeWidth={2} 
                className="cursor-pointer transition-transform hover:scale-150"
              />
              <text
                textAnchor="middle"
                y={-12}
                style={{ fontSize: "8px", fontWeight: "bold", fill: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}
              >
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}