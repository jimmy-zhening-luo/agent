import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const apiTarget = process.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export default defineConfig({
  // Allow env files to live one level above the frontend directory
  envDir: path.resolve(__dirname, ".."),
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/chatkit": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
