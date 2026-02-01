/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates_reference/stitch_screen_1.1_black_screen_boot/04_identity__technical_finality/code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#121217",
        "accent-blue": "#00E5FF",
        "background-light": "#f7f7f7",
        "background-dark": "#0a0a0b",
        "border-technical": "#2f2f31",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0px",
        "lg": "0px",
        "xl": "0px",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
