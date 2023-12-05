#!/usr/bin/env node

import { resolve } from 'node:path';
import { cwd } from 'node:process';
import { build, createServer } from 'vite';
import minimist from 'minimist';

const { _: [ subCommand ] } = minimist(process.argv.slice(2));
const root = cwd();

if (subCommand === 'dev') {
  const server = await createServer({
    configFile: resolve(__dirname, '../vite.config.web.ts'),
    root,
    base: '/',
  });
  await server.listen();

  server.printUrls();
} else if (subCommand === 'build') {
  await build({
    configFile: resolve(__dirname, '../vite.config.web.ts'),
    root,
    build: {
      outDir: resolve(root, 'dist'),
    },
    base: '/',
  });
} else {
  console.log(`opendata-editor: unknown subcommand '${subCommand}'`);
}
