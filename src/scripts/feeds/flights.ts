import { globalState } from '../metrics.ts';

let layerGroup: any = null;

// Realistic flight routes covering all major corridors
const SIMULATED_FLIGHTS = [
  // Trans-Atlantic
  { lat: 51.5, lng: -0.1,   cs: 'BAW001',  hdg: 270, alt: 10668, spd: 900 },
  { lat: 48.8, lng: 2.3,    cs: 'AFR002',  hdg: 280, alt: 11000, spd: 870 },
  { lat: 40.7, lng: -74.0,  cs: 'DAL100',  hdg: 80,  alt: 10972, spd: 850 },
  { lat: 53.3, lng: -6.2,   cs: 'EIN303',  hdg: 260, alt: 9144,  spd: 820 },
  { lat: 45.5, lng: -30.0,  cs: 'UAL9',    hdg: 270, alt: 11278, spd: 890 },
  { lat: 52.0, lng: -15.0,  cs: 'BAW117',  hdg: 285, alt: 10668, spd: 905 },
  { lat: 43.0, lng: -45.0,  cs: 'DAL405',  hdg: 90, alt: 11000, spd: 860 },
  { lat: 55.0, lng: -20.0,  cs: 'ICE123',  hdg: 260, alt: 10500, spd: 840 },
  { lat: 48.0, lng: -55.0,  cs: 'ACA888',  hdg: 85, alt: 11200, spd: 880 },
  { lat: 38.0, lng: -60.0,  cs: 'AAL777',  hdg: 100, alt: 10000, spd: 820 },
  
  // Europe
  { lat: 50.1, lng: 8.7,    cs: 'DLH400',  hdg: 190, alt: 9754,  spd: 800 },
  { lat: 41.9, lng: 12.5,   cs: 'AZA210',  hdg: 135, alt: 8534,  spd: 780 },
  { lat: 52.3, lng: 4.8,    cs: 'KLM600',  hdg: 200, alt: 9144,  spd: 810 },
  { lat: 37.9, lng: 23.7,   cs: 'OAL551',  hdg: 90,  alt: 7620,  spd: 750 },
  { lat: 48.3, lng: 16.6,   cs: 'AUA100',  hdg: 45,  alt: 8230,  spd: 790 },
  { lat: 59.9, lng: 30.3,   cs: 'AFL201',  hdg: 270, alt: 9754,  spd: 820 },
  { lat: 46.2, lng: 6.1,    cs: 'SWR123',  hdg: 180, alt: 10500, spd: 830 },
  { lat: 55.6, lng: 12.5,   cs: 'SAS456',  hdg: 90, alt: 9000, spd: 780 },
  { lat: 40.4, lng: -3.7,   cs: 'IBE789',  hdg: 270, alt: 11000, spd: 850 },
  { lat: 45.4, lng: 9.1,    cs: 'RYR111',  hdg: 0, alt: 9500, spd: 800 },
  
  // Asia-Pacific
  { lat: 35.7, lng: 139.7,  cs: 'JAL7',    hdg: 45,  alt: 11278, spd: 880 },
  { lat: 22.3, lng: 114.2,  cs: 'CPA100',  hdg: 310, alt: 10668, spd: 900 },
  { lat: 1.4,  lng: 103.9,  cs: 'SIA21',   hdg: 270, alt: 11582, spd: 910 },
  { lat: 37.4, lng: 126.8,  cs: 'KAL902',  hdg: 180, alt: 10058, spd: 860 },
  { lat: 13.7, lng: 100.5,  cs: 'THA910',  hdg: 90,  alt: 10362, spd: 845 },
  { lat: 28.6, lng: 77.1,   cs: 'AIC101',  hdg: 280, alt: 10972, spd: 855 },
  { lat: -33.9, lng: 151.2, cs: 'QFA1',    hdg: 320, alt: 11000, spd: 875 },
  { lat: -37.8, lng: 144.9, cs: 'VOZ222',  hdg: 0, alt: 10500, spd: 840 },
  { lat: -1.3, lng: 103.8,  cs: 'GIA333',  hdg: 90, alt: 11200, spd: 880 },
  { lat: 14.5, lng: 121.0,  cs: 'PAL444',  hdg: 180, alt: 10000, spd: 820 },
  { lat: 25.0, lng: 121.5,  cs: 'EVA555',  hdg: 270, alt: 11000, spd: 860 },
  
  // North America
  { lat: 33.9, lng: -118.4, cs: 'UAL200',  hdg: 90,  alt: 10668, spd: 840 },
  { lat: 41.9, lng: -87.9,  cs: 'AAL300',  hdg: 240, alt: 9754,  spd: 820 },
  { lat: 25.8, lng: -80.3,  cs: 'DAL500',  hdg: 10,  alt: 10058, spd: 800 },
  { lat: 47.4, lng: -122.3, cs: 'ASA600',  hdg: 180, alt: 9448,  spd: 810 },
  { lat: 45.0, lng: -93.2,  cs: 'SWA700',  hdg: 270, alt: 8534,  spd: 790 },
  { lat: 30.2, lng: -97.7,  cs: 'SWA201',  hdg: 350, alt: 9144,  spd: 795 },
  { lat: 39.8, lng: -104.8, cs: 'F9_888',  hdg: 90, alt: 10500, spd: 830 },
  { lat: 36.1, lng: -115.1, cs: 'NK_999',  hdg: 180, alt: 9000, spd: 780 },
  { lat: 32.8, lng: -96.8,  cs: 'SWA111',  hdg: 270, alt: 11000, spd: 850 },
  { lat: 43.6, lng: -79.6,  cs: 'ACA222',  hdg: 0, alt: 9500, spd: 800 },
  
  // Middle East
  { lat: 25.3, lng: 55.4,   cs: 'UAE7',    hdg: 315, alt: 12192, spd: 935 },
  { lat: 24.9, lng: 67.2,   cs: 'PIA702',  hdg: 45,  alt: 10972, spd: 860 },
  { lat: 29.7, lng: 48.0,   cs: 'QTR9',    hdg: 280, alt: 11582, spd: 920 },
  { lat: 21.5, lng: 39.1,   cs: 'SVA123',  hdg: 90, alt: 10500, spd: 830 },
  { lat: 35.6, lng: 51.3,   cs: 'IRA456',  hdg: 180, alt: 9000, spd: 780 },
  
  // Africa
  { lat: -26.1, lng: 28.2,  cs: 'SAA201',  hdg: 20,  alt: 10362, spd: 840 },
  { lat: 30.1,  lng: 31.4,  cs: 'MSR701',  hdg: 270, alt: 9754,  spd: 810 },
  { lat: 6.5, lng: 3.3,     cs: 'NIG123',  hdg: 90, alt: 10500, spd: 830 },
  { lat: 9.0, lng: 38.7,    cs: 'ETH456',  hdg: 180, alt: 9000, spd: 780 },
  
  // More scattered
  { lat: 60.0, lng: 25.0,   cs: 'FIN8',    hdg: 180, alt: 10668, spd: 855 },
  { lat: 55.6, lng: 12.7,   cs: 'SAS911',  hdg: 90,  alt: 9144,  spd: 800 },
  { lat: -23.4, lng: -46.5, cs: 'TAM3105', hdg: 260, alt: 10058, spd: 835 },
  { lat: -34.6, lng: -58.4, cs: 'ARG250',  hdg: 310, alt: 9754,  spd: 820 },
  { lat: 19.4, lng: -99.1,  cs: 'AMX800',  hdg: 90,  alt: 9448,  spd: 810 },
  { lat: 64.1, lng: -21.9,  cs: 'ICE506',  hdg: 270, alt: 8534,  spd: 780 },
  { lat: -12.0, lng: -77.0, cs: 'LAN123',  hdg: 90, alt: 10500, spd: 830 },
  { lat: 4.6, lng: -74.0,   cs: 'AVA456',  hdg: 180, alt: 9000, spd: 780 },
];

