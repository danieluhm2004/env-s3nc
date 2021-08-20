import { loadConfig } from '../tools';

export async function onUploadCommand(): Promise<void> {
  console.log(await loadConfig());
}
