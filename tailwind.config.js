/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { 
        "poppins": ["Poppins", 'sans-serif'] 
    },
      boxShadow: {
        'center': 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;',
        'card': 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;',
        'button': 'rgba(0, 197, 161, 0.4) 0px 0px 11.54px 0px;'
      }
    },
  },
  plugins: [],
}