/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates_reference/stitch_screen_1.1_black_screen_boot/10_session__noir_variant/code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0d46f2",
        "background-light": "#f5f6f8",
        "background-dark": "#101422",
      },
      fontFamily: {
        "display": ["Inter"]
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
