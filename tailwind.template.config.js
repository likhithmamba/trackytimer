/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates_reference/stitch_screen_1.1_black_screen_boot/05_exam_tracks/code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#19e6ca",
        "background-light": "#f6f8f8",
        "background-dark": "#11211f",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
