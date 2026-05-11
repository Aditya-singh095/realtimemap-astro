export function initMilitary(map: any, L: any) {
  const militaryGroup = L.layerGroup();
  const nuclearGroup = L.layerGroup();

  const MILITARY_BASES = [
    { name: 'Area 51', lat: 37.235, lng: -115.811, country: 'USA', type: 'AFB', branch: 'USAF' },
    { name: 'Diego Garcia', lat: -7.3195, lng: 72.4228, country: 'BIOT', type: 'Naval/Air Facility', branch: 'Joint' },
    { name: 'Kadena Air Base', lat: 26.3556, lng: 127.7674, country: 'Japan', type: 'AFB', branch: 'USAF' },
    { name: 'Ramstein Air Base', lat: 49.4385, lng: 7.5988, country: 'Germany', type: 'AFB', branch: 'USAF' },
    { name: 'Naval Station Norfolk', lat: 36.9388, lng: -76.3268, country: 'USA', type: 'Naval Base', branch: 'USN' },
    { name: 'Thule Air Base', lat: 76.5312, lng: -68.7032, country: 'Greenland', type: 'Space Base', branch: 'USSF' },
    { name: 'Guantanamo Bay', lat: 19.9079, lng: -75.1481, country: 'Cuba', type: 'Naval Base', branch: 'USN' },
    { name: 'Joint Base Pearl Harbor-Hickam', lat: 21.3458, lng: -157.9427, country: 'USA', type: 'Joint Base', branch: 'Joint' },
    { name: 'Okinawa USMC Base', lat: 26.3900, lng: 127.8000, country: 'Japan', type: 'MCB', branch: 'USMC' },
    { name: 'Incirlik Air Base', lat: 37.0019, lng: 35.4258, country: 'Turkey', type: 'AFB', branch: 'USAF' },
    { name: 'RAF Menwith Hill', lat: 54.0083, lng: -1.6897, country: 'UK', type: 'SIGINT', branch: 'RAF/NSA' },
    { name: 'Camp Lemonnier', lat: 11.5434, lng: 43.1492, country: 'Djibouti', type: 'Expeditionary', branch: 'USN' },
    { name: 'Al Udeid Air Base', lat: 25.1186, lng: 51.3146, country: 'Qatar', type: 'AFB', branch: 'USAF' },
    { name: 'Pine Gap', lat: -23.7990, lng: 133.7371, country: 'Australia', type: 'SIGINT', branch: 'Joint/NSA' },
    { name: 'Fort Bragg', lat: 35.1390, lng: -79.0060, country: 'USA', type: 'Army Base', branch: 'USA' },
  ];

  const NUCLEAR_BASES = [
    { name: 'Cheyenne Mountain Complex', lat: 38.7445, lng: -104.8465, country: 'USA', type: 'Bunker', depth: '610m', threat_level: 'DEFCON 3' },
    { name: 'Mount Yamantau', lat: 54.2562, lng: 58.1022, country: 'Russia', type: 'Bunker', depth: 'Classified', threat_level: 'CLASSIFIED' },
    { name: 'Site R (Raven Rock)', lat: 39.7347, lng: -77.4194, country: 'USA', type: 'Bunker', depth: '200m', threat_level: 'DEFCON 3' },
    { name: 'Kosvinsky Kamen', lat: 59.5208, lng: 59.0608, country: 'Russia', type: 'Command Post', depth: '300m', threat_level: 'DEFCON 2' },
    { name: 'Mount Weather', lat: 39.0628, lng: -77.8879, country: 'USA', type: 'Bunker', depth: 'Classified', threat_level: 'DEFCON 4' },
    { name: 'Jianggezhuang Naval Base', lat: 36.1260, lng: 120.5736, country: 'China', type: 'Sub Base', depth: 'Sea Cave', threat_level: 'DEFCON 3' },
    { name: 'Yulin Naval Base', lat: 18.2166, lng: 109.6833, country: 'China', type: 'Sub Base', depth: 'Sea Cave', threat_level: 'DEFCON 3' },
    { name: 'Olavsvern', lat: 69.5317, lng: 19.0069, country: 'Norway', type: 'Sub Base', depth: 'Sea Cave', threat_level: 'DEFCON 4' },
    { name: 'Muskö Naval Base', lat: 58.9958, lng: 17.9625, country: 'Sweden', type: 'Sub Base', depth: 'Sea Cave', threat_level: 'DEFCON 4' },
    { name: 'Kapustin Yar (Zhitkur)', lat: 48.5667, lng: 45.7167, country: 'Russia', type: 'Research', depth: 'Underground', threat_level: 'CLASSIFIED' },
  ];

  const createIcon = (color: string, iconClass: string) => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
        <div style="
          width:18px; height:18px; 
          background:${color}22; 
          border:1px solid ${color}; 
          border-radius:3px; 
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 10px ${color}44;
          transform: rotate(45deg);
        ">
          <div style="color:${color}; font-size:10px; transform: rotate(-45deg);"><i class="${iconClass}"></i></div>
        </div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });

  const createNuclearIcon = (color: string) => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="position:relative; display:flex; flex-direction:column; align-items:center; z-index: 1000;">
        <div style="
          width:22px; height:22px; 
          background:${color}33; 
          border:1.5px dashed ${color}; 
          border-radius:50%; 
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 15px ${color}88, inset 0 0 10px ${color}88;
          animation: pulseNuke 2s infinite alternate;
        ">
          <div style="color:${color}; font-size:12px; text-shadow: 0 0 5px ${color};"><i class="ti ti-radioactive"></i></div>
        </div>
      </div>
      <style>
        @keyframes pulseNuke {
          from { transform: scale(0.95); opacity: 0.8; box-shadow: 0 0 10px ${color}44; }
          to { transform: scale(1.05); opacity: 1; box-shadow: 0 0 20px ${color}, inset 0 0 15px ${color}; }
        }
      </style>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });

  MILITARY_BASES.forEach(base => {
    const marker = L.marker([base.lat, base.lng], { icon: createIcon('#6b8e23', 'ti-shield-check') });
    marker.bindPopup(`
      <div style="min-width:200px; font-family:monospace;" class="rtm-popup">
        <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid var(--border2);">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
            <i class="ti ti-shield" style="color:#6b8e23; font-size:12px;"></i>
            <span style="color:var(--text); font-size:10px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase;">${base.name}</span>
          </div>
          <div style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${base.country} • ${base.type}</div>
        </div>
        <div style="color:#6b8e23; font-size:9px; font-weight:700; margin-bottom:4px;">STATUS: SECURE</div>
        <div style="color:var(--text2); font-size:8px; margin-bottom:4px;">BRANCH: ${base.branch}</div>
        <div style="color:var(--text3); font-size:7px;">LAT: ${base.lat.toFixed(4)} | LNG: ${base.lng.toFixed(4)}</div>
      </div>
    `, { className: 'rtm-popup' });
    marker.addTo(militaryGroup);
  });

  NUCLEAR_BASES.forEach(base => {
    const marker = L.marker([base.lat, base.lng], { icon: createNuclearIcon('#ff3a3a') });
    marker.bindPopup(`
      <div style="min-width:220px; font-family:monospace;" class="rtm-popup">
        <div style="background:var(--bg4); margin:-10px -12px 8px; padding:8px 12px; border-bottom:1px solid #ff3a3a44;">
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
            <i class="ti ti-radioactive" style="color:#ff3a3a; font-size:14px; animation: pulseNuke 2s infinite alternate;"></i>
            <span style="color:#ff3a3a; font-size:11px; font-weight:700; letter-spacing:0.05em; text-transform:uppercase; text-shadow: 0 0 5px #ff3a3a88;">${base.name}</span>
          </div>
          <div style="color:var(--text3); font-size:8px; text-transform:uppercase; letter-spacing:0.08em;">${base.country} • UNDERGROUND FACILITY</div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
           <div>
             <div style="color:var(--text3); font-size:7px; letter-spacing:0.1em;">EST. DEPTH</div>
             <div style="color:var(--text); font-size:9px; font-weight:bold;">${base.depth}</div>
           </div>
           <div>
             <div style="color:var(--text3); font-size:7px; letter-spacing:0.1em;">THREAT LEVEL</div>
             <div style="color:var(--yellow); font-size:9px; font-weight:bold;">${base.threat_level}</div>
           </div>
        </div>
        <div style="background:#ff3a3a; color:var(--bg); padding:4px; text-align:center; font-size:8px; font-weight:bold; letter-spacing:0.2em; text-transform:uppercase; margin-top:8px;">RESTRICTED ZONE</div>
      </div>
    `, { className: 'rtm-popup' });
    marker.addTo(nuclearGroup);
  });

  return { militaryGroup, nuclearGroup };
}
