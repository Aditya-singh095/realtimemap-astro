let tick = 0;

// Global state exported for other components to update
export const globalState = {
  eqCount: 0,
  flightsCount: 0,
  shipsCount: 0,
  satsCount: 0,
  assetsCount: 15
};

function drawSparklines() {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  const yellow = getComputedStyle(document.documentElement).getPropertyValue('--yellow').trim();
  
  const charts = [
    { id: 'sp-m1', base: 20, variance: 5, color: accent },
    { id: 'sp-m2', base: 56, variance: 8, color: accent },
    { id: 'sp-m3', base: 450, variance: 30, color: yellow },
    { id: 'sp-m4', base: 152, variance: 10, color: accent },
    { id: 'sp-m5', base: 5, variance: 0, color: accent }
  ];

  charts.forEach(({ id, base, variance, color }) => {
    const svg = document.getElementById(id);
    if (!svg) return;
    
    // Simulate data
    const vals = Array.from({ length: 20 }, () => base + Math.round((Math.random() - 0.5) * variance * 2));
    const mx = Math.max(...vals);
    const mn = Math.min(...vals);
    const rng = mx - mn || 1;
    
    // Y mapped 2 to 14 (padding)
    const pts = vals.map((v, i) => `${(i / 19) * 100},${16 - (((v - mn) / rng) * 12 + 2)}`).join(' ');
    
    svg.innerHTML = `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.2" stroke-linejoin="round"/>`;
  });
}

function updateMetrics() {
  tick++;
  
  // Earthquake count
  const eqEl = document.getElementById('val-eq');
  if (eqEl) eqEl.textContent = String(globalState.eqCount).padStart(2, '0');
  
  // Active flights count
  const flightsEl = document.getElementById('val-flights');
  if (flightsEl) flightsEl.textContent = String(globalState.flightsCount);
  
  // Ships count
  const shipsEl = document.getElementById('val-ships');
  if (shipsEl) shipsEl.textContent = String(globalState.shipsCount);
  
  // Satellites count
  const satsEl = document.getElementById('val-sats');
  if (satsEl) satsEl.textContent = String(globalState.satsCount);
  
  // Data sources
  const srcEl = document.getElementById('val-src');
  if (srcEl) srcEl.textContent = '05';
  
  // Status bar feed counts
  const feedCountEl = document.getElementById('status-feed-count');
  if (feedCountEl) feedCountEl.textContent = `FLIGHTS: ${globalState.flightsCount} | SHIPS: ${globalState.shipsCount} | SATS: ${globalState.satsCount}`;
  
  // Uplink HUD
  const up = 72 + Math.round(Math.sin(tick * 0.4) * 10);
  const upBar = document.getElementById('hud-upBar');
  if (upBar) upBar.style.width = up + '%';
  const upPct = document.getElementById('hud-upPct');
  if (upPct) upPct.textContent = `${up}% — 5 FEEDS LIVE`;
  
  if (tick % 5 === 0) drawSparklines();
}

// Initial draw
drawSparklines();
// Update every 900ms
setInterval(updateMetrics, 900);

// Redraw sparklines on theme change
window.addEventListener('rtm-theme-changed', drawSparklines);
