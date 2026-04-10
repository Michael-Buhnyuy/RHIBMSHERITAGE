/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Fixed: was `./src\\**\\*.js` causing perf warning
  ],
  theme: {
    extend: {
      colors: {
        'rhibms-red': {
          50: '#fef2f2',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          900: '#7f1d1d',
        },
        'rhibms-sky': {
          50: '#f0f9ff',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [],
};