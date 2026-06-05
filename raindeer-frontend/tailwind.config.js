/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#07111F',
          surface: '#0B1320',
          blue: '#1E6BFF',
          'blue-mid': '#35A7FF',
          'blue-glow': '#74D0FF',
          white: '#F5F7FA',
          muted: '#A7B0BE',
          border: 'rgba(255,255,255,0.08)',
          'border-blue': 'rgba(30,107,255,0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #07111F, #0B1320)',
        'blue-glow-gradient': 'linear-gradient(135deg, #1E6BFF, #35A7FF)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(30,107,255,0.33)',
        'glow-lg': '0 0 40px rgba(30,107,255,0.4)',
        'glow-sm': '0 0 10px rgba(30,107,255,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(30,107,255,0)' },
          '50%': { boxShadow: '0 0 20px rgba(30,107,255,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
