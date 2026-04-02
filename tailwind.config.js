/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0891b2',
          900: '#0c4a6e',
        },
      }
    },
  },
  plugins: [],
}
