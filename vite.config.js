import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "front",
  build: {
    outDir: "../dist",   // <-- clave: deja el build en la raíz del repo
  },
  server: {
    port: 3000,
  },
});
