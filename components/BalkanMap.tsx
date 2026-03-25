"use client"
import React from "react"
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps"

const geoUrl = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/TopoJSON/europe.topojson"

interface Props {
  resorts: any[];
  timeframe: number;
}

export default function BalkanMap({ resorts, timeframe }: Props) {
  return (
    <div className="w-full h-full bg-slate-100 dark:bg-[#020617] flex items-center justify-center">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-19.2, -43.2, 0], 
          scale: 6500 // Ekstreman zoom na tvoju regiju
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
                className="text-slate-200 dark:text-slate-800/40"
                stroke="currentColor"
                strokeWidth={0.5}
                style={{ default: { outline: "none" }, hover: { fill: "#3b82f6", outline: "none" } }}
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
            // Vraćena matematika: Sneg se računa samo na 0 stepeni i niže
            if (p > 0 && t <= 0) snow += p;
          }

          return (
            <Marker key={r.id} coordinates={[r.lon, r.lat]}>
              <circle r={5} fill={snow >= 30 ? '#00c853' : (snow >= 10 ? '#ffd600' : '#ef4444')} stroke="#fff" strokeWidth={1.5} />
              <text
                textAnchor="middle"
                y={-10}
                className="font-black uppercase pointer-events-none fill-slate-500 dark:fill-slate-400"
                style={{ fontSize: "8px", letterSpacing: "0.5px" }}
              >
                {r.name}
              </text>
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}