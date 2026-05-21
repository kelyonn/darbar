import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./", // Ensure correct relative paths for deployment
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  build: {
    outDir: "dist", // Explicitly define output directory
    emptyOutDir: true,
  },
});
