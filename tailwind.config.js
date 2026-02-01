/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates_reference/stitch_screen_1.1_black_screen_boot/05_tracks__technical_grid/code.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#f2a60d",
        "background-light": "#f8f7f5",
        "background-dark": "#121212",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
