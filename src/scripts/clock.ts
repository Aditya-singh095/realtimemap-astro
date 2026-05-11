function updateClock() {
  const clockEl = document.getElementById('sys-clock');
  if (!clockEl) return;
  
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, '0');
  const m = String(now.getUTCMinutes()).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');
  
  clockEl.textContent = `${h}:${m}:${s} UTC`;
}

setInterval(updateClock, 1000);
updateClock();
