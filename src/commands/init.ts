import { copyFileSync, existsSync } from 'fs';
import { configFile, cwd } from '..';

export async function onInitCommand(): Promise<void> {
  const targetPath = `${cwd}/${configFile}`;
  if (existsSync(targetPath)) {
    console.error(`${targetPath} is already exists.`);
    return;
  }

  copyFileSync('../env-s3nc.json', targetPath);
  console.log(`${targetPath} has been created.`);
}
