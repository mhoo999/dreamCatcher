/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a259ff', // 퍼플
          light: '#c084fc',
          dark: '#6d28d9',
        },
        secondary: {
          DEFAULT: '#ff6dcf', // 핑크
          light: '#fda4af',
          dark: '#be185d',
        },
        gradientFrom: '#a259ff',
        gradientTo: '#ff6dcf',
        card: '#fff',
        background: '#f8f7fa',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(162, 89, 255, 0.10)',
        tab: '0 -2px 16px 0 rgba(162, 89, 255, 0.08)',
      },
      borderRadius: {
        card: '1.5rem',
        tab: '2rem',
      },
      maxWidth: {
        'app': '430px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

