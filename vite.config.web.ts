import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist/web'),
  },
  server: {
    port: 3000,
  },
  plugins: [react()],
  publicDir: resolve(__dirname, 'web/public'),
  base: __dirname,
});
