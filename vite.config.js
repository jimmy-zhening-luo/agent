import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  envDir: path.resolve(__dirname),
  plugins: [react()],
});
