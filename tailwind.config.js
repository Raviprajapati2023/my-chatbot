/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Scan Vue & JS files
    './quasar.config.*' // Include Quasar config
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
