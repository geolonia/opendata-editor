import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { defineBuildConfig } from 'unbuild';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineBuildConfig({
  entries: [
    join(__dirname, 'bin/cli.ts'),
    join(__dirname, 'lib/create.ts'),
  ],
  declaration: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'es2022', // required for top-level await
    },
  },
});
