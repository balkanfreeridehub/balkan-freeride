"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function BalkanMap({ resorts }: { resorts: any[] }) {
  return (
    <div className="relative w-full h-[500px] bg-blue-50/30 dark:bg-black/20">
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
                className="text-white dark:text-zinc-900 stroke-blue-100 dark:stroke-zinc-800"
                strokeWidth={0.5}
                style={{ default: { outline: "none" }, hover: { fill: "#f1f5f9", outline: "none" } }}
              />
            ))
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            <circle r={resort.forecast > 0 ? 15 : 0} fill="#3b82f6" opacity={0.2} className="animate-ping" />
            <circle r={6} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}