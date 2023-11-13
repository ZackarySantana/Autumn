/* eslint-disable max-lines-per-function */
/** @type {import('tailwindcss').Config} */

import plugin from "tailwindcss/plugin";

module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                "mdb-green": "#6ce975",
                "mdb-background": "#081d2a",
                "mdb-secondary-background": "rgb(92, 108, 117)",
                "mdb-text-primary": "#e9edeb",
                "mdb-text-secondary": "#c2c7c6",
                "mdb-text-blue-background": "rgb(8, 60, 144)",
                "mdb-text-blue-foreground": "rgb(195, 231, 254)",
                "mdb-text-blue-border": "1px solid rgb(18, 84, 183)",
                "mdb-text-green-background": "rgb(2, 52, 48)",
                "mdb-text-green-foreground": "rgb(113, 246, 186)",
                "mdb-text-green-border": "1px solid rgb(0, 104, 74)",
                "mdb-text-red-background": "rgb(91, 0, 0)",
                "mdb-text-red-foreground": "rgb(255, 205, 199)",
                "mdb-text-red-border": "1px solid rgb(151, 6, 6)",
            },
        },
    },
    plugins: [
        plugin(function WordBreak({ addUtilities }) {
            addUtilities({
                ".word-break": {
                    "word-break": "break-word",
                },
            });
        }),
    ],
};