// Procedurally generate additional flights along major corridors for realistic density
function generateAdditionalFlights(): typeof SIMULATED_FLIGHTS {
  const airlines = ['AAL','UAL','DAL','SWA','BAW','AFR','DLH','KLM','QTR','UAE','SIA','CPA','JAL','ANA','KAL','EVA','THA','AIC','QFA','ANZ','LAN','TAM','AVA','AFR','IBE','RYR','EZY','WZZ','FIN','SAS','LOT','CSA','AUA','TAP','THY','ETH','SAA','RAM','EGY','MEA','GIA','MAS','PAL','VTJ','JBU','SWR','BEL','AER','CSN','CES','CCA','HDA','SJA'];
  const extra: typeof SIMULATED_FLIGHTS = [];

  // Major corridors with scatter ranges: [latCenter, lngCenter, latSpread, lngSpread, baseHdg, count]
  const corridors: [number, number, number, number, number, number][] = [
    // Trans-Atlantic eastbound
    [50, -25, 12, 30, 80, 18],
    // Trans-Atlantic westbound
    [48, -35, 10, 25, 265, 15],
    // Trans-Pacific eastbound
    [40, -160, 15, 30, 90, 14],
    // Trans-Pacific westbound
    [38, 170, 12, 25, 270, 12],
    // Europe domestic
    [48, 10, 15, 20, 0, 20],
    // North America domestic
    [38, -95, 12, 25, 0, 25],
    // Asia domestic
    [30, 110, 20, 30, 0, 20],
    // Middle East hub
    [25, 55, 8, 15, 0, 12],
    // South America
    [-15, -55, 20, 15, 0, 10],
    // Africa
    [5, 20, 25, 20, 0, 10],
    // India-SE Asia
    [18, 85, 15, 20, 90, 10],
    // Australia-NZ
    [-30, 145, 10, 15, 0, 8],
    // Oceania-Asia
    [-5, 130, 15, 25, 340, 6],
    // Europe-Asia (Silk Route)
    [45, 60, 10, 40, 90, 12],
    // Polar routes (Europe-West Coast)
    [65, -30, 10, 40, 310, 8],
    // Caribbean
    [20, -75, 8, 10, 0, 8],
  ];

  corridors.forEach(([cLat, cLng, latS, lngS, baseHdg, count]) => {
    for (let i = 0; i < count; i++) {
      const lat = cLat + (Math.random() - 0.5) * latS * 2;
      const lng = cLng + (Math.random() - 0.5) * lngS * 2;
      const hdg = (baseHdg + (Math.random() - 0.5) * 60 + 360) % 360;
      const alt = 8000 + Math.floor(Math.random() * 4000);
      const spd = 750 + Math.floor(Math.random() * 200);
      const cs = airlines[Math.floor(Math.random() * airlines.length)] + Math.floor(100 + Math.random() * 900);
      extra.push({ lat: parseFloat(lat.toFixed(1)), lng: parseFloat(lng.toFixed(1)), cs, hdg: Math.round(hdg), alt, spd });
    }
  });

  return extra;
}

