/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "red-primary": "#ED232D",
        "red-dark": "#C41E26",
        "red-light": "#F04B54",
        "red-primary-rgb": "237, 35, 45",
      },
      fontFamily: {
        sans: ["PP Neue Montreal", "system-ui", "sans-serif"],
        "pp-neue": ["PP Neue Montreal", "system-ui", "sans-serif"],
      },
      keyframes: {
        "border-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "border-spin": "border-spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
