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
          DEFAULT: '#00B4FF',
          dark: '#0088CC',
          light: '#66D0FF'
        },
        secondary: {
          DEFAULT: '#00E5FF',
          dark: '#00B3CC'
        },
        dark: {
          DEFAULT: '#0A0E17',
          card: '#111827',
          border: '#1E293B',
          hover: '#1A2332'
        },
        success: '#00E676',
        warning: '#FFC107',
        danger: '#FF1744'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}