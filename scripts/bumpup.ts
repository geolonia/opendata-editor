import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import minimist from 'minimist';
import packageJsonRoot from '../package.json';
import packageJsonCreate from '../modules/create-opendata-editor/package.json';
import packageJsonTemplate from '../modules/create-opendata-editor/template/package.json';
import packageJsonComponent from '../modules/opendata-editor/package.json';
import packageJsonWeb from '../modules/web/package.json';
import lernaJson from '../lerna.json';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const { _: [ newVersion ] } = minimist(process.argv.slice(2));

if (!newVersion) {
  console.error('[Error] Set new version as an argument.');
  process.exit(1);
}

// TODO 正規表現で数字とドット以外が含まれていないかチェックする

packageJsonRoot.version = newVersion;

packageJsonCreate.version = newVersion;
packageJsonCreate.dependencies['@geolonia/opendata-editor-web'] = newVersion;

packageJsonTemplate.dependencies['@geolonia/opendata-editor-web'] = `^${newVersion}`;

packageJsonComponent.version = newVersion;

packageJsonWeb.version = newVersion;
packageJsonWeb.dependencies['@geolonia/opendata-editor'] = newVersion;

lernaJson.version = newVersion;

await writeFile(join(__dirname, '../package.json'), `${JSON.stringify(packageJsonRoot, null, 2)}\n`);
await writeFile(join(__dirname, '../modules/create-opendata-editor/package.json'), `${JSON.stringify(packageJsonCreate, null, 2)}\n`);
await writeFile(join(__dirname, '../modules/create-opendata-editor/template/package.json'), `${JSON.stringify(packageJsonTemplate, null, 2)}\n`);
await writeFile(join(__dirname, '../modules/opendata-editor/package.json'), `${JSON.stringify(packageJsonComponent, null, 2)}\n`);
await writeFile(join(__dirname, '../modules/web/package.json'), `${JSON.stringify(packageJsonWeb, null, 2)}\n`);
await writeFile(join(__dirname, '../lerna.json'), `${JSON.stringify(lernaJson, null, 2)}\n`);
