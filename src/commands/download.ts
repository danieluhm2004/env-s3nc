import { writeFileSync } from 'fs';
import { ConfigStageInterface, cwd, EnvS3ncError, loadConfig, s3 } from '..';

export async function onDownloadCommand(options: {
  stage: string;
}): Promise<void> {
  const { stages } = await loadConfig();
  const targetStages = stages;

  if (options.stage) {
    const stage = getStage(options.stage, stages);
    if (!stage) {
      throw new EnvS3ncError(
        `A stage named ${options.stage} could not be found.`
      );
    }

    targetStages.splice(0, targetStages.length);
    targetStages.push(stage);
  }

  const workspace = cwd.split('/').reverse()[0];
  const stageNames = targetStages.map(({ name }) => name).join(', ');
  console.log(`Download the environment files of ${stageNames} stages.`);

  for (const { name, target, local, bucket } of targetStages) {
    try {
      const key = `${workspace}/${target}`;
      const path = `${cwd}/${local}`;
      const res = await s3
        .getObject({
          Bucket: bucket,
          Key: key,
        })
        .promise();

      if (!(res.Body instanceof Buffer)) throw Error();
      writeFileSync(path, res.Body.toString());
    } catch (err) {
      console.warn(
        `Unable to get file from ${bucket} on stage ${name}. The file does not exist or you do not have enough permissions.`
      );
    }
  }
}

function getStage(
  stage: string,
  stages: ConfigStageInterface[]
): ConfigStageInterface | undefined {
  return stages.find(({ name }) => stage === name);
}
