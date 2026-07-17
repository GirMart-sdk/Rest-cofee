/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#197c46', light: '#28a745', dark: '#0a4d2e' },
        accent: { DEFAULT: '#97080c', light: '#dc3545', dark: '#6b0609' },
        gold: '#d4a843',
      },
      fontFamily: {
        display: ['"Arima Madurai"', 'cursive'],
        body: ['"Mulish"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
