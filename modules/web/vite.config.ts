import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  server: {
    port: 3000,
  },
  plugins: [react()],
  base: process.env.NODE_ENV === 'gh-pages' ? '/opendata-editor/' : '/',
});
