import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Use absolute base for Vercel production. Vite will resolve assets correctly.
  base: "/",
  server: {
    proxy: {
      // dev only: proxies local /api to your local backend while developing
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
