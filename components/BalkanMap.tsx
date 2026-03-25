"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function BalkanMap({ resorts }: { resorts: any[] }) {
  return (
    <div className="relative w-full h-[500px] bg-[var(--map-bg)] transition-colors">
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
                className="fill-slate-200 dark:fill-slate-800 stroke-[var(--map-stroke)]"
                strokeWidth={1.2} // Deblje granice za bolji kontrast
                style={{ default: { outline: "none" } }}
              />
            ))
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            <circle r={8} fill="#3b82f6" opacity={0.3} className="animate-ping" />
            <circle r={5} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
            <text textAnchor="middle" y={-18} className="fill-slate-500 dark:fill-slate-400 text-[10px] font-black uppercase tracking-widest">
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}