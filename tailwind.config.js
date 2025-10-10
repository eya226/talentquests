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
        'code-green': '#10B981',
        'dark-matter': '#1F2937',
        'gray-light': '#D1D5DB', // gray-300
        'gray-medium': '#4B5563', // gray-600
        'gray-dark': '#374151',   // gray-700
        'gray-darkest': '#111827',// gray-900
      }
    },
  },
  plugins: [],
}