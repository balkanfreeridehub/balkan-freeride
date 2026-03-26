// U BalkanMap.tsx
<Marker 
  coordinates={[r.lon, r.lat]} 
  onClick={() => onSelect(r)}
>
  <g 
    onMouseEnter={() => setHovered(r)} 
    onMouseLeave={() => setHovered(null)}
    className="cursor-pointer pointer-events-auto" // BITNO
  >
    <circle r={8} fill={s.color} stroke="#fff" strokeWidth={2} className="hover:scale-150 transition-transform" />
  </g>
</Marker>