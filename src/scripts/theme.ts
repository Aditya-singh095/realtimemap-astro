const ACCENTS = [
  { id: 'green',  accent: '#2ae500', dim: '#1a8c00', bg: '#0d2200', on: '#000000' },
  { id: 'blue',   accent: '#3b9eff', dim: '#1a6fcc', bg: '#001a3a', on: '#000000' },
  { id: 'orange', accent: '#ff7a2a', dim: '#cc5200', bg: '#2a1200', on: '#000000' },
  { id: 'yellow', accent: '#f5d800', dim: '#c4ad00', bg: '#252000', on: '#000000' },
  { id: 'red',    accent: '#ff3a3a', dim: '#cc1a1a', bg: '#2a0000', on: '#000000' },
  { id: 'purple', accent: '#b06aff', dim: '#7a3acc', bg: '#1a0033', on: '#000000' },
  { id: 'cyan',   accent: '#00d4d4', dim: '#008a8a', bg: '#001f1f', on: '#000000' }
];

let isLight = false;
let currentAccentId = 'green';

function initTheme() {
  const savedMode = localStorage.getItem('rtm-mode');
  const savedAccent = localStorage.getItem('rtm-accent');
  
  if (savedMode === 'light') isLight = true;
  if (savedAccent) currentAccentId = savedAccent;
  
  applyMode();
  applyAccent(currentAccentId);
  setupListeners();
}

function applyMode() {
  const html = document.documentElement;
  const modeTrack = document.getElementById('mode-track');
  const modeThumb = document.getElementById('mode-thumb');
  const modeLbl = document.getElementById('mode-lbl');
  
  if (isLight) {
    html.classList.add('light-mode');
    if (modeTrack) modeTrack.classList.add('bg-accent');
    if (modeThumb) {
      modeThumb.classList.add('left-[15px]', 'bg-accent-on');
      modeThumb.classList.remove('bg-text');
    }
    if (modeLbl) modeLbl.textContent = 'Light Mode';
  } else {
    html.classList.remove('light-mode');
    if (modeTrack) modeTrack.classList.remove('bg-accent');
    if (modeThumb) {
      modeThumb.classList.remove('left-[15px]', 'bg-accent-on');
      modeThumb.classList.add('bg-text');
    }
    if (modeLbl) modeLbl.textContent = 'Dark Mode';
  }
  
  // Re-apply accent to handle bg opacity changes based on mode
  applyAccent(currentAccentId);
  localStorage.setItem('rtm-mode', isLight ? 'light' : 'dark');
}

function applyAccent(id: string) {
  currentAccentId = id;
  const a = ACCENTS.find(acc => acc.id === id) || ACCENTS[0];
  const root = document.documentElement;
  
  root.style.setProperty('--accent', a.accent);
  root.style.setProperty('--accent-dim', a.dim);
  root.style.setProperty('--accent-bg', isLight ? a.accent + '22' : a.bg);
  root.style.setProperty('--accent-on', a.on);
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.getAttribute('data-accent') === id) {
      btn.classList.add('border-text', 'scale-110');
      btn.classList.remove('border-transparent');
    } else {
      btn.classList.remove('border-text', 'scale-110');
      btn.classList.add('border-transparent');
    }
  });
  
  localStorage.setItem('rtm-accent', id);
  // Dispatch event for other components to redraw if needed (like sparklines)
  window.dispatchEvent(new CustomEvent('rtm-theme-changed'));
}

function setupListeners() {
  const trigger = document.getElementById('theme-trigger');
  const panel = document.getElementById('theme-panel');
  const toggle = document.getElementById('mode-toggle');
  if (trigger && panel) {
    trigger.addEventListener('click', () => {
      panel.classList.toggle('hidden');
    });
  }
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      isLight = !isLight;
      applyMode();
    });
  }
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-accent');
      if (id) applyAccent(id);
    });
  });
}

// Run on load
initTheme();
