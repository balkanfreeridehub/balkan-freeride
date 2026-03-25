// Unutar Home komponente, izmeni useEffect:
useEffect(() => {
  async function load() {
    setLoading(true);
    // Mapiramo sa indexom (r, i) da bismo staggered-ovali pozive
    const data = await Promise.all(balkanResorts.map((r, i) => getWeatherData(r.lat, r.lon, i)));
    
    // Filtriramo samo one koji su uspešno stigli, da ne mapiramo preko 'null'
    const validData = balkanResorts.map((resort, index) => ({
      ...resort,
      ...(data[index] || {}) // Ako je null, biće prazan objekat, a optional chaining će sprečiti pucanje
    }));

    setResorts(validData);
    setLoading(false);
  }
  load();
}, []);