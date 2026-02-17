/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        primary: '#8b5cf6', // Violeta eléctrico
        secondary: '#10b981', // Verde neón
        text: '#ededed',
        muted: '#a1a1aa'
      },
    },
  },
  plugins: [],
}