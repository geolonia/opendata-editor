#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import minimist from 'minimist';
import yesno from 'yesno';
import { create } from '../lib/create.js';

const { _: [ projectName ] } = minimist(process.argv.slice(2));
const currentDirPath = cwd();
const projectRoot = join(currentDirPath, projectName);

if (!projectName) {
  console.error('[ERROR] opendata-editor: set directory name to create');
  process.exit(1);
}

const deleteProjectRoot = existsSync(projectRoot) && await yesno({
  question: `Target directory ${projectName} already exists. Do you want to overwrite it? (y/N)`,
  defaultValue: false,
});

await create({
  projectRoot,
  projectName,
  overwrite: deleteProjectRoot,
});
