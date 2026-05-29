import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [react()],
});
