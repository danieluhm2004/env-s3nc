import { EnvS3ncError, Stage } from '../..';

export async function onStageRemoveCommand(name: string): Promise<void> {
  const stage = await Stage.getStage(name);
  if (!stage) {
    throw new EnvS3ncError(`A stage named ${name} could not be found.`);
  }

  
  await Stage.removeStage(stage);
  console.log(`A stage named ${name} has been removed.`);
}
