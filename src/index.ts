#!/usr/bin/env node

import { program } from 'commander';
import {
  EnvS3ncError,
  onDownloadCommand,
  onInitCommand,
  onStageCreateCommand,
  onStageRemoveCommand,
  onUploadCommand,
} from '.';
import { name, version } from '../package.json';

export * from './commands';
export * from './controllers';
export * from './tools';

async function main() {
  try {
    program.name(name);
    program.version(version);

    program
      .command('init')
      .description('Initialize the config')
      .action(onInitCommand);

    program
      .command('upload')
      .description('Upload to S3')
      .option('-s, --stage <stage>', 'Download only specific stages.')
      .action(onUploadCommand);

    program
      .command('download')
      .description('Download from S3')
      .option('-s, --stage <stage>', 'Download only specific stages.')
      .action(onDownloadCommand);

    const stageCommand = program
      .command('stage')
      .description('Create, delete, and manage stages.');

    stageCommand
      .command('create <stage>')
      .description('Create a new stage.')
      .requiredOption('-b, --bucket <bucket>', 'Enter a bucket name.')
      .option(
        '-l, --local <local>',
        'Enter the stage file name. (default: .env.{name})'
      )
      .option(
        '-t, --target <target>',
        'Enter a target file name. (default: .env)'
      )
      .action(onStageCreateCommand);

    stageCommand
      .command('remove <stage>')
      .description('Delete the existing stage.')
      .requiredOption('-c, --confirm', 'Confirm deletion.')
      .action(onStageRemoveCommand);

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
