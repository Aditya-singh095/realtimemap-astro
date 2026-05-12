import { initFlights }    from './feeds/flights.ts';
import { initCables }     from './feeds/cables.ts';
import { initSimulated }  from './feeds/simulated.ts';
import { initSatellites } from './feeds/satellites.ts';
import { initCameras }    from './feeds/cameras.ts';
import { initMilitary }   from './feeds/military.ts';
import { initSearch }     from './search.ts';

let map: any;
let L: any;

const TILES: Record<string, { url: string; opts: object }> = {
  dark: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    opts: { maxZoom: 16, attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ' }
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    opts: { maxZoom: 19, className: 'satellite-tiles' }
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    opts: { maxZoom: 17, className: 'terrain-tiles' }
  },
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    opts: { maxZoom: 19, attribution: '&copy; OpenStreetMap' }
  }
};



let currentTileLayer: any = null;
let currentTileId = 'dark';
let is3DMode = false;

const layerRegistry: Record<string, any> = {};
const layerVisible: Record<string, boolean> = {
  flights:    true,
  ships:      true,
  cables:     true,
  pipelines:  true,
  satellites: false,
  cameras_city: false,
  cameras_traffic: false,
  cameras_port: false,
  cameras_airport: false,
  military: false,
  nuclear: false,
};

// ─── Tile switching ───────────────────────────────────────────────────────────
function setTile(id: string) {
  if (currentTileId === id || !map) return;
  currentTileId = id;
  if (currentTileLayer) map.removeLayer(currentTileLayer);
  const t = TILES[id];
  currentTileLayer = L.tileLayer(t.url, t.opts).addTo(map);
  currentTileLayer.bringToBack();

  document.querySelectorAll<HTMLElement>('.tbtn').forEach(btn => {
    if (btn.id.startsWith('tile-')) {
      const active = btn.id === `tile-${id}`;
      btn.classList.toggle('active-tile', active);
    }
  });
}

// ─── Layer toggling ───────────────────────────────────────────────────────────
function toggleLayer(id: string) {
  const layer = layerRegistry[id];
  if (!layer || !map) return;
  layerVisible[id] = !layerVisible[id];
  if (layerVisible[id]) {
    layer.addTo(map);
  } else {
    map.removeLayer(layer);
  }
  const pill = document.querySelector<HTMLElement>(`.lpill[data-layer="${id}"]`);
  if (pill) pill.classList.toggle('active', layerVisible[id]);
}

// ─── 2D/3D Toggle ─────────────────────────────────────────────────────────────
function toggle3D(enable: boolean) {
  is3DMode = enable;
  const wrapper = document.getElementById('map-perspective-wrapper');
  if (!wrapper) return;

  if (enable) {
    wrapper.classList.add('mode-3d');
  } else {
    wrapper.classList.remove('mode-3d');
  }

  // Update view mode buttons
  const btn2d = document.getElementById('view-2d');
  const btn3d = document.getElementById('view-3d');
  if (btn2d) btn2d.classList.toggle('active-tile', !enable);
  if (btn3d) btn3d.classList.toggle('active-tile', enable);

  // Leaflet needs to recalculate after transform change
  setTimeout(() => map?.invalidateSize(), 700);
}

// ─── Street View ──────────────────────────────────────────────────────────────
function initStreetView() {
  const btn = document.getElementById('streetview-btn');
  const overlay = document.getElementById('streetview-overlay');
  const closeBtn = document.getElementById('streetview-close');
  const frame = document.getElementById('streetview-frame');
  const locationEl = document.getElementById('sv-location');

  if (btn && overlay && frame) {
    btn.addEventListener('click', () => {
      if (!map) return;
      const center = map.getCenter();
      const lat = center.lat.toFixed(6);
      const lng = center.lng.toFixed(6);

      if (locationEl) {
        locationEl.textContent = `LAT: ${lat} | LNG: ${lng}`;
      }

      // Use Google Street View embed (works without API key for iframe embeds)
      frame.innerHTML = `
        <iframe 
          src="https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s!2m2!1d${lat}!2d${lng}!3f0!4f0!5f0.7820865974627469"
          style="width:100%; height:100%; border:none;"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        ></iframe>
        <div style="position:absolute; bottom:8px; right:8px; z-index:10;">
          <a href="https://www.google.com/maps/@${lat},${lng},3a,75y,0h,90t/data=!3m6!1e1!3m4!1s!2e0!7i16384!8i8192" 
             target="_blank" rel="noopener"
             style="
               display:inline-flex; align-items:center; gap:4px;
               padding:4px 10px; background:var(--bg3); border:1px solid var(--border2);
               color:var(--accent); font-family:monospace; font-size:8px; font-weight:700;
               text-decoration:none; text-transform:uppercase; letter-spacing:0.1em;
               transition: all 0.15s;
             "
             onmouseover="this.style.background='var(--accent)';this.style.color='var(--accent-on)'"
             onmouseout="this.style.background='var(--bg3)';this.style.color='var(--accent)'"
          >
            <i class="ti ti-external-link" style="font-size:10px;"></i>
            Open in Google Maps
          </a>
        </div>
      `;

      overlay.style.display = 'block';
    });
  }

  if (closeBtn && overlay && frame) {
    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
      frame.innerHTML = '';
    });
  }
}

