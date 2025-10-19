/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quantum-purple': '#6D28D9',
        'neon-blue': '#0EA5E9',
      },
    },
  },
  plugins: [],
}