/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        Kanit: ["Kanit", "sans-serif"],
        Titillium: ["Titillium Web", "sans-serif"],
        RobotoMono: ["Roboto Mono", "monospace"],
        ClimateCrisis: ["Climate Crisis", "sans-serif"],
        Alice: ["Alice", "serif"],
        Philosopher: ["Philosopher", "sans-serif"],
        SpaceGrotesk: ["SpaceGrotesk", "sans-serif"],
      },
    },
    screens: {
      'lg' : '1030px',
      'md': '730px'
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
  ],
}