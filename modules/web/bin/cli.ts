#!/usr/bin/env node

import { cwd } from 'node:process';
import minimist from 'minimist';
import { dev, build } from './lib.js';

const { _: [ subCommand ] } = minimist(process.argv.slice(2));
const projectRoot = cwd();

if (subCommand === 'dev') {
  await dev(projectRoot);
} else if (subCommand === 'build') {
  await build(projectRoot);
} else {
  console.log(`opendata-editor: unknown subcommand '${subCommand}'`);
}
