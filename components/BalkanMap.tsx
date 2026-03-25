"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Popravka za podrazumevane ikonice u Leafletu
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface Props {
  resorts: any[];
  timeframe: number;
}

export default function BalkanMap({ resorts, timeframe }: Props) {
  useEffect(() => {
    // Ovo rešava problem sa ikonicama koje nestaju u Next.js build-u
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon.src,
      iconRetinaUrl: markerIcon2x.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  const getStatusColor = (snow: number) => {
    if (snow >= 100) return '#9333ea'; 
    if (snow >= 50) return '#0f172a';  
    if (snow >= 30) return '#00c853';  
    if (snow >= 10) return '#ffd600';  
    return '#d50000';                 
  };

  return (
    <MapContainer center={[43.0, 19.5]} zoom={7} scrollWheelZoom={false} className="h-full w-full z-10">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {resorts.map((r, i) => {
        if (!r.hourly) return null;
        let snow = 0;
        for (let j = 0; j < timeframe; j++) {
            const t = r.hourly.temperature_2m[j];
            const p = r.hourly.precipitation[j] || 0;
            if (p > 0 && t <= 0) snow += p;
        }

        const customIcon = L.divIcon({
          className: 'custom-pin',
          html: `<div style="background-color: ${getStatusColor(snow)}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(0,0,0,0.4);"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        return (
          <Marker key={i} position={[r.lat, r.lon]} icon={customIcon}>
            <Popup>
              <div className="font-bold uppercase p-1">
                {r.name} <br/> 
                <span className="text-blue-600">+{snow.toFixed(1)} cm</span>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}