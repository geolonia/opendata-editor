import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { dependencies, devDependencies } from './package.json';

const deps = Object.keys(dependencies).concat(Object.keys(devDependencies));

export default defineConfig({
  build: {
    outDir: resolve(__dirname, 'dist/configurator'),
    lib: {
      entry: resolve(__dirname, 'src/configurator/index.ts'),
      name: 'configurator',
      fileName: 'configurator',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: deps,
    },
  },
  plugins: [
    react(),
    dts({
      outDir: resolve(__dirname, 'dist/configurator/types'),
      entryRoot: resolve(__dirname, 'src/configurator'),
    }),
  ],
});
