/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
  extend: {
    colors: {
      brand: {
        primary: "#0B4A3B",
        accent: "#F97316",
        cream: "#FBE9E3",
        soft: "#6FAF9A",
        white: "#FFFFFF",
        text: "#1F2933",
      },
    },
  },
},
  plugins: []
}