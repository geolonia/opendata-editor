import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist/web'),
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    ViteEjsPlugin({
      // Configuration for Geolonian instance. These values will be overwritten on the build from bin/cli.js.
      favicon: resolve(__dirname, 'src/web/assets/favicon.ico'),
      orgName: 'Geolonia',
      noIndex: false,
    }),
  ],
  base: process.env.NODE_ENV === 'gh-pages' ? '/opendata-editor/' : '/',
});
