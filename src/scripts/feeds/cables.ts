let layerGroup: any = null;

// Major real-world submarine cable routes (simplified lat/lng paths)
const CABLE_ROUTES = [
  // ── Atlantic ──────────────────────────────────────────────────────────────
  { name: 'TAT-14 (Trans-Atlantic)',        coords: [[40.7,-74],[45,-40],[50,-20],[51.5,-0.1]] },
  { name: 'FLAG Atlantic-1',               coords: [[40.7,-74],[44,-35],[51,-8],[51.5,-0.1]] },
  { name: 'Apollo Cable System',           coords: [[40.7,-74],[46,-30],[53.3,-6.2]] },
  { name: 'Yellow/AC-2',                   coords: [[40.7,-74],[47,-25],[53.5,-3],[51.5,-0.1]] },
  { name: 'SAex (South Atlantic Express)', coords: [[-33.9,-70.8],[-30,-40],[-15,-15],[0,10],[6.4,3.4]] },
  { name: 'WACS (West Africa Cable)',      coords: [[51.5,-0.1],[20,-20],[0,-10],[-26.1,28.2]] },
  // ── Pacific ───────────────────────────────────────────────────────────────
  { name: 'Trans-Pacific Express',         coords: [[37.8,-122.4],[35,160],[35.7,139.7]] },
  { name: 'PC-1 (Pacific Crossing)',       coords: [[47.6,-122.3],[50,170],[35.7,139.7]] },
  { name: 'Southern Cross Cable',         coords: [[-33.9,151.2],[-28,165],[-17.7,-168],[21,-157.8],[47.6,-122.3]] },
  { name: 'SEA-ME-WE 3',                  coords: [[51.5,-0.1],[38,20],[35,30],[28,34],[20,60],[5,80],[1.4,103.9],[22.3,114.2]] },
  { name: 'SEA-ME-WE 4',                  coords: [[43.3,5.4],[36,25],[27,34],[22,57],[10,74],[1.4,103.9],[13.7,100.5],[22.3,114.2]] },
  { name: 'SEA-ME-WE 5',                  coords: [[43.3,5.4],[37,23],[25,55],[14,74],[1.4,103.9],[13.7,100.5],[22.3,114.2]] },
  { name: 'EASSy (East African Sub)',      coords: [[30.1,31.4],[5,42],[-33.9,18.6]] },
  { name: 'SEACOM',                        coords: [[-33.9,18.6],[-26.1,33],[-4.0,40],[12.4,43.1],[21.5,39.2]] },
  { name: 'IMEWE',                         coords: [[22,60],[21.5,39.2],[30.1,31.4],[38,23],[43.3,5.4],[48.8,2.3]] },
  // ── Europe ────────────────────────────────────────────────────────────────
  { name: 'Hibernia Atlantic',             coords: [[51.5,-0.1],[55,-5],[53.3,-6.2],[47.6,-52],[40.7,-74]] },
  { name: 'UK-Netherlands',               coords: [[51.5,-0.1],[52.3,4.8]] },
  { name: 'MORONA',                        coords: [[43.3,5.4],[37,-9],[53.3,-6.2]] },
  // ── Indian Ocean ─────────────────────────────────────────────────────────
  { name: 'SAFE (South Africa-Far East)', coords: [[28.6,77.1],[15,75],[5,60],[-33.9,18.6]] },
  { name: 'IO Cable',                     coords: [[-20.2,57.5],[5,60],[28.6,77.1]] },
  // ── Asia-Pacific ─────────────────────────────────────────────────────────
  { name: 'APG (Asia-Pacific Gateway)',   coords: [[22.3,114.2],[25,121.5],[37.4,126.8],[35.7,139.7]] },
  { name: 'SJC (SJC2)',                   coords: [[1.4,103.9],[16,120],[22.3,114.2],[25,121.5],[35.7,139.7],[35,135],[34.6,135]] },
  { name: 'JADE',                          coords: [[22.3,114.2],[30,128],[35.7,139.7]] },
  { name: 'Bay of Bengal',               coords: [[22.3,88.4],[13.1,80.2],[8.6,80.9],[6.9,79.9]] },
  { name: 'Tata TGN-Pacific',            coords: [[22.3,114.2],[34,140],[37.8,-122.4]] },
  // ── Arctic ────────────────────────────────────────────────────────────────
  { name: 'Arctic Fibre',                 coords: [[51.5,-0.1],[60,-5],[70,10],[75,30],[75,60],[60.0,25.0]] },
];

function getAccent() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#2ae500';
}

export async function initCables(map: any, L: any) {
  layerGroup = L.layerGroup();

  const drawCables = () => {
    layerGroup.clearLayers();
    const color = getAccent();

    CABLE_ROUTES.forEach(cable => {
      L.polyline(cable.coords as [number, number][], {
        color,
        weight: 1.5,
        opacity: 0.55,
        dashArray: '3, 8',
        lineCap: 'round'
      })
      .bindPopup(`
        <div style="color:var(--accent);font-weight:700;border-bottom:1px solid var(--border2);padding-bottom:4px;margin-bottom:4px;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;">🔗 SUBMARINE CABLE</div>
        <div style="color:var(--text);font-size:9px;"><b>${cable.name}</b></div>
        <div style="color:var(--text2);font-size:9px;">TYPE: Fiber Optic</div>
        <div style="color:var(--text2);font-size:9px;">STATUS: ACTIVE</div>
      `)
      .addTo(layerGroup);
    });
  };

  drawCables();

  // Redraw on theme change to update accent color
  window.addEventListener('rtm-theme-changed', drawCables);

  // Best-effort live fetch (may fail due to CORS — that's fine)
  try {
    const res = await fetch('https://www.submarinecablemap.com/api/v3/cable/cable-geo.json', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      layerGroup.clearLayers();
      const color = getAccent();
      L.geoJSON(data, {
        style: () => ({ color, weight: 1.5, opacity: 0.5, dashArray: '3, 8' }),
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties?.name) {
            layer.bindPopup(`
              <div style="color:var(--accent);font-weight:700;border-bottom:1px solid var(--border2);padding-bottom:4px;margin-bottom:4px;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;">🔗 SUBMARINE CABLE</div>
              <div style="color:var(--text);font-size:9px;"><b>${feature.properties.name}</b></div>
              <div style="color:var(--text2);font-size:9px;">STATUS: ACTIVE</div>
            `);
          }
        }
      }).addTo(layerGroup);
    }
  } catch {
    // Live fetch failed — simulated data is already showing, no action needed
  }

  return layerGroup;
}
