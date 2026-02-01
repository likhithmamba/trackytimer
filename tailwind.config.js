/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates_reference/stitch_screen_1.1_black_screen_boot/11_failure_&_system_audit/code.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#f20d0d",
        "background-light": "#f8f5f5",
        "background-dark": "#0a0a0a",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"],
        "mono": ["JetBrains Mono", "monospace"]
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
