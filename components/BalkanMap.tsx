"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function BalkanMap({ resorts }: { resorts: any[] }) {
  return (
    <div className="relative w-full h-[500px] bg-slate-50 dark:bg-slate-950 transition-colors">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [20, 44], scale: 3500 }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                className="fill-slate-200 dark:fill-slate-800/50 stroke-slate-300 dark:stroke-slate-700"
                strokeWidth={1.5}
                style={{ default: { outline: "none" } }}
              />
            ))
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            <circle r={10} fill="#3b82f6" opacity={0.2} className="animate-ping" />
            <circle r={6} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
            <text textAnchor="middle" y={-18} className="fill-slate-400 dark:fill-slate-500 text-[10px] font-black uppercase tracking-widest pointer-events-none">
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}