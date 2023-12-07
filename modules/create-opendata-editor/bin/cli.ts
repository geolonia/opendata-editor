#!/usr/bin/env node

import { cp, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import minimist from 'minimist';
import templatePackageJson from '../template/package.json';

const { _: [ projectName ] } = minimist(process.argv.slice(2));
const currentDirPath = cwd();
const templateDirPath = join(__dirname, '../template');

if (!projectName) {
  console.log('opendata-editor: set directory name to create');
  process.exit(1);
}

const projectRoot = join(currentDirPath, projectName);

await cp(templateDirPath, projectRoot, { recursive: true });
await writeFile(join(projectRoot, 'package.json'), JSON.stringify({
  ...templatePackageJson,
  name: projectName,
}, null, 2));
