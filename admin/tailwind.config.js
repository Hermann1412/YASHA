/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#EF9F27',
        yasha: { black: '#0d0d0d', dark: '#111111', card: '#1a1a1a', border: '#2a2a2a' },
      },
    },
  },
  plugins: [],
}
