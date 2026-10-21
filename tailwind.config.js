/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F4F6FB', 100: '#E6EAF4', 200: '#C9D2E6', 300: '#9FAECB',
          400: '#6B7EA6', 500: '#42557F', 600: '#2B3C63', 700: '#1B2A4A',
          800: '#111D36', 900: '#0A1730', 950: '#070F21',
        },
        brand: {
          indigo: '#2C3CA0', violet: '#6C4CF1', violetSoft: '#F0ECFE',
          teal: '#0FA98F', tealDeep: '#0A7C71', tealSoft: '#E3F6F2',
          amber: '#B7791F', amberSoft: '#FDF3E0', rose: '#B83A4E', roseSoft: '#FCEAEC',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'Noto Sans Devanagari', 'Noto Sans Gujarati', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl2: '1.25rem' },
      boxShadow: {
        soft: '0 1px 2px rgba(10,23,48,0.04), 0 8px 24px -12px rgba(10,23,48,0.16)',
        lift: '0 2px 4px rgba(10,23,48,0.05), 0 18px 40px -20px rgba(10,23,48,0.28)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'none' } },
        'pop': { '0%': { transform: 'scale(.94)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'grow': { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
      },
      animation: {
        'fade-up': 'fade-up .35s cubic-bezier(.2,.8,.2,1) both',
        pop: 'pop .25s cubic-bezier(.2,.8,.2,1) both',
        grow: 'grow .6s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
}
