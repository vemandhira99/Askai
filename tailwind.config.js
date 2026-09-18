/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          500: '#3b50c4',
          600: '#2b3f9e',
          700: '#233280',
          800: '#1b2563',
          900: '#141c4a',
        },
        surface: {
          dark: '#0f172a',
          cardDark: '#1e293b',
          borderDark: '#334155',
          light: '#f8fafc',
          cardLight: '#ffffff',
          borderLight: '#e2e8f0',
        }
      }
    },
  },
  plugins: [],
}
