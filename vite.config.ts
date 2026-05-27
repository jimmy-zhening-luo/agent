import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const DEFAULT_API_TARGET = "http://127.0.0.1:8000",
apiTarget = process.env.VITE_API_URL ?? DEFAULT_API_TARGET;

export default defineConfig({
  envDir: path.resolve(__dirname),
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
