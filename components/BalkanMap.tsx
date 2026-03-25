"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function BalkanMap({ resorts }: { resorts: any[] }) {
  return (
    <div className="relative w-full h-[450px] bg-blue-100 dark:bg-slate-950">
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
                fill="currentColor"
                className="text-white dark:text-slate-900 stroke-blue-200 dark:stroke-blue-900/50"
                strokeWidth={1}
                style={{ default: { outline: "none" } }}
              />
            ))
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            <circle r={8} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
            <text textAnchor="middle" y={-15} className="fill-slate-400 dark:fill-slate-500 text-[9px] font-bold uppercase tracking-tighter pointer-events-none">
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}