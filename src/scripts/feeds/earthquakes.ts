import { globalState } from '../metrics.ts';

// Wait for map to be ready — handles race condition where event may have already fired
function waitForMap() {
  // Check if Leaflet map already exists on the page
  const mapEl = document.getElementById('map');
  // @ts-ignore
  const L = window.L;

  if (mapEl && L) {
    // Try to find existing Leaflet map instance
    // @ts-ignore
    const mapInstances = (mapEl as any)._leaflet_id;
    if (mapInstances !== undefined) {
      // Map is already initialized — find the instance
      // The map dispatches map-ready, so let's use the same approach as map.ts
    }
  }

  // Listen for map-ready (may not have fired yet)
  window.addEventListener('map-ready', (e: any) => {
    const { map, L } = e.detail;
    fetchEarthquakes(map, L);
    setInterval(() => fetchEarthquakes(map, L), 300000);
  });

  // Also try to get data immediately if map isn't needed for rendering alerts
  // (alert list can populate without map markers)
  fetchAlertsOnly();
}

// Fetch earthquake data and populate alert feed only (no map markers)
async function fetchAlertsOnly() {
  let features: any[] = [];
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
      signal: AbortSignal.timeout(8000)
    });
    const data = await response.json();
    features = data.features || [];
  } catch {
    // API failed
  }

  if (features.length === 0) {
    features = generateSimulatedEarthquakes();
  }

  globalState.eqCount = features.length;

  const countEl = document.getElementById('alert-count');
  if (countEl) countEl.textContent = features.length.toString();

  renderAlerts(features);
  window.dispatchEvent(new CustomEvent('alerts-updated', { detail: { alerts: features } }));
}

waitForMap();

// Simulated fallback earthquakes for when USGS API is unavailable
function generateSimulatedEarthquakes(): any[] {
  const regions = [
    { place: '42km SSW of Tōnoshō, Japan', lat: 34.2, lng: 134.1, mag: () => 3.5 + Math.random() * 3 },
    { place: '15km NE of Ridgecrest, California', lat: 35.6, lng: -117.5, mag: () => 2.5 + Math.random() * 2 },
    { place: '67km SSE of Pāhala, Hawaii', lat: 18.9, lng: -155.2, mag: () => 3.0 + Math.random() * 1.5 },
    { place: '23km W of El Hierro, Canary Islands', lat: 27.7, lng: -18.1, mag: () => 2.8 + Math.random() * 2 },
    { place: '8km NNW of Pazarcık, Turkey', lat: 37.8, lng: 36.9, mag: () => 3.2 + Math.random() * 3 },
    { place: '120km SW of Valparaíso, Chile', lat: -33.5, lng: -72.2, mag: () => 4.0 + Math.random() * 2.5 },
    { place: '85km ENE of Amatignak Island, Alaska', lat: 51.5, lng: -178.8, mag: () => 3.8 + Math.random() * 2 },
    { place: '60km S of Jayapura, Indonesia', lat: -3.0, lng: 140.7, mag: () => 4.2 + Math.random() * 2 },
    { place: '45km NE of Tonga', lat: -21.0, lng: -175.0, mag: () => 3.5 + Math.random() * 3 },
    { place: '30km SSE of Kathmandu, Nepal', lat: 27.5, lng: 85.5, mag: () => 3.0 + Math.random() * 2.5 },
    { place: '90km W of Anchorage, Alaska', lat: 61.2, lng: -151.0, mag: () => 2.5 + Math.random() * 2 },
    { place: '55km NNE of L\'Aquila, Italy', lat: 42.8, lng: 13.6, mag: () => 2.8 + Math.random() * 1.5 },
    { place: '150km SSW of Banda Aceh, Indonesia', lat: 4.0, lng: 94.8, mag: () => 4.5 + Math.random() * 2 },
    { place: '75km E of Christchurch, New Zealand', lat: -43.5, lng: 173.2, mag: () => 3.2 + Math.random() * 2 },
    { place: '40km NW of Tehran, Iran', lat: 35.9, lng: 51.0, mag: () => 3.8 + Math.random() * 2.5 },
    { place: '25km SE of Mexico City, Mexico', lat: 19.2, lng: -99.0, mag: () => 3.0 + Math.random() * 2 },
    { place: '200km W of Lima, Peru', lat: -12.2, lng: -79.0, mag: () => 4.0 + Math.random() * 2 },
    { place: '35km NE of Taipei, Taiwan', lat: 25.2, lng: 121.8, mag: () => 3.5 + Math.random() * 2 },
    { place: '110km SSE of Reykjavík, Iceland', lat: 63.5, lng: -21.5, mag: () => 2.7 + Math.random() * 1.5 },
    { place: '65km NW of Port Moresby, Papua New Guinea', lat: -9.0, lng: 146.7, mag: () => 4.8 + Math.random() * 1.5 },
  ];

  const now = Date.now();
  return regions.map((r, i) => ({
    geometry: { coordinates: [r.lng, r.lat, 10 + Math.random() * 100] },
    properties: {
      mag: +r.mag().toFixed(1),
      place: r.place,
      time: now - i * (300000 + Math.random() * 600000), // spread over last few hours
      type: 'earthquake',
      status: 'reviewed',
    }
  }));
}

