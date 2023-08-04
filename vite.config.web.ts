import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: './dist/web',
  },
  server: {
    port: 3000,
  },
  plugins: [react()],
  publicDir: './web/public',
});
