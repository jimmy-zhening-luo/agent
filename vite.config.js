import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";


const DEFAULT_API_TARGET = "https://agent-server.azurewebsites.net",
apiTarget = process.env.VITE_API_URL ?? DEFAULT_API_TARGET;

/** @type {import('vite').UserConfig} */
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
