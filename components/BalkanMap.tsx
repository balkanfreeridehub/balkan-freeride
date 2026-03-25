"use client"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  resorts: any[];
  timeframe: number;
}

export default function BalkanMap({ resorts, timeframe }: Props) {
  const getStatusColor = (snow: number) => {
    if (snow >= 100) return '#9333ea'; // Japan Style
    if (snow >= 50) return '#0f172a';  // Extreme
    if (snow >= 30) return '#00c853';  // Powder
    if (snow >= 10) return '#ffd600';  // Rideable
    return '#d50000';                 // Skip
  };

  const createCustomIcon = (snow: number) => {
    const color = getStatusColor(snow);
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  };

  return (
    <MapContainer center={[43.0, 19.5]} zoom={7} className="h-full w-full z-10">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {resorts.map((r, i) => {
        if (!r.hourly) return null;
        
        // Brza kalkulacija snega za marker
        let snow = 0;
        for (let j = 0; j < timeframe; j++) {
            const t = r.hourly.temperature_2m[j];
            const p = r.hourly.precipitation[j] || 0;
            if (p > 0 && t <= 0) snow += p;
        }

        return (
          <Marker key={i} position={[r.lat, r.lon]} icon={createCustomIcon(snow)}>
            <Popup>
              <div className="text-center font-bold">
                <p className="m-0 uppercase">{r.name}</p>
                <p className="m-0 text-blue-600">❄️ +${snow.toFixed(1)} cm</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}