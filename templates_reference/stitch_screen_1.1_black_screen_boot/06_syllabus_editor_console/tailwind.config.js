/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#5B7CFA",
        "background-light": "#f5f5f8",
        "background-dark": "#0B1020",
        "sidebar-dark": "#11172A",
        "border-dark": "#20284A",
        "text-muted": "#94A3B8"
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
