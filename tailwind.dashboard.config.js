/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates_reference/stitch_screen_1.1_black_screen_boot/08_execution_dashboard/code.html"],
  darkMode: "class",
  theme: {
      extend: {
          colors: {
              "primary": "#7b5cfa",
              "electric-blue": "#5B7CFA",
              "background-light": "#f6f5f8",
              "background-dark": "#0B1020",
              "surface-dark": "#11172A",
              "border-dark": "#1E293B"
          },
          fontFamily: {
              "display": ["Inter", "sans-serif"]
          },
          borderRadius: {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
          },
      },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
