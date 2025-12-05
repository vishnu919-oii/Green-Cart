import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  server: {
    proxy: {
      "/api": {
        // local development only
        target: "http://localhost:4000",
        changeOrigin: true
      }
    }
  }
});
