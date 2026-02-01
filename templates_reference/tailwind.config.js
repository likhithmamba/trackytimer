/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./stitch_screen_1.1_black_screen_boot/global_visibility_guard/code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#e6474c",
        "background-light": "#f8f6f6",
        "background-dark": "#211112",
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
