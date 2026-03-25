import { balkanResorts } from '../data/resorts';
import { getWeatherData } from '../lib/weather';
import ThemeToggle from '../components/ThemeToggle';
import BalkanMap from '../components/BalkanMap';

export default async function Home() {
  // Povlačimo podatke za sve planine paralelno
  const resortsWithData = await Promise.all(
    balkanResorts.map(async (resort) => {
      const weather = await getWeatherData(resort.lat, resort.lon);
      return {
        ...resort,
        forecast: weather?.forecast || 0,
        temp: weather?.temp || 0,
        wind: weather?.wind || 0,
        current: Math.floor(Math.random() * 40) + 30 // Simulacija baze snega
      };
    })
  );

  // Sortiramo: Planine sa najviše novog snega idu prve
  const sortedResorts = resortsWithData.sort((a, b) => b.forecast - a.forecast);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-xl font-black italic tracking-tighter uppercase">
            BFH <span className="text-orange-600 underline decoration-2 underline-offset-4">BALKAN</span>
          </h1>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <header className="mb-12 border-l-4 border-orange-600 pl-6">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-tighter">
            Regional <br /> <span className="text-orange-600">Powder</span> Alert
          </h2>
          <p className="mt-4 text-sm font-bold opacity-40 uppercase tracking-[0.3em]">
            Live conditions & 24h forecast
          </p>
        </header>

        {/* INTERAKTIVNA MAPA SEKCIJA */}
        <section className="mb-16">
          <BalkanMap resorts={resortsWithData} />
        </section>

        {/* RESORT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedResorts.map((resort) => (
            <div 
              key={resort.id} 
              className="group bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl hover:shadow-2xl hover:border-orange-600 transition-all"
            >
              <div className="flex justify-between items-start mb-6 text-left">
                <div>
                  <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{resort.country}</span>
                  <h3 className="text-xl font-black uppercase italic leading-none tracking-tighter group-hover:text-orange-600 transition-colors">
                    {resort.name}
                  </h3>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  <span className="text-lg font-black italic text-orange-600">+{resort.forecast}mm</span>
                </div>
              </div>

              {/* Weather Stats Bar */}
              <div className="grid grid-cols-2 gap-2 mb-6 text-center">
                <div className="bg-zinc-50 dark:bg-black/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[9px] font-bold opacity-40 uppercase mb-1">Temp</p>
                  <p className="text-xl font-black italic">{resort.temp}°C</p>
                </div>
                <div className="bg-zinc-50 dark:bg-black/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[9px] font-bold opacity-40 uppercase mb-1">Wind</p>
                  <p className="text-xl font-black italic">{resort.wind}<span className="text-[10px] ml-1 opacity-40 italic">m/s</span></p>
                </div>
              </div>

              {/* Small Progress bar */}
              <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-orange-600 transition-all duration-700"
                  style={{ width: `${Math.min(resort.forecast * 5, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center opacity-40 text-[10px] font-bold uppercase tracking-tighter">
                <span>Base: {resort.current}cm</span>
                <span>{resort.wind > 10 ? '💨 Windy' : 'Safe'}</span>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-20 py-10 border-t border-zinc-200 dark:border-zinc-900 opacity-30 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em]">Balkan Freeride Hub • 2026</p>
        </footer>
      </main>
    </div>
  );
}