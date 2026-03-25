"use client"
import React from "react"
// @ts-ignore
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"
import { scaleLinear } from "d3-scale"

// GeoJSON mapa Evrope (filtriraćemo je vizuelno na Balkan)
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json"

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
    <div className="w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-inner p-4">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          rotate: [-19, -43, 0], // Centriranje na Balkan
          scale: 3500            // Zumiranje regije
        }}
        style={{ width: "100%", height: "400px" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => {
              // Imena država koje nas zanimaju na Balkanu
              const balkanStates = ["Serbia", "Montenegro", "Bosnia and Herz.", "Macedonia", "Kosovo", "Albania", "Croatia"];
              const isBalkan = balkanStates.includes(geo.properties.geounit);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isBalkan ? "#18181b" : "#09090b"}
                  stroke={isBalkan ? "#3f3f46" : "#18181b"}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: isBalkan ? "#27272a" : "#09090b", outline: "none" },
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
              <circle r={8} fill={colorScale(resort.forecast)} opacity={0.3} className="animate-ping" />
            )}
            
            {/* Glavni marker */}
            <circle 
              r={5} 
              fill={colorScale(resort.forecast)} 
              stroke="#ffffff" 
              strokeWidth={2} 
              className="cursor-pointer hover:r-7 transition-all"
            />
            
            {/* Tekst pored markera */}
            <text
              textAnchor="middle"
              y={-15}
              style={{ 
                fontFamily: "Inter, sans-serif", 
                fill: "#71717a", 
                fontSize: "10px", 
                fontWeight: "900",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              {resort.name}
            </text>
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Mini legenda u uglu mape */}
      <div className="absolute bottom-8 left-8 flex items-center gap-4 bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          <span className="text-[9px] font-bold uppercase opacity-50 tracking-widest">No Snow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></div>
          <span className="text-[9px] font-bold uppercase opacity-50 tracking-widest">Powder Alert</span>
        </div>
      </div>
    </div>
  )
}