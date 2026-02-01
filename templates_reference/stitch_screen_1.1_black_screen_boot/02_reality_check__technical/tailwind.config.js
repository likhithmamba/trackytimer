/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#135bec",
        "background-light": "#f6f6f8",
        "background-dark": "#0B0B0B",
        "charcoal": "#111318",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
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
