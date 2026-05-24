/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-pink': '#f8b6c8',
        'deep-maroon': '#4a1020',
        'dark-bg': '#14050b',
        'soft-white': '#fff7fb',
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'scale-in': 'scaleIn 0.8s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%, 100%': { textShadow: '0 0 20px rgba(248, 182, 200, 0.5)' },
          '50%': { textShadow: '0 0 40px rgba(248, 182, 200, 0.8), 0 0 60px rgba(248, 182, 200, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
