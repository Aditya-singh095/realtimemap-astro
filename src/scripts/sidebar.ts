// ─── Sidebar Panel Interactions ───────────────────────────────────────────────
// Handles: nav buttons, side panels, new report modal, logs

let cachedAlerts: any[] = [];

// Listen for alert data
window.addEventListener('alerts-updated', (e: any) => {
  cachedAlerts = e.detail.alerts || [];
});

// Panel content generators
const panelContent: Record<string, () => { icon: string; title: string; html: string }> = {
  signals: () => ({
    icon: 'ti-radar',
    title: 'Signal Intelligence',
    html: `
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">ACTIVE SIGNAL INTERCEPTS</div>
      ${generateSignalEntries()}
      <div class="mt-4 p-2 border border-border2 bg-bg4">
        <div class="font-mono text-[7px] font-bold tracking-[0.1em] uppercase text-text3 mb-2">SIGNAL STRENGTH DISTRIBUTION</div>
        <div class="flex gap-1 h-8 items-end">
          ${Array.from({ length: 20 }, () => {
            const h = 10 + Math.random() * 90;
            return `<div style="flex:1; height:${h}%; background:var(--accent); opacity:${0.3 + Math.random() * 0.7};"></div>`;
          }).join('')}
        </div>
      </div>
    `
  }),

  critical: () => ({
    icon: 'ti-alert-triangle',
    title: 'Critical Alerts',
    html: `
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">HIGH PRIORITY EVENTS</div>
      ${cachedAlerts
        .filter(a => a.properties.mag >= 4.5)
        .slice(0, 10)
        .map(a => `
          <div class="p-2 border-b border-border border-l-2 border-l-red mb-1 hover:bg-bg4 transition-colors cursor-pointer">
            <div class="flex justify-between items-center mb-1">
              <span class="font-mono text-[8px] font-bold text-red uppercase">MAG ${a.properties.mag.toFixed(1)}</span>
              <span class="font-mono text-[7px] text-text3">${new Date(a.properties.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="text-[9px] text-text2 leading-tight">${a.properties.place}</div>
          </div>
        `).join('') || `
        <div class="p-3 text-center">
          <i class="ti ti-shield-check text-accent text-[24px] block mb-2"></i>
          <div class="font-mono text-[9px] text-text2">No critical alerts at this time</div>
          <div class="font-mono text-[7px] text-text3 mt-1">Threshold: MAG 4.5+</div>
        </div>
      `}
    `
  }),

  cases: () => ({
    icon: 'ti-folder-open',
    title: 'Case Files',
    html: `
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">OPEN INVESTIGATIONS</div>
      ${[
        { id: 'CS-2026-001', title: 'Pacific Rim Seismic Cluster', status: 'ACTIVE', priority: 'HIGH', color: 'text-red' },
        { id: 'CS-2026-002', title: 'Atlantic Cable Anomaly', status: 'MONITORING', priority: 'MEDIUM', color: 'text-yellow' },
        { id: 'CS-2026-003', title: 'Vessel Route Deviation — Malacca', status: 'ACTIVE', priority: 'HIGH', color: 'text-red' },
        { id: 'CS-2026-004', title: 'Satellite Orbital Decay — STARLINK', status: 'RESOLVED', priority: 'LOW', color: 'text-accent' },
        { id: 'CS-2026-005', title: 'Mediterranean Traffic Surge', status: 'MONITORING', priority: 'MEDIUM', color: 'text-yellow' },
        { id: 'CS-2026-006', title: 'Arctic Fiber Cable Integrity', status: 'ACTIVE', priority: 'HIGH', color: 'text-red' },
      ].map(c => `
        <div class="p-2 border-b border-border hover:bg-bg4 transition-colors cursor-pointer group">
          <div class="flex justify-between items-center mb-1">
            <span class="font-mono text-[8px] font-bold text-accent">${c.id}</span>
            <span class="font-mono text-[7px] font-bold ${c.color}">${c.priority}</span>
          </div>
          <div class="text-[9px] text-text leading-tight mb-1">${c.title}</div>
          <div class="flex gap-1">
            <span class="font-mono text-[7px] font-bold px-1 py-[1px] border border-border2 text-text3">${c.status}</span>
          </div>
        </div>
      `).join('')}
    `
  }),

  telemetry: () => ({
    icon: 'ti-chart-line',
    title: 'Telemetry Dashboard',
    html: `
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">REAL-TIME SYSTEM METRICS</div>
      ${[
        { label: 'API Response Time', value: `${(50 + Math.random() * 150).toFixed(0)}ms`, bar: 30 + Math.random() * 40 },
        { label: 'Data Throughput', value: `${(1.2 + Math.random() * 3).toFixed(1)} MB/s`, bar: 40 + Math.random() * 50 },
        { label: 'Active Connections', value: `${Math.floor(3 + Math.random() * 5)}`, bar: 60 + Math.random() * 30 },
        { label: 'Cache Hit Rate', value: `${(85 + Math.random() * 14).toFixed(1)}%`, bar: 85 + Math.random() * 14 },
        { label: 'Map Tile Requests', value: `${Math.floor(100 + Math.random() * 400)}/min`, bar: 20 + Math.random() * 60 },
        { label: 'WebSocket Latency', value: `${(5 + Math.random() * 25).toFixed(0)}ms`, bar: 10 + Math.random() * 30 },
      ].map(m => `
        <div class="mb-3">
          <div class="flex justify-between mb-1">
            <span class="font-mono text-[8px] font-bold text-text2 uppercase tracking-wider">${m.label}</span>
            <span class="font-mono text-[8px] font-bold text-accent">${m.value}</span>
          </div>
          <div class="h-1 bg-bg5 border border-border">
            <div style="width:${m.bar}%; height:100%; background:var(--accent); transition:width 0.6s;"></div>
          </div>
        </div>
      `).join('')}
      <div class="mt-4 p-2 border border-border2 bg-bg4">
        <div class="font-mono text-[7px] font-bold tracking-[0.1em] uppercase text-text3 mb-2">FEED STATUS</div>
        ${[
          { name: 'USGS Seismic', status: 'CONNECTED', color: '#2ae500' },
          { name: 'OpenSky Network', status: 'SIMULATED', color: '#f5c400' },
          { name: 'AIS Maritime', status: 'SIMULATED', color: '#f5c400' },
          { name: 'ISS Tracker', status: 'CONNECTED', color: '#2ae500' },
          { name: 'Submarine Cables', status: 'CACHED', color: '#3b9eff' },
        ].map(f => `
          <div class="flex items-center gap-2 py-1">
            <div style="width:5px; height:5px; background:${f.color}; border-radius:50%;"></div>
            <span class="font-mono text-[8px] text-text2 flex-1">${f.name}</span>
            <span class="font-mono text-[7px] font-bold" style="color:${f.color}">${f.status}</span>
          </div>
        `).join('')}
      </div>
    `
  }),

  logs: () => ({
    icon: 'ti-terminal',
    title: 'System Logs',
    html: `
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">EVENT LOG</div>
      <div class="bg-bg font-mono text-[9px] p-2 border border-border2 max-h-[60vh] overflow-y-auto">
        ${generateLogEntries()}
      </div>
    `
  }),

  support: () => ({
    icon: 'ti-help',
    title: 'Help & Support',
    html: `
      <div class="font-mono text-[7px] font-bold tracking-[0.15em] uppercase text-text3 mb-3">INFORMATION</div>
      <div class="space-y-3">
        <div class="p-2 border border-border2 bg-bg4">
          <div class="font-mono text-[9px] font-bold text-accent mb-1">Keyboard Shortcuts</div>
          <div class="font-mono text-[8px] text-text2 space-y-1">
            <div><span class="text-text3">Search:</span> Click search bar + Enter</div>
            <div><span class="text-text3">Zoom:</span> Mouse wheel / +- buttons</div>
            <div><span class="text-text3">Pan:</span> Click & drag map</div>
          </div>
        </div>
        <div class="p-2 border border-border2 bg-bg4">
          <div class="font-mono text-[9px] font-bold text-accent mb-1">Data Sources</div>
          <div class="font-mono text-[8px] text-text2 space-y-1">
            <div>• USGS Earthquake Hazards (live)</div>
            <div>• OpenSky Network (simulated fallback)</div>
            <div>• AIS Maritime Data (simulated)</div>
            <div>• Where The ISS At (live)</div>
            <div>• Submarine Cable Map (cached)</div>
          </div>
        </div>
        <div class="p-2 border border-border2 bg-bg4">
          <div class="font-mono text-[9px] font-bold text-accent mb-1">Version</div>
          <div class="font-mono text-[8px] text-text2">REALTIMEMAP v5.0.0-ASTRO</div>
          <div class="font-mono text-[7px] text-text3 mt-1">Built with Astro + Leaflet.js</div>
        </div>
      </div>
    `
  }),
};

function generateSignalEntries(): string {
  const types = ['RF BURST', 'ADS-B', 'AIS', 'GNSS', 'SATCOM', 'VHF', 'UHF', 'HF SKIP'];
  const bands = ['VHF', 'UHF', 'L-BAND', 'S-BAND', 'X-BAND', 'KU-BAND', 'KA-BAND', 'HF'];
  const sources = ['AIRBORNE', 'MARITIME', 'GROUND', 'ORBITAL', 'UNKNOWN'];

  return Array.from({ length: 8 }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    const band = bands[Math.floor(Math.random() * bands.length)];
    const src = sources[Math.floor(Math.random() * sources.length)];
    const strength = -20 - Math.floor(Math.random() * 80);
    const freq = (100 + Math.random() * 12000).toFixed(1);

    return `
      <div class="p-2 border-b border-border hover:bg-bg4 transition-colors cursor-pointer">
        <div class="flex justify-between items-center mb-1">
          <span class="font-mono text-[8px] font-bold text-accent">${type}</span>
          <span class="font-mono text-[7px] text-text3">${strength} dBm</span>
        </div>
        <div class="flex gap-1 flex-wrap">
          <span class="font-mono text-[7px] px-1 py-[1px] border border-border2 text-text3">${band}</span>
          <span class="font-mono text-[7px] px-1 py-[1px] border border-border2 text-text3">${freq} MHz</span>
          <span class="font-mono text-[7px] px-1 py-[1px] border border-border2 text-text3">${src}</span>
        </div>
      </div>
    `;
  }).join('');
}

function generateLogEntries(): string {
  const events = [
    { t: 'INFO', c: '#2ae500', msg: 'Map tile layer initialized — dark mode' },
    { t: 'INFO', c: '#2ae500', msg: 'USGS earthquake feed connected' },
    { t: 'WARN', c: '#f5c400', msg: 'OpenSky API rate limited — using simulated data' },
    { t: 'INFO', c: '#2ae500', msg: 'AIS maritime simulation started — 450 vessels' },
    { t: 'INFO', c: '#2ae500', msg: 'ISS tracker connected — updating every 5s' },
    { t: 'INFO', c: '#2ae500', msg: 'Submarine cable routes loaded (26 cables)' },
    { t: 'WARN', c: '#f5c400', msg: 'Satellite TLE data — using cached positions' },
    { t: 'INFO', c: '#2ae500', msg: 'Pipeline overlay rendered — 6 routes' },
    { t: 'OK', c: '#2ae500', msg: 'All data feeds nominal — 5 sources active' },
    { t: 'INFO', c: '#2ae500', msg: 'Sparkline charts initialized' },
    { t: 'INFO', c: '#2ae500', msg: 'Theme engine loaded — accent: green, mode: dark' },
    { t: 'WARN', c: '#f5c400', msg: 'Geolocation permission not granted' },
    { t: 'INFO', c: '#2ae500', msg: 'Search geocoder ready — Nominatim API' },
    { t: 'INFO', c: '#2ae500', msg: 'Layer panel controls bound' },
  ];

  const now = new Date();
  return events.map((e, i) => {
    const t = new Date(now.getTime() - i * 3000);
    const ts = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `<div class="py-0.5 border-b border-border/30"><span class="text-text3">[${ts}]</span> <span style="color:${e.c}">[${e.t}]</span> <span class="text-text2">${e.msg}</span></div>`;
  }).join('');
}

// ─── DOM Setup ────────────────────────────────────────────────────────────────
function initSidebar() {
  const overlay = document.getElementById('side-panel-overlay');
  const panel = document.getElementById('side-panel');
  const spIcon = document.getElementById('sp-icon');
  const spTitle = document.getElementById('sp-title');
  const spContent = document.getElementById('sp-content');
  const spClose = document.getElementById('sp-close');

  // Report modal
  const reportModal = document.getElementById('report-modal');
  const reportClose = document.getElementById('report-close');
  const reportSubmit = document.getElementById('report-submit');
  const reportBtn = document.getElementById('btn-new-report');

  function openPanel(panelId: string) {
    const gen = panelContent[panelId];
    if (!gen || !overlay || !spIcon || !spTitle || !spContent) return;

    const data = gen();
    spIcon.className = `ti ${data.icon} text-accent text-[14px]`;
    spTitle.textContent = data.title;
    spContent.innerHTML = data.html;
    overlay.style.display = 'flex';

    // Update active state on nav
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      const btnPanel = btn.getAttribute('data-panel');
      if (btnPanel === panelId) {
        btn.classList.add('bg-accent/20', 'border-accent', 'text-accent', 'active-nav');
        btn.classList.remove('border-transparent', 'text-text2');
      } else if (btnPanel !== 'dashboard') {
        btn.classList.remove('bg-accent/20', 'border-accent', 'text-accent', 'active-nav');
        btn.classList.add('border-transparent', 'text-text2');
      }
    });
  }

  function closePanel() {
    if (overlay) overlay.style.display = 'none';
    // Reset nav states
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      const panelId = btn.getAttribute('data-panel');
      if (panelId === 'dashboard' || btn.id === 'nav-dashboard') {
        btn.classList.add('bg-accent/20', 'border-accent', 'text-accent', 'active-nav');
        btn.classList.remove('border-transparent', 'text-text2');
      } else {
        btn.classList.remove('bg-accent/20', 'border-accent', 'text-accent', 'active-nav');
        btn.classList.add('border-transparent', 'text-text2');
      }
    });
  }

  // Nav button clicks
  document.querySelectorAll<HTMLElement>('.sidebar-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('data-panel');
      if (!panelId || panelId === 'dashboard') {
        closePanel();
        return;
      }
      openPanel(panelId);
    });
  });

  // Close panel
  if (spClose) spClose.addEventListener('click', closePanel);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePanel();
    });
  }

  // New Report modal
  if (reportBtn && reportModal) {
    reportBtn.addEventListener('click', () => {
      reportModal.style.display = 'flex';
    });
  }
  if (reportClose && reportModal) {
    reportClose.addEventListener('click', () => {
      reportModal.style.display = 'none';
    });
  }
  if (reportModal) {
    reportModal.addEventListener('click', (e) => {
      if (e.target === reportModal) reportModal.style.display = 'none';
    });
  }
  if (reportSubmit && reportModal) {
    reportSubmit.addEventListener('click', () => {
      reportModal.style.display = 'none';
      // Show brief success notification
      showToast('Report submitted successfully');
    });
  }

  // Report priority toggle
  document.querySelectorAll<HTMLElement>('.report-priority').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.report-priority').forEach(b => {
        b.classList.remove('border-accent', 'text-accent', 'border-yellow', 'text-yellow', 'border-red', 'text-red');
        b.classList.add('border-border2', 'text-text2');
      });
      const text = btn.textContent?.trim().toLowerCase();
      if (text === 'low') { btn.classList.add('border-accent', 'text-accent'); btn.classList.remove('border-border2', 'text-text2'); }
      else if (text === 'medium') { btn.classList.add('border-yellow', 'text-yellow'); btn.classList.remove('border-border2', 'text-text2'); }
      else if (text === 'high') { btn.classList.add('border-red', 'text-red'); btn.classList.remove('border-border2', 'text-text2'); }
    });
  });
}

// Toast notification
function showToast(msg: string) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="ti ti-check text-accent"></i>
      <span class="font-mono text-[9px] font-bold text-text">${msg}</span>
    </div>
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Export for notification panel
(window as any).__showToast = showToast;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebar);
} else {
  initSidebar();
}
