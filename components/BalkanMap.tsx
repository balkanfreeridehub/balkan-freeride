"use client"
import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

// Ovo je pojednostavljen geoJSON za Balkan (Srbija, CG, BiH, MK, Kosovo)
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json"

export default function BalkanMap({ resorts }: { resorts: any[] }) {
  return (
    <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-4 md:p-8 mb-12 overflow-hidden shadow-inner">
      <div className="flex justify-between items-center mb-6 px-4">
        <h3 className="text-xl font-black uppercase italic tracking-tighter">Live Snow <span className="text-orange-600">Map</span></h3>
        <div className="flex items-center gap-2 opacity-40 text-[10px] font-bold uppercase tracking-widest">
          <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping"></span>
          Active Sensors
        </div>
      </div>
      
      <div className="h-[300px] md:h-[500px] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 3500,
            center: [20, 43.5] // Fokus na Balkan
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
                  className="text-zinc-100 dark:text-zinc-800/40 stroke-zinc-300 dark:stroke-zinc-700/50"
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#f4f4f5" },
                  }}
                />
              ))
            }
          </Geographies>

          {resorts.map((resort) => (
            <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
              <circle 
                r={resort.forecast > 0 ? 6 : 3} 
                className={`${resort.forecast > 5 ? 'fill-orange-600 animate-pulse' : 'fill-zinc-400'} transition-all duration-500`} 
              />
              <text
                textAnchor="middle"
                y={-15}
                className="fill-zinc-500 dark:fill-zinc-400 text-[10px] font-black uppercase italic pointer-events-none tracking-tighter"
              >
                {resort.forecast > 0 ? `${resort.name} (${resort.forecast}mm)` : ''}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  )
}