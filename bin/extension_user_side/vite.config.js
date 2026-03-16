import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";

import tailwindcssPostcss from "@tailwindcss/postcss"; 
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [react(), crx({ manifest })],

  css: {
    postcss: {
      plugins: [
        tailwindcssPostcss(), 
        autoprefixer(),
      ],
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        options: resolve(__dirname, "options.html"),
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
