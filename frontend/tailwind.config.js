/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          'blue': '#00D4FF',
          'purple': '#9D4EDD',
          'pink': '#FF006E',
          'green': '#00FF88',
          'orange': '#FF8500',
          'dark': '#0A0A0A',
          'darker': '#000000',
          'gray': '#1A1A1A',
          'light-gray': '#2A2A2A'
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif']
      },
      animation: {
        'gradient': 'gradient 6s ease infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.6)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}