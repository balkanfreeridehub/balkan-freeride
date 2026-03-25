// ... ostatak koda ostaje isti, samo promeni deo gde se računa snowVal unutar resorts.map:

{resorts.map((resort) => {
  // Uzimamo bazu, množimo sa timeframe-om (npr. 24h)
  const rawSnow = (resort.forecast || 0) * timeframe;
  
  // Ako ima ikakvih padavina na minusu, garantujemo prikaz od barem 1cm
  // Ako je rawSnow npr 0.5, Math.ceil će ga dići na 1. Ako je 5.2, dići će na 6.
  const snowDisplay = rawSnow > 0 ? Math.ceil(rawSnow) : 0;

  return (
    <div key={resort.id} className="bg-slate-50 dark:bg-white/5 border dark:border-white/10 p-8 rounded-[3rem] hover:shadow-2xl transition-all group">
      {/* ... (ime, condition, temp podaci) ... */}
      
      <div className="mb-8 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-blue-600/30">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase opacity-70 mb-1">
            {t.forecast} (+{timeOptions.find(o => o.value === timeframe)?.label[lang]})
          </p>
          <p className="text-5xl font-black italic">
            +{snowDisplay} <span className="text-2xl uppercase">cm</span>
          </p>
        </div>
        {/* ... (ikona pahulje) ... */}
      </div>

      {/* ... (dugme za kameru) ... */}
    </div>
  );
})}