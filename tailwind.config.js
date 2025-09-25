/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Use 'class' strategy for dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // App Router (Next.js 13+)
    './pages/**/*.{js,ts,jsx,tsx}', // Pages Router (Next.js)
    './components/**/*.{js,ts,jsx,tsx}', // Components directory
    './src/**/*.{js,ts,jsx,tsx}', // If using a src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};