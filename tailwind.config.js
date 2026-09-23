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
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c4d3fe',
          300: '#9ab4fd',
          400: '#6d8cfb',
          500: '#4d6df8',
          600: '#3751ed',
          700: '#2c3dd9',
          800: '#2634b0',
          900: '#152050',
          950: '#0d1530',
        },
        sky: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'blue-sm': '0 2px 8px -2px rgba(37, 99, 235, 0.15)',
        'blue-md': '0 4px 20px -4px rgba(37, 99, 235, 0.2)',
        'blue-lg': '0 8px 30px -6px rgba(37, 99, 235, 0.25)',
        'card':    '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px -2px rgba(0,0,0,0.1), 0 2px 6px -2px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
