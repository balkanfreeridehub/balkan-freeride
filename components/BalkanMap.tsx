"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

export default function BalkanMap({ resorts }: { resorts: any[] }) {
  return (
    <div className="relative w-full h-[500px] bg-[#080808]">
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
                fill="#111"
                stroke="#222"
                strokeWidth={0.5}
                style={{ default: { outline: "none" }, hover: { fill: "#1a1a1a", outline: "none" } }}
              />
            ))
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            <circle r={resort.forecast > 5 ? 12 : 0} fill="#ea580c" opacity={0.2} className="animate-ping" />
            <circle r={6} fill="#ea580c" stroke="#fff" strokeWidth={2} />
            <text textAnchor="middle" y={-20} className="fill-zinc-500 text-[10px] font-black uppercase tracking-widest pointer-events-none">
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  )
}