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
                "mdb-text-primary": "#e9edeb",
                "mdb-text-secondary": "#c2c7c6",
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
