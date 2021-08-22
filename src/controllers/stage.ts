import { writeFileSync } from 'fs';
import Joi from 'joi';
import { join } from 'path';
import { cwd, loadConfig, s3, saveConfig } from '..';

export const StageSchema = () =>
  Joi.object({
    name: Joi.string().alphanum().required(),
    local: Joi.string()
      .default(({ name }) => `.env.${name}`)
      .optional(),
    bucket: Joi.string().required(),
    target: Joi.string().default('.env').optional(),
  });

export interface StageInterface {
  name: string;
  local: string;
  target: string;
  bucket: string;
}

export class Stage {
  public static async getStage(
    stage: string
  ): Promise<StageInterface | undefined> {
    const { stages } = await loadConfig();
    return stages.find(({ name }) => stage === name);
  }

  public static async downloadFromStage(stage: StageInterface): Promise<void> {
    const { target, local, bucket } = stage;
    const workspace = cwd.split('/').reverse()[0];
    const path = join(cwd, local);
    const key = join(workspace, target);
    const res = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    if (!(res.Body instanceof Buffer)) throw Error();
    writeFileSync(path, res.Body.toString());
  }

  public static async addStage(stage: StageInterface): Promise<void> {
    const config = await loadConfig();
    stage = await StageSchema().validateAsync(stage);
    config.stages.push(stage);
    await saveConfig(config);
  }

  public static async removeStage(stage: StageInterface): Promise<void> {
    const config = await loadConfig();
    config.stages = config.stages.filter(({ name }) => name !== stage.name);
    await saveConfig(config);
  }
}
