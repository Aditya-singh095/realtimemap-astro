/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        accent: 'var(--accent)',
        'accent-dim': 'var(--accent-dim)',
        'accent-bg': 'var(--accent-bg)',
        'accent-on': 'var(--accent-on)',
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        bg3: 'var(--bg3)',
        bg4: 'var(--bg4)',
        bg5: 'var(--bg5)',
        border: 'var(--border)',
        border2: 'var(--border2)',
        text: 'var(--text)',
        text2: 'var(--text2)',
        text3: 'var(--text3)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'flicker': 'flicker 4s steps(1) infinite',
        'blink': 'blink 1s step-end infinite',
        'slide-in': 'slideIn 0.3s ease forwards',
        'fade-up': 'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        pulseRing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
          '50%': { transform: 'scale(1.4)', opacity: '0' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
