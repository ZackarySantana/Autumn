import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import prefetch from "@astrojs/prefetch";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [
        react(),
        tailwind(),
        prefetch({
            selector: "a",
        }),
    ],
    output: "server",
    adapter: node({
        mode: "standalone",
    }),
});