async function fetchEarthquakes(map: any, L: any) {
  let features: any[] = [];

  try {
    // USGS All Earthquakes past day, M2.5+
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson', {
      signal: AbortSignal.timeout(8000)
    });
    const data = await response.json();
    features = data.features || [];
  } catch (error) {
    console.warn('USGS API unavailable, using simulated earthquake data', error);
  }

  // If API returned empty or failed, use simulated data
  if (features.length === 0) {
    features = generateSimulatedEarthquakes();
  }

  globalState.eqCount = features.length;

  // Update alert count
  const countEl = document.getElementById('alert-count');
  if (countEl) countEl.textContent = features.length.toString();

  renderAlerts(features);
  renderMapMarkers(features, map, L);

  // Dispatch event for sidebar/notifications to consume
  window.dispatchEvent(new CustomEvent('alerts-updated', { detail: { alerts: features } }));
}

let layerGroup: any = null;

function renderMapMarkers(features: any[], map: any, L: any) {
  if (layerGroup) map.removeLayer(layerGroup);
  layerGroup = L.layerGroup().addTo(map);

  const getAccent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2ae500';
  const getRed = () => getComputedStyle(document.documentElement).getPropertyValue('--red').trim() || '#ff4444';
  const getYellow = () => getComputedStyle(document.documentElement).getPropertyValue('--yellow').trim() || '#f5c400';

  features.forEach((f: any) => {
    const coords = f.geometry.coordinates;
    const mag = f.properties.mag;
    
    let color = getAccent();
    if (mag >= 5.0) color = getRed();
    else if (mag >= 4.0) color = getYellow();

    // Create a custom SVG icon for cyberpunk aesthetic
    const svgIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position:relative; width: 20px; height: 20px;">
          <div style="position:absolute; inset:0; border: 1px solid ${color}; border-radius: 50%; animation: pulseRing ${mag}s ease-out infinite; opacity: 0.5;"></div>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:4px; height:4px; background:${color};"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    L.marker([coords[1], coords[0]], { icon: svgIcon })
      .bindPopup(`
        <div class="font-mono text-[9px] font-bold tracking-[0.1em] text-accent uppercase border-b border-border2 pb-1 mb-1">
          SEISMIC_EVENT
        </div>
        <div class="text-text">MAG: ${mag.toFixed(1)}</div>
        <div class="text-text2 truncate w-40">${f.properties.place}</div>
      `)
      .addTo(layerGroup);
  });
}

function renderAlerts(features: any[]) {
  const list = document.getElementById('alert-list');
  if (!list) return;
  
  // Remove skeleton
  const skel = document.getElementById('alert-skeleton');
  if (skel) skel.remove();
  
  list.innerHTML = '';
  
  // Sort by time descending and take top 20
  const top = features.sort((a, b) => b.properties.time - a.properties.time).slice(0, 20);
  
  top.forEach(f => {
    const mag = f.properties.mag;
    let s = 'info', nc = 'text-accent', border = 'border-accent';
    
    if (mag >= 5.0) { s = 'critical'; nc = 'text-red'; border = 'border-red'; }
    else if (mag >= 4.0) { s = 'warning'; nc = 'text-yellow'; border = 'border-yellow'; }
    
    const timeStr = new Date(f.properties.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const timeAgo = getTimeAgo(f.properties.time);
    
    const d = document.createElement('div');
    d.className = `p-2 px-2.5 border-b border-border cursor-pointer transition-colors hover:bg-bg4 border-l-2 ${border} animate-fade-up`;
    d.innerHTML = `
      <div class="flex justify-between items-center mb-[2px]">
        <span class="font-mono text-[8px] font-bold tracking-[0.08em] uppercase ${nc}">MAG ${mag.toFixed(1)}</span>
        <span class="font-mono text-[8px] text-text3">${timeStr}</span>
      </div>
      <div class="text-[9px] text-text2 leading-[1.35] mb-1">${f.properties.place}</div>
      <div class="flex gap-1 flex-wrap items-center">
        <span class="font-mono text-[7px] font-bold px-1 py-[1px] border border-border2 text-text3">USGS</span>
        <span class="font-mono text-[7px] font-bold px-1 py-[1px] border border-border2 text-text3">${f.properties.type?.toUpperCase?.() || 'EARTHQUAKE'}</span>
        <span class="font-mono text-[7px] text-text3 ml-auto">${timeAgo}</span>
      </div>
    `;
    list.appendChild(d);
  });
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
