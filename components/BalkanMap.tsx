"use client"
import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

export default function BalkanMap({ resorts, timeframe, getStatus }: any) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="w-full h-full bg-transparent overflow-visible">
      {/* Ostatak koda mape je isti, samo sada koristimo isDark bezbedno */}
      <ComposableMap projection="geoAzimuthalEqualArea" projectionConfig={{ rotate: [-19.5, -42.8, 0], scale: 8000 }}>
         {/* ... Geographies i Markers koriste isDark za boju ... */}
      </ComposableMap>
    </div>
  );
}