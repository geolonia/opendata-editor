import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist/lib'),
    lib: {
      entry: resolve(__dirname, 'lib/OpenDataEditor.tsx'),
      name: 'OpenDataEditor',
      fileName: 'opendata-editor',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [/node_modules/],
    },
  },
  plugins: [
    react(),
    dts({
      outDir: resolve(__dirname, 'dist/lib/types'),
      entryRoot: resolve(__dirname, 'lib'),
    }),
  ],
});
