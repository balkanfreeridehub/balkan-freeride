// ... import FLAGS, getStatus, itd.
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

const getWeatherIcon = (code: number) => {
  if (code >= 71) return <CloudSnow size={24} className="text-white/80" />;
  if (code >= 51) return <CloudRain size={24} className="text-white/80" />;
  if (code >= 1) return <Cloud size={24} className="text-white/80" />;
  return <Sun size={24} className="text-white/80" />;
};

// Unutar render funkcije resorta:
const snow = calculateSnow(resort, timeframe); // Tvoja funkcija
const totalPrec = calculateTotalPrec(resort, timeframe);
const rain = totalPrec - (snow / 1.2); 
const s = getStatus(snow);

return (
  <Link href={`/resort/${resort.id}`} className="group ...">
    {/* Gornji box sa snegom i kolicinom kise */}
    <div className="h-56 rounded-[3.5rem] p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-2xl" style={{ backgroundColor: s.color }}>
      <div className="flex justify-between items-start">
        <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          {s.icon} {s.txt}
        </div>
        <div className="text-right">
          <div className="text-[9px] opacity-60 font-black uppercase tracking-tighter">Total Prec.</div>
          <div className="text-sm font-black italic">{totalPrec.toFixed(1)}mm</div>
        </div>
      </div>

      <div className="flex items-baseline justify-center gap-1">
        <span className="text-8xl font-black italic tracking-tighter">+{snow.toFixed(0)}</span>
        <span className="text-xl font-black italic opacity-60">cm</span>
      </div>

      <div className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-3xl mt-2">
         <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase opacity-60 tracking-widest">Rain Amount</span>
            <span className="text-xs font-black italic">{rain > 0 ? rain.toFixed(1) : 0} mm</span>
         </div>
         {getWeatherIcon(resort.current?.weather_code)}
      </div>
    </div>

    {/* Current Status - 3 čista boxa */}
    <div className="grid grid-cols-3 gap-3 mt-6 px-2">
      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center border border-black/5">
         <Thermometer size={14} className="mb-1 opacity-20" />
         <span className="text-lg font-black italic">{resort.current?.temperature_2m}°</span>
      </div>
      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center border border-black/5">
         <Wind size={14} className="mb-1 opacity-20" />
         <span className="text-lg font-black italic">{resort.current?.wind_speed_10m}</span>
      </div>
      <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-[2rem] flex flex-col items-center border border-black/5">
         <Navigation size={18} style={{ transform: `rotate(${resort.current?.wind_direction_10m}deg)` }} className="text-[#A855F7]" />
         <span className="text-[8px] font-black opacity-30 uppercase mt-1">Wind</span>
      </div>
    </div>
  </Link>
)