import { existsSync } from 'node:fs';
import { cp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import templatePackageJson from '../template/package.json';

type GenerateOptions = {
  projectRoot: string,
  projectName: string,
  overwrite: boolean,
};

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export const create = async ({ projectRoot, projectName, overwrite }: GenerateOptions) => {
  const templateDirPath = join(__dirname, '../template');

  if (overwrite) {
    await rm(projectRoot, { recursive: true, force: true });
  } else {
    if (existsSync(projectRoot)) {
      throw new Error('opendata-editor: aborted to create new project');
    }
  }

  await cp(templateDirPath, projectRoot, { recursive: true, dereference: true });
  await writeFile(join(projectRoot, 'package.json'), `${JSON.stringify({
    ...templatePackageJson,
    name: projectName,
  }, null, 2)}\n`);
};
