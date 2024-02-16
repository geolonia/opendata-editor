import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { version as newVersion } from '../lerna.json';
import packageJsonRoot from '../package.json';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

packageJsonRoot.version = newVersion;

await writeFile(join(__dirname, '../package.json'), `${JSON.stringify(packageJsonRoot, null, 2)}\n`);
