/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'nuru-navy': '#0A233A',
      'nuru-orange': '#F28C00',
      'nuru-maroon': '#7B1823',
      'nuru-light': '#F4F5F7',
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'], // We'll use a clean, cinematic font
    },
  },
  plugins: [],
};