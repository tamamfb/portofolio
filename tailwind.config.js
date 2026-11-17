/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: '#FFFBF0',
        ink: '#141414',
        soft: '#4A4A4A',
        muted: '#7A7468',
        accent: '#E8402A',
        sun: '#FFD94A',
        sky: '#CDEFFF',
        rose: '#FFD6DE',
        map: '#FFF4D6',
        tape: '#FFE98A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', '"Arial Black"', 'Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        hard: '6px 6px 0 #141414',
        'hard-sm': '3px 3px 0 #141414',
        'hard-lg': '9px 9px 0 #141414',
        lift: '0 4px 0 #141414',
        'lift-accent': '0 4px 0 #E8402A',
        'lift-sm': '0 3px 0 #141414',
      },
      maxWidth: {
        page: '1440px',
      },
    },
  },
  plugins: [],
}
