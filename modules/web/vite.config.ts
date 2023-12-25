import { resolve } from 'path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  server: {
    port: 3000,
  },
  plugins: [react()],
  base: process.env.NODE_ENV === 'preview' ? '/' : '/opendata-editor/',
});