const ALL_FLIGHTS = [...SIMULATED_FLIGHTS, ...generateAdditionalFlights()];

function buildFlightMarkers(L: any) {
  layerGroup.clearLayers();

  ALL_FLIGHTS.forEach(f => {
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="color:var(--text);opacity:0.9;font-size:12px;transform:rotate(${f.hdg - 45}deg);line-height:1;"><i class="ti ti-plane"></i></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([f.lat, f.lng], { icon })
      .bindPopup(`
        <div style="min-width:220px; font-family:monospace;">
          <!-- Header -->
          <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
              <i class="ti ti-plane" style="color:var(--accent); font-size:14px;"></i>
              <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${f.cs}</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">COMMERCIAL AIRCRAFT</span>
            </div>
          </div>
          
          <!-- Status badge -->
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
            <div style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite;"></div>
            <span style="color:var(--accent); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">AIRBORNE</span>
          </div>

          <!-- Navigation data -->
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">TELEMETRY</div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 8px; margin-bottom:8px;">
            <div>
              <div style="color:var(--text3); font-size:7px;">ALTITUDE</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${f.alt.toLocaleString()} <span style="font-size:7px;">m</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">SPEED</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${f.spd} <span style="font-size:7px;">km/h</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">HEADING</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${f.hdg}°</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LAT</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${f.lat.toFixed(4)}</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LNG</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${f.lng.toFixed(4)}</div>
            </div>
          </div>
        </div>
      `, { maxWidth: 260, className: 'rtm-popup' })
      .addTo(layerGroup);
  });

  globalState.flightsCount = SIMULATED_FLIGHTS.length;

  // Try live OpenSky (best-effort, won't block)
  fetchLive(L).catch(() => {});
}

