/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        monaco:['monaco'],
        outfit:['outfit'],
        montserrat:['montseraat'],
        oxygen:['oxygen'],
        lato:['lato'],
        myriad:['myriad'],
        

      }
    },
  },
  plugins: [],
}