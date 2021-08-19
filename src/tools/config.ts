import { existsSync } from 'fs';
import { readFileSync } from 'fs';
import Joi from 'joi';
import { EnvS3ncError } from '..';

export const cwd = process.cwd();
export const configFile = '.env-s3nc.json';
let config: ConfigInterface | null;

export interface ConfigInterface {
  stages: ConfigStageInterface[];
}

export interface ConfigStageInterface {
  name: string;
  local: string;
  target: string;
  bucket: string;
}

export const ConfigSchema = Joi.object({
  stages: Joi.array()
    .items(
      Joi.object().keys({
        name: Joi.string().alphanum().required(),
        local: Joi.string().required(),
        bucket: Joi.string().required(),
        target: Joi.string().required(),
      })
    )
    .required(),
});

export async function loadConfig(): Promise<ConfigInterface> {
  if (config) return config;
  const configPath = findConfigPath();
  const configJson = JSON.parse(readFileSync(configPath).toString());
  config = await validateConfig(configJson);
  return config;
}

export async function validateConfig(
  config: ConfigInterface
): Promise<ConfigInterface> {
  const options = { allowUnknown: true };
  const error = ({ message }: Error) => {
    throw new EnvS3ncError(message);
  };

  return ConfigSchema.validateAsync(config, options).catch(error);
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
