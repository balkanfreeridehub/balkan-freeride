"use client"
import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

export default function BalkanMap({ resorts, timeframe }: { resorts: any[], timeframe: number }) {
  return (
    <div className="w-full h-full bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-19.5, -42.8, 0], // Malo "južnije" centrirano
          scale: 8500 // Još veći zoom
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
                className="text-slate-200 dark:text-slate-800/20"
                stroke="currentColor"
                strokeWidth={0.5}
                style={{ 
                  default: { outline: "none" }, 
                  hover: { outline: "none" }, // Sklonjen hover plavi efekat
                  pressed: { outline: "none" } 
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
              <circle r={5} fill={snow >= 30 ? '#22c55e' : (snow >= 5 ? '#eab308' : '#ef4444')} stroke="#fff" strokeWidth={1.5} />
              <text textAnchor="middle" y={-10} className="font-bold uppercase fill-slate-400 dark:fill-slate-500" style={{ fontSize: "7px" }}>
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}