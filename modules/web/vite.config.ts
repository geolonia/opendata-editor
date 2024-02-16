/* Build config for Web (src/*) */
import { join } from 'path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { dependencies } from './package.json';

const deps = Object.keys(dependencies);

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    outDir: join(__dirname, 'dist/lib'),
    lib: {
      entry: join(__dirname, 'src/index.tsx'),
      name: 'odeweb',
      fileName: 'odeweb',
      formats: [ 'es', 'cjs' ],
    },
    rollupOptions: {
      external: deps,
    },
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    dts({
      outDir: join(__dirname, 'dist/lib/types'),
      entryRoot: join(__dirname, 'src'),
      rollupTypes: true, // Generate single d.ts file
    }),
  ],
  base: process.env.NODE_ENV === 'gh-pages' ? '/opendata-editor/' : '/',
});
