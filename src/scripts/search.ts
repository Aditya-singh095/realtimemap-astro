export function initSearch(map: any) {
  const input = document.getElementById('global-search') as HTMLInputElement;
  if (!input) return;

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const query = input.value.trim();
      if (!query) return;

      input.blur();
      
      try {
        // Use Nominatim Geocoding API
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          
          // Fly to location
          map.flyTo([lat, lon], 10, {
            duration: 2,
            easeLinearity: 0.25
          });
        }
      } catch (err) {
        console.error('Geocoding failed', err);
      }
      
      input.value = '';
    }
  });
}
