import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    /**
     * Proxy API calls in dev so the browser talks to the Vite origin only (e.g. localhost:3001).
     * Avoids CORS edge cases and some environments where direct requests to 127.0.0.1:9000 fail.
     * Spring Boot must still be running on port 9000 (or change `target` below).
     */
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  /** Same proxy when using `vite preview` (production build served locally). */
  preview: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:9000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: 'build',
  },
});
