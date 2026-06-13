/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFD54A',
          dark: '#E2BD3B',
          light: '#FFE483',
        },
        background: '#090909',
        card: '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-yellow': '0 0 20px rgba(255, 213, 74, 0.25)',
        'glow-purple': '0 0 25px rgba(139, 92, 246, 0.2)',
        'glow-blue': '0 0 25px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'lightning': 'lightning-flash 6s infinite',
      },
      keyframes: {
        'lightning-flash': {
          '0%, 90%, 93%, 95%, 100%': { opacity: '0.05' },
          '91%, 92%, 94%': { opacity: '0.4' },
        }
      }
    },
  },
  plugins: [],
}
