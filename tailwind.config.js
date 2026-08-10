/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          850: 'rgb(var(--ink-850) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-soft': 'rgb(var(--line-soft) / <alpha-value>)',
        hi: 'rgb(var(--text-hi) / <alpha-value>)',
        mid: 'rgb(var(--text-mid) / <alpha-value>)',
        low: 'rgb(var(--text-low) / <alpha-value>)',
        accent: 'rgb(var(--amber) / <alpha-value>)',
        ok: 'rgb(var(--emerald) / <alpha-value>)',
        bad: 'rgb(var(--red) / <alpha-value>)',
        blue: 'rgb(var(--blue) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}