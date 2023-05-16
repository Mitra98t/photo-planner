/** @type {import('tailwindcss').Config} */
module.exports = {
  // important: true,
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        top: "0px 0px 30px 3px rgba(0,0,0,0.35)",
        area: "0px 0px 20px 3px rgba(0,0,0,0.35)",
      },
      colors: {
        "dark-400": "#94a1a8",
        "dark-500": "#677075",
        "dark-600": "#51585c",
        "dark-700": "#303436",
        "dark-800": "#1b1d1e",
        "dark-900": "#090909",
        "dark-text": "#fdfafe",
        "dark-bg": "#1a0425",
        "dark-lighter-bg": "#1a0425",
        "dark-primary": "#edbe5a",
        "dark-secondary": "#4f076e",
        "dark-accent": "#e67341",
        "light-text": "#090807",
        "light-bg": "#f6f6f3",
        "light-primary": "#aa28e6",
        "light-secondary": "#42055c",
        "light-accent": "#f0975c",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
  safelist: [
    {
      // pattern:
      //   /(?:((?:bg|border|text|outline)-\w+-[1-9]00)|(outline-\[\d+px\]))/,
      pattern: /(bg|border|text|outline|ring)-\w+-[1-9]00/,
      variants: ["dark", "dark:hover", "hover", "focus", "dark:focus"],
    },
  ],
};
