#!/usr/bin/env node

import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { build, createServer } from 'vite';
import minimist from 'minimist';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import type { OpenDataEditorConfig } from '../src/configurator/types';

const userAssetsDir = join(__dirname, '../src/web/user-assets');

const { _: [ subCommand ] } = minimist(process.argv.slice(2));
const projectRoot = cwd();
const { favicon: faviconPath, noIndex }: OpenDataEditorConfig = await import(`${cwd()}/opendata-editor.config.ts`);

await rm(userAssetsDir, { recursive: true, force: true });

if (faviconPath) {
  await mkdir(userAssetsDir, { recursive: true });
  cp(faviconPath, join(userAssetsDir, 'favicon.ico'));
}

const commonViteConfig = {
  configFile: join(__dirname, '../vite.config.web.ts'),
  root: projectRoot,
  plugins: [
    ViteEjsPlugin({
      favicon: faviconPath,
      noIndex,
    }),
  ],
};

if (subCommand === 'dev') {
  const server = await createServer(commonViteConfig);
  await server.listen();

  server.printUrls();
} else if (subCommand === 'build') {
  await build({
    ...commonViteConfig,
    build: {
      outDir: join(projectRoot, 'dist'),
    },
  });
} else {
  console.log(`opendata-editor: unknown subcommand '${subCommand}'`);
}
