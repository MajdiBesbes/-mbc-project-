/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0055A4',
          dark: '#004483',
          light: '#0066CC'
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          dark: '#45B8B0',
          light: '#5FD7CF'
        },
        navy: {
          DEFAULT: '#002147',
          dark: '#001A39',
          light: '#002E5F'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};