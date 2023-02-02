/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            boxShadow: {
                top: "0px 0px 30px 3px rgba(0,0,0,0.35)",
                area: "0px 0px 20px 3px rgba(0,0,0,0.35)",
            },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