async function fetchLive(L: any) {
  const res = await fetch('https://opensky-network.org/api/states/all');
  if (!res.ok) return;
  const data = await res.json();
  const states: any[] = (data.states || []).slice(0, 400);

  layerGroup.clearLayers();
  globalState.flightsCount = data.states?.length ?? SIMULATED_FLIGHTS.length;

  states.forEach((f: any) => {
    const lng = f[5], lat = f[6];
    if (!lat || !lng) return;
    const cs  = f[1]?.trim() || 'UNKNOWN';
    const spd = f[9] ? Math.round(f[9] * 3.6) : 0;
    const alt = f[7] ? Math.round(f[7]) : 0;
    const hdg = f[10] || 0;

    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="color:var(--text);opacity:0.9;font-size:12px;transform:rotate(${hdg - 45}deg);line-height:1;"><i class="ti ti-plane"></i></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    L.marker([lat, lng], { icon })
      .bindPopup(`
        <div style="min-width:220px; font-family:monospace;">
          <!-- Header -->
          <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
            <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
              <i class="ti ti-plane" style="color:var(--accent); font-size:14px;"></i>
              <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${cs}</span>
            </div>
            <div style="display:flex; align-items:center; gap:4px;">
              <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">COMMERCIAL AIRCRAFT</span>
            </div>
          </div>
          
          <!-- Status badge -->
          <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
            <div style="width:6px; height:6px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite;"></div>
            <span style="color:var(--accent); font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">AIRBORNE</span>
          </div>

          <!-- Navigation data -->
          <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">TELEMETRY</div>
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px 8px; margin-bottom:8px;">
            <div>
              <div style="color:var(--text3); font-size:7px;">ALTITUDE</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${alt.toLocaleString()} <span style="font-size:7px;">m</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">SPEED</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${spd} <span style="font-size:7px;">km/h</span></div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">HEADING</div>
              <div style="color:var(--accent); font-size:10px; font-weight:700;">${hdg}°</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LAT</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${lat.toFixed(4)}</div>
            </div>
            <div>
              <div style="color:var(--text3); font-size:7px;">LNG</div>
              <div style="color:var(--text); font-size:9px; font-weight:700;">${lng.toFixed(4)}</div>
            </div>
          </div>
        </div>
      `, { maxWidth: 260, className: 'rtm-popup' })
      .addTo(layerGroup);
  });
}

export async function initFlights(map: any, L: any) {
  layerGroup = L.layerGroup();
  buildFlightMarkers(L);
  globalState.flightsCount = ALL_FLIGHTS.length;
  // Refresh simulated positions every 90s
  setInterval(() => buildFlightMarkers(L), 90_000);
  return layerGroup;
}
