import { EnvS3ncError, loadConfig, Stage } from '..';

export async function onDownloadCommand(options: {
  stage: string;
}): Promise<void> {
  const { stages } = await loadConfig();
  const targetStages = stages;

  if (options.stage) {
    const stage = await Stage.getStage(options.stage);
    if (!stage) {
      throw new EnvS3ncError(
        `A stage named ${options.stage} could not be found.`
      );
    }

    targetStages.splice(0, targetStages.length);
    targetStages.push(stage);
  }

  const stageNames = targetStages.map(({ name }) => name).join(', ');
  console.log(`Download the environment files of ${stageNames} stages.`);
  for (const stage of targetStages) {
    try {
      await Stage.downloadFromStage(stage);
      console.log(`Successfully downloaded the ${stage.name} stage.`);
    } catch (err) {
      console.warn(
        `Unable to get file from ${stage.bucket} on stage ${stage.name}. The file does not exist or you do not have enough permissions.`
      );
    }
  }
}
