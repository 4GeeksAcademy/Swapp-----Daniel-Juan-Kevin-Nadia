import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",                 // busca index.html en la raíz del proyecto
  build: {
    outDir: "dist",          // deja el build en /dist (como Flask espera)
  },
  server: {
    port: 3000,
  },
});
