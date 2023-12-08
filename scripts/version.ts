import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { version as newVersion } from '../lerna.json';
import packageJsonRoot from '../package.json';
import packageJsonTemplate from '../modules/create/template/package.json';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

packageJsonRoot.version = newVersion;
packageJsonTemplate.dependencies['@geolonia/opendata-editor-web'] = `^${newVersion}`;

await Promise.all([
  writeFile(join(__dirname, '../package.json'), `${JSON.stringify(packageJsonRoot, null, 2)}\n`),
  writeFile(join(__dirname, '../modules/create/template/package.json'), `${JSON.stringify(packageJsonTemplate, null, 2)}\n`),
]);
