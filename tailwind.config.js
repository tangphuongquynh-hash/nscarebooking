/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#dff4f3",
        secondary: "#f5f9f9",
      },
    },
  },
  plugins: [],
}