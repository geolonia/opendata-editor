import { join } from 'node:path';
import { build as viteBuild, createServer } from 'vite';
import react from '@vitejs/plugin-react';

/** Run local development server */
export const dev = async (projectRoot: string) => {
  const server = await createServer({
    root: projectRoot,
    server: {
      port: 3000,
    },
  });
  await server.listen();

  server.printUrls();
};

type BuildOptions = {
  outDir?: string;
};

/** Build an opendata-editor instance */
export const build = async (projectRoot: string, options?: BuildOptions) => viteBuild({
  root: projectRoot,
  build: {
    outDir: options?.outDir ?? join(projectRoot, 'dist'),
    emptyOutDir: true,
  },
  plugins: [ react() ],
});

