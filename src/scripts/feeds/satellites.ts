import { globalState } from '../metrics.ts';

let satelliteGroup: any = null;
let issMarker: any = null;
let issInterval: any = null;

function rnd(min: number, max: number) { return Math.random() * (max - min) + min; }
function rndInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

export async function initSatellites(map: any, L: any) {
  satelliteGroup = L.layerGroup();

  const satIcon = (color = 'var(--text2)', label = '') => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; gap:1px;">
        <div style="color: ${color}; opacity: 0.95; font-size: 11px; animation: satBlink 2s infinite;">
          <i class="ti ti-satellite"></i>
        </div>
        ${label ? `<div style="color:${color}; font-family: monospace; font-size: 6px; font-weight: 700; letter-spacing: 0.05em; opacity: 0.8; white-space: nowrap;">${label}</div>` : ''}
      </div>
    `,
    iconSize: [24, 20],
    iconAnchor: [12, 10]
  });

  const getDetailedPopup = (name: string, type: string, orbit: string, alt: number | string, color: string, inc: number | string, freq: string, status: string = 'OPERATIONAL', norad: number) => `
    <div style="min-width:220px; font-family:monospace; margin: 0; padding: 0;" class="rtm-popup">
      <!-- Header -->
      <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
        <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
          <i class="ti ti-satellite" style="color:${color}; font-size:14px;"></i>
          <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em;">${name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <span style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${type} • ORBIT: ${orbit}</span>
        </div>
      </div>

      <!-- Status badge -->
      <div style="display:flex; align-items:center; gap:5px; margin-bottom:8px;">
        <div style="width:6px; height:6px; border-radius:50%; background:${status === 'OPERATIONAL' ? '#2ae500' : 'var(--yellow)'}; animation:${status === 'OPERATIONAL' ? 'pulse 2s infinite' : 'none'};"></div>
        <span style="color:${status === 'OPERATIONAL' ? '#2ae500' : 'var(--yellow)'}; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;">${status}</span>
      </div>

      <!-- Specs -->
      <div style="color:var(--text3); font-size:7px; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:4px;">TELEMETRY & ORBIT</div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px 12px; margin-bottom:8px;">
        <div>
          <div style="color:var(--text3); font-size:7px;">ALTITUDE</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${typeof alt === 'number' ? alt.toLocaleString() : alt} <span style="font-size:7px;">km</span></div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">INCLINATION</div>
          <div style="color:var(--accent); font-size:10px; font-weight:700;">${inc}°</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">NORAD ID</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${norad}</div>
        </div>
        <div>
          <div style="color:var(--text3); font-size:7px;">BAND/FREQ</div>
          <div style="color:var(--text); font-size:9px; font-weight:700;">${freq}</div>
        </div>
      </div>
    </div>
  `;

  // ─── ISS Real-time ───────────────────────────────────────────────────────
  async function fetchISS() {
    try {
      const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
      if (!res.ok) throw new Error('ISS API failed');
      const data = await res.json();
      const { latitude: lat, longitude: lng, velocity, altitude } = data;

      if (issMarker) {
        issMarker.setLatLng([lat, lng]);
        issMarker.setPopupContent(getDetailedPopup('ISS (ZARYA)', 'CREWED STATION', 'LEO', altitude.toFixed(1), 'var(--accent)', 51.6, 'VHF/UHF', 'CREWED / ACTIVE', 25544));
      } else {
        issMarker = L.marker([lat, lng], { icon: satIcon('var(--accent)', 'ISS') })
          .bindPopup(getDetailedPopup('ISS (ZARYA)', 'CREWED STATION', 'LEO', altitude.toFixed(1), 'var(--accent)', 51.6, 'VHF/UHF', 'CREWED / ACTIVE', 25544), { maxWidth: 260, className: 'rtm-popup' });
        issMarker.addTo(satelliteGroup);
      }
    } catch {
      // silent fail — ISS API occasionally rate limits
    }
  }

  // ─── Simulated LEO Constellations ────────────────────────────────────────
  const leoSats: any[] = [];
  
  // Starlink (Communication)
  for (let i = 0; i < 45; i++) {
    leoSats.push({
      name: `STARLINK-${rndInt(1000, 9999)}`, lat: rnd(-70, 70), lng: rnd(-180, 180), inc: 53.0, color: '#888',
      type: 'COMMUNICATIONS', orbit: 'LEO', alt: rndInt(540, 560), freq: 'Ku/Ka-band', norad: rndInt(40000, 55000), speed: rnd(0.3, 0.7)
    });
  }
  // OneWeb (Communication)
  for (let i = 0; i < 20; i++) {
    leoSats.push({
      name: `ONEWEB-${rndInt(100, 999)}`, lat: rnd(-85, 85), lng: rnd(-180, 180), inc: 87.9, color: '#5af',
      type: 'COMMUNICATIONS', orbit: 'LEO', alt: rndInt(1190, 1210), freq: 'Ku/Ka-band', norad: rndInt(44000, 48000), speed: rnd(0.2, 0.5)
    });
  }
  // Iridium (Communication)
  for (let i = 0; i < 15; i++) {
    leoSats.push({
      name: `IRIDIUM NEXT ${rndInt(100, 199)}`, lat: rnd(-85, 85), lng: rnd(-180, 180), inc: 86.4, color: '#0df',
      type: 'COMMUNICATIONS', orbit: 'LEO', alt: rndInt(770, 790), freq: 'L/Ka-band', norad: rndInt(42000, 43000), speed: rnd(0.25, 0.6)
    });
  }
  // Earth Observation / Weather
  const eoNames = ['SENTINEL-1A', 'SENTINEL-2A', 'LANDSAT-8', 'LANDSAT-9', 'NOAA-20', 'SUOMI NPP', 'TERRA', 'AQUA', 'GOES-16', 'METOP-C'];
  eoNames.forEach(name => {
    leoSats.push({
      name, lat: rnd(-80, 80), lng: rnd(-180, 180), inc: rnd(97, 99).toFixed(1), color: '#0df',
      type: 'EARTH OBSERVATION', orbit: 'SSO', alt: rndInt(690, 800), freq: 'X-band', norad: rndInt(25000, 50000), speed: rnd(0.1, 0.3)
    });
  });

  // MEO (GPS / Navigation)
  for (let i = 0; i < 15; i++) {
    leoSats.push({
      name: `NAVSTAR ${rndInt(50, 80)} (USA-${rndInt(100, 300)})`, lat: rnd(-55, 55), lng: rnd(-180, 180), inc: 55.0, color: '#fa0',
      type: 'NAVIGATION (GPS)', orbit: 'MEO', alt: 20200, freq: 'L-band (L1/L2)', norad: rndInt(20000, 45000), speed: rnd(0.05, 0.1)
    });
  }
  for (let i = 0; i < 10; i++) {
    leoSats.push({
      name: `GALILEO ${rndInt(10, 30)}`, lat: rnd(-56, 56), lng: rnd(-180, 180), inc: 56.0, color: '#fa0',
      type: 'NAVIGATION', orbit: 'MEO', alt: 23222, freq: 'L-band', norad: rndInt(35000, 50000), speed: rnd(0.04, 0.08)
    });
  }

  // GEO satellites (fixed orbit ~35,786 km)
  const geoSats: any[] = [];
  const geoNames = [
    'INTELSAT 19','INTELSAT 20','SES-12','SES-14','EUTELSAT 33E','EUTELSAT 7C',
    'AMC-6','AMC-15','DIRECTV-14','DIRECTV-15','ECHOSTAR 105','INMARSAT-5 F4',
    'ASTRA 1M','ASTRA 2E','YAMAL 401','EXPRESS AM7','ARABSAT-5C','TURKSAT 4A',
    'INSAT-3DR','GSAT-31','OPTUS 10','NBN CO 1A'
  ];
  geoNames.forEach((name, i) => {
    geoSats.push({ 
      name, lat: 0, lng: -180 + (i * (360 / geoNames.length)) + rnd(-5, 5), color: '#b06aff',
      type: 'BROADCAST / COMM', orbit: 'GEO', alt: 35786, inc: 0.0, freq: 'C/Ku/Ka-band', norad: rndInt(20000, 50000)
    });
  });

  // Add LEO/MEO sats with animated positions
  let t = 0;
  const leoMarkers: any[] = [];

  leoSats.forEach(sat => {
    const m = L.marker([sat.lat, sat.lng], { icon: satIcon(sat.color, sat.name) })
      .bindPopup(getDetailedPopup(sat.name, sat.type, sat.orbit, sat.alt, sat.color, sat.inc, sat.freq, 'OPERATIONAL', sat.norad), { maxWidth: 260, className: 'rtm-popup' });
    m.addTo(satelliteGroup);
    leoMarkers.push({ marker: m, sat });
  });

  geoSats.forEach(sat => {
    L.marker([sat.lat, sat.lng], { icon: satIcon(sat.color, sat.name) })
      .bindPopup(getDetailedPopup(sat.name, sat.type, sat.orbit, sat.alt, sat.color, sat.inc, sat.freq, 'OPERATIONAL', sat.norad), { maxWidth: 260, className: 'rtm-popup' })
      .addTo(satelliteGroup);
  });

  // Update global count
  globalState.satsCount = leoSats.length + geoSats.length + 1; // +1 for ISS

  // Animate non-GEO satellites
  setInterval(() => {
    t += 1;
    leoMarkers.forEach(({ marker, sat }) => {
      const newLng = ((sat.lng + t * sat.speed) % 360 + 360) % 360;
      const adjustedLng = newLng > 180 ? newLng - 360 : newLng;
      // create a slight wavy motion based on inclination
      marker.setLatLng([sat.lat + Math.sin(t * 0.05 * sat.speed) * (sat.inc > 60 ? 5 : 2), adjustedLng]);
    });
  }, 2000);

  // Start ISS tracking
  await fetchISS();
  issInterval = setInterval(fetchISS, 5000);

  return satelliteGroup;
}
