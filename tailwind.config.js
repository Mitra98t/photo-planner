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
        "white-soft": "0px 0px 10px 3px rgba(100,100,100,0.2)",
      },
      colors: {
        "dark-400": "#94a1a8",
        "dark-500": "#677075",
        "dark-600": "#51585c",
        "dark-700": "#303436",
        "dark-800": "#1b1d1e",
        "dark-900": "#090909",
        //* Dark blue 1
        // "dark-text": "#f5eadb",
        // "dark-bg": "#070222",
        // "dark-lighter-bg": "#0a0330",
        // "dark-primary": "#153f74",
        // "dark-secondary": "#153f74",
        // "dark-accent": "#f5e1c7",
        //* Dark purple 2
        // "dark-text": "#e6e5e6",
        // "dark-bg": "#120222",
        // "dark-lighter-bg": "#1a0425",
        // "dark-primary": "#4e33d7",
        // "dark-secondary": "#8766ff",
        // "dark-accent": "#ffc524",
        //* Dark purple 1
        // "dark-text": "#fdfafe",
        // "dark-bg": "#1a0425",
        // "dark-lighter-bg": "#1a0425",
        // "dark-primary": "#edbe5a",
        // "dark-secondary": "#4f076e",
        // "dark-accent": "#e67341",
        //* Dark test Scanna
        "dark-text": "#eeeef2",
        "dark-bg": "#000000",
        "dark-lighter-bg": "#1a1a1a",
        "dark-primary": "#c0fbd1",
        "dark-secondary": "#066060",
        "dark-accent": "#0edaf1",

        //* Light purple 1
        // "light-text": "#090807",
        // "light-bg": "#f6f6f3",
        // "light-primary": "#aa28e6",
        // "light-secondary": "#42055c",
        // "light-accent": "#f0975c",
        //* Light blue 1
        "light-text": "#081104",
        "light-bg": "#fbfbfb",
        "light-primary": "#293460",
        "light-secondary": "#081104",
        "light-accent": "#0c5f56",
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
