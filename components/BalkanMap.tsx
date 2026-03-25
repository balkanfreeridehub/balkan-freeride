"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { scaleLinear } from "d3-scale"

// NOVI, POUZDANIJI LINK ZA MAPU SVETA (Topography)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// Skala za boje: Što više snega (forecast), to je jača narandžasta
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
    <div className="relative w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner p-4">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [19, 43], // Centrirano na Balkan (Srbija/BiH/CG)
          scale: 2800       // Prilagođen zum za bolju preglednost
        }}
        style={{ width: "100%", height: "450px" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => {
              // Imena država koje nas zanimaju na Balkanu (proveravamo po imenu iz atlasa)
              const balkanStates = ["Serbia", "Montenegro", "Bosnia and Herz.", "Macedonia", "Albania", "Croatia", "Slovenia", "Bulgaria", "Romania", "Kosovo"];
              const isBalkan = balkanStates.includes(geo.properties.name);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isBalkan ? "#111111" : "#050505"}
                  stroke={isBalkan ? "#333333" : "#111111"}
                  strokeWidth={0.8}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: isBalkan ? "#1a1a1a" : "#050505", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>

        {resorts.map((resort) => (
          <Marker key={resort.id} coordinates={[resort.lon, resort.lat]}>
            {/* Pulsirajući krug oko markera ako ima snega */}
            {resort.forecast > 5 && (
              <circle r={10} fill={colorScale(resort.forecast)} opacity={0.2} className="animate-ping" />
            )}
            
            {/* Glavni marker */}
            <circle 
              r={6} 
              fill={colorScale(resort.forecast)} 
              stroke="#ffffff" 
              strokeWidth={2} 
              className="cursor-pointer"
            />
            
            {/* Tekst pored markera */}
            <text
              textAnchor="middle"
              y={-20}
              style={{ 
                fontFamily: "Inter, sans-serif", 
                fill: "#a1a1aa", 
                fontSize: "11px", 
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "1px",
                pointerEvents: "none"
              }}
            >
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Mini legenda u uglu mape */}
      <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
          <span className="text-[9px] font-black uppercase opacity-60 tracking-widest text-white">No Snow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Powder Alert</span>
        </div>
      </div>
    </div>
  )
}