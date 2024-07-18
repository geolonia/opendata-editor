import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { dependencies } from './package.json';

const deps = Object.keys(dependencies);

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src/OpenDataEditor.tsx'),
      name: 'OpenDataEditor',
      fileName: 'opendata-editor',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: deps,
    },
  },
  plugins: [
    react(),
    dts({
      outDir: resolve(__dirname, 'dist/types'),
      entryRoot: resolve(__dirname, 'src'),
    }),
  ],
});
