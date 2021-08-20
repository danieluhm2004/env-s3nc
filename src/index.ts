import { program } from 'commander';
import {
  EnvS3ncError,
  onDownloadCommand,
  onInitCommand,
  onUploadCommand,
} from '.';
import { name, version } from '../package.json';

export * from './commands';
export * from './tools';

async function main() {
  try {
    program.name(name);
    program.version(version);

    const initCommand = program
      .command('init')
      .description('Initialize the config')
      .action(onInitCommand);

    const uploadCommand = program
      .command('upload')
      .description('Upload to S3')
      .action(onUploadCommand);

    const downloadCommand = program
      .command('download')
      .description('Download from S3')
      .option('-s, --stage <stage>', 'Download only specific stages.')
      .action(onDownloadCommand);

    const stageCommand = program
      .command('stage')
      .description('Create, delete, and manage stages.');

    const stageAddCommand = stageCommand
      .command('create <stage>')
      .description('Create a new stage.')
      .requiredOption('-l, --local <local>', 'Enter the stage file name.')
      .requiredOption('-b, --b <bucket>', 'Enter a bucket name.');

    const stageRemoveCommand = stageCommand
      .command('remove <stage>')
      .description('Delete the existing stage.')
      .option('-a, --all', 'Delete all stages.')
      .requiredOption('-c, --confirm', 'Confirm deletion.');

    await program.parseAsync(process.argv);
  } catch (err) {
    if (err instanceof EnvS3ncError) {
      console.error(err.message);
      process.exit(1);
    }

    throw err;
  }
}

main();