// ─── Layer panel open/close ───────────────────────────────────────────────────
function initLayerPanel() {
  const btn     = document.getElementById('layer-panel-btn');
  const panel   = document.getElementById('layer-panel');
  const chevron = document.getElementById('layer-chevron');

  if (btn && panel) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.style.display === 'flex' || panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      if (chevron) (chevron as HTMLElement).style.transform = open ? '' : 'rotate(180deg)';
    });
    document.addEventListener('click', (e) => {
      if (panel.style.display !== 'none' &&
          !panel.contains(e.target as Node) &&
          e.target !== btn && !btn.contains(e.target as Node)) {
        panel.style.display = 'none';
        if (chevron) (chevron as HTMLElement).style.transform = '';
      }
    });
  }

  // Layer row clicks
  document.querySelectorAll<HTMLElement>('.lrow').forEach(row => {
    const id = row.dataset.layer!;
    row.addEventListener('click', () => toggleLayer(id));
  });

  // Tile buttons
  ['dark', 'satellite', 'terrain', 'osm'].forEach(id => {
    document.getElementById(`tile-${id}`)?.addEventListener('click', (e) => {
      e.stopPropagation();
      setTile(id);
    });
  });

  // View mode buttons
  document.getElementById('view-2d')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle3D(false);
  });
  document.getElementById('view-3d')?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle3D(true);
  });
}

// ─── Map init ─────────────────────────────────────────────────────────────────
async function initMap() {
  // @ts-ignore
  L = window.L;
  if (!L) { setTimeout(initMap, 100); return; }

  map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    center: [20, 0],
    zoom: 3,
    minZoom: 2,
    worldCopyJump: true
  });

  currentTileLayer = L.tileLayer(TILES.dark.url, TILES.dark.opts).addTo(map);
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  // Force Leaflet to recalculate its container size
  setTimeout(() => map.invalidateSize(), 200);

  // HUD coordinates
  const coordsEl = document.getElementById('hud-coords');
  map.on('mousemove', (e: any) => {
    if (!coordsEl) return;
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    coordsEl.textContent =
      `LAT: ${Math.abs(Number(lat))}°${Number(lat) >= 0 ? 'N' : 'S'} | LON: ${Math.abs(Number(lng))}°${Number(lng) >= 0 ? 'E' : 'W'}`;
  });

  window.dispatchEvent(new CustomEvent('map-ready', { detail: { map, L } }));

  // Search
  initSearch(map);

  // Load feeds (flights & cables in parallel)
  const [flightsLayer, cablesLayer] = await Promise.all([
    initFlights(map, L),
    initCables(map, L),
  ]);
  const { shipsGroup, pipelinesGroup } = initSimulated(map, L);
  const satelliteGroup = await initSatellites(map, L);
  const cameraGroups = initCameras(map, L);
  const { militaryGroup, nuclearGroup } = initMilitary(map, L);

  layerRegistry['flights']    = flightsLayer;
  layerRegistry['cables']     = cablesLayer;
  layerRegistry['ships']      = shipsGroup;
  layerRegistry['pipelines']  = pipelinesGroup;
  layerRegistry['satellites'] = satelliteGroup;
  layerRegistry['cameras_city']    = cameraGroups.city;
  layerRegistry['cameras_traffic'] = cameraGroups.traffic;
  layerRegistry['cameras_port']    = cameraGroups.port;
  layerRegistry['cameras_airport'] = cameraGroups.airport;
  layerRegistry['military']   = militaryGroup;
  layerRegistry['nuclear']    = nuclearGroup;

  // Add default-visible layers
  if (flightsLayer)   flightsLayer.addTo(map);
  if (cablesLayer)    cablesLayer.addTo(map);
  if (shipsGroup)     shipsGroup.addTo(map);
  if (pipelinesGroup) pipelinesGroup.addTo(map);
  // satellites + cameras start OFF

  initLayerPanel();
  initStreetView();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMap);
} else {
  initMap();
}
