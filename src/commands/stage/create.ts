import { EnvS3ncError, Stage } from '../..';

export async function onStageCreateCommand(
  name: string,
  options: {
    local: string;
    bucket: string;
    target: string;
  }
): Promise<void> {
  const exists = await Stage.getStage(name);
  const { local, bucket, target } = options;
  if (exists) {
    throw new EnvS3ncError('A stage with the same name already exists.');
  }

  await Stage.addStage({ name, local, target, bucket });
  console.log(`A stage named ${name} has been created.`);
}
