"use client"
import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker, // OVO JE FALILO I PRAVILO ERROR
  ZoomableGroup
} from "react-simple-maps";

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-900/20">
      <ComposableMap
        projection="geoAzimuthalEqualArea"
        projectionConfig={{
          rotate: [-20.0, -43.0, 0],
          scale: 4000
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup center={[20, 43]} zoom={1}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#A855F7", opacity: 0.1 },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {resorts.map((resort: any) => {
            let snow = 0;
            resort.hourly?.precipitation?.slice(0, timeframe).forEach((p: number, i: number) => {
              if (p > 0 && resort.hourly.temperature_2m[i] <= 1) snow += p * 1.5;
            });
            const s = getStatus(snow);

            return (
              <Marker key={`marker-${resort.id}`} coordinates={[resort.lon, resort.lat]}>
                <g transform="translate(-12, -24)">
                  <circle
                    r="12"
                    fill={s.color}
                    className="animate-pulse"
                    opacity="0.3"
                  />
                  <circle
                    r="6"
                    fill={s.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
                <text
                  textAnchor="middle"
                  y={-30}
                  className="fill-slate-900 dark:fill-white text-[10px] font-black uppercase tracking-tighter"
                  style={{ pointerEvents: 'none' }}
                >
                  {resort.name}
                </text>
                <text
                  textAnchor="middle"
                  y={-42}
                  fill={s.color}
                  className="text-[12px] font-black italic"
                  style={{ pointerEvents: 'none' }}
                >
                  +{snow.toFixed(0)}cm
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}