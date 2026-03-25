"use client"
import React from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

interface Props {
  resorts: any[]
  timeframe: number
}

export default function BalkanMap({ resorts, timeframe }: Props) {
  const getStatusColor = (snow: number) => {
    if (snow >= 100) return '#9333ea'; 
    if (snow >= 50) return '#0f172a';  
    if (snow >= 30) return '#00c853';  
    if (snow >= 10) return '#ffd600';  
    return '#ef4444';                 
  }

  return (
    <div className="w-full h-full bg-slate-100 dark:bg-[#020617] flex items-center justify-center">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-19.5, -43.0, 0], 
          scale: 4800 
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
                className="text-slate-200 dark:text-slate-800/40"
                stroke="currentColor"
                strokeWidth={1}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#3b82f6", outline: "none", transition: "200ms" },
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
              <circle r={6} fill={getStatusColor(snow)} stroke="#fff" strokeWidth={2} className="cursor-pointer" />
              <text
                textAnchor="middle"
                y={-12}
                className="font-black pointer-events-none"
                style={{ 
                  fontSize: "9px", 
                  fill: "#1e293b",
                  textTransform: "uppercase",
                  paintOrder: "stroke",
                  stroke: "#ffffff",
                  strokeWidth: "2.5px"
                }}
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