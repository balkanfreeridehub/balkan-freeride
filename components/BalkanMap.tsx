"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { scaleLinear } from "d3-scale"

// Provereni TopoJSON koji Vercel uvek učitava
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const colorScale = scaleLinear<string>()
  .domain([0, 10, 30])
  .range(["#27272a", "#ea580c", "#ff7e33"])

interface Resort {
  id: string;
  name: string;
  lat: number;
  lon: number;
  forecast: number;
}

export default function BalkanMap({ resorts }: { resorts: Resort[] }) {
  return (
    <div className="relative w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden p-4 min-h-[400px]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [20, 44], // Precizno centrirano na Srbiju/Balkan
          scale: 3000       
        }}
        style={{ width: "100%", height: "450px" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#18181b"
                stroke="#27272a"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#27272a", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            {resort.forecast > 5 && (
              <circle r={12} fill={colorScale(resort.forecast)} opacity={0.15} className="animate-ping" />
            )}
            <circle 
              r={6} 
              fill={colorScale(resort.forecast)} 
              stroke="#ffffff" 
              strokeWidth={2}
              className="cursor-pointer shadow-xl"
            />
            <text
              textAnchor="middle"
              y={-20}
              className="pointer-events-none fill-zinc-500 text-[10px] font-black uppercase tracking-widest"
              style={{ fontFamily: "inherit" }}
            >
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>

      {/* Legenda */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-2 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
          <span className="text-[9px] font-black uppercase opacity-60 tracking-[0.2em] text-white">No Fresh Snow</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.5)]"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 italic">Powder Alert</span>
        </div>
      </div>
    </div>
  )
}