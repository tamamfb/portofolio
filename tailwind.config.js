/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#A8D8B8',
        'secondary-green': '#C8E6D7',
        'tertiary-green': '#B4E0BA',
        'off-white': '#FAFAF8',
        'dark-text': '#2C3E50',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
      }
    },
  },
  plugins: [],
}
