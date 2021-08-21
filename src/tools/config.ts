import { existsSync, readFileSync, writeFileSync } from 'fs';
import Joi from 'joi';
import { EnvS3ncError, StageInterface, StageSchema } from '..';

export const cwd = process.cwd();
export const configFile = '.env-s3nc.json';
let config: ConfigInterface | null;

export interface ConfigInterface {
  stages: StageInterface[];
}

export const ConfigSchema = () =>
  Joi.object({
    stages: Joi.array().items(StageSchema()).required(),
  });

export async function loadConfig(): Promise<ConfigInterface> {
  if (config) return config;
  const configPath = findConfigPath();
  const configJson = JSON.parse(readFileSync(configPath).toString());
  config = await validateConfig(configJson);
  return config;
}

export async function saveConfig(config: ConfigInterface): Promise<void> {
  const configPath = findConfigPath();
  config = await validateConfig(config);
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export async function validateConfig(
  config: ConfigInterface
): Promise<ConfigInterface> {
  const options = { allowUnknown: true };
  const error = ({ message }: Error) => {
    throw new EnvS3ncError(message);
  };

  return ConfigSchema().validateAsync(config, options).catch(error);
}

export function findConfigPath(): string {
  let dots = cwd;
  for (let i = 0; i <= 5; i++) {
    const path = `${dots}/${configFile}`;
    if (existsSync(path)) return path;
    dots += '../';
  }

  throw new EnvS3ncError(`Cannot find ${configFile}`);
}
