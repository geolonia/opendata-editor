import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '@geolonia/opendata-editor-web/cli';
import { create } from '@geolonia/create-opendata-editor';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const srcDir = join(__dirname, '../src');
const distDir = join(__dirname, '../dist');

await create({
  projectRoot: srcDir,
  projectName: 'geolonia.github.io',
  overwrite: true,
});

await build(srcDir, { outDir: distDir });
