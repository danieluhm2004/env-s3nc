# 🌴 Environment + 💾 S3 = 🔗 Env S3nc

It makes it easier to manage environment variables in S3.

## How to install?

You can install it using the npm command.

```bash
npm install -g env-s3nc
```

## How do I set it up?

Basically, it is managed through a file called `.env-s3nc.json`. you can store `.env` files from multiple projects in one bucket.

Access the workspace directory (eg ~/Workspace) that can be managed by **env-s3nc** and enter the following command to configure it.

```bash
env-s3nc init
```

Now, we need to set up the stage.

Basically, we recommend using dev, stage, and prod separately.

```bash
env-s3nc stage create <stage> -b <bucket> -l <env file>
```

`stage` is the name of the stage. (eg. prod)

For bucket, enter the name of your s3 bucket. And for local, enter the location of the .env file. (eg .env.prod)

If local is not entered, it consists of names such as `.env.{stage}` .

You can also create the rest of the stages like this.

## Where do I set up AWS Credentials?

AWS credentials are automatically loaded according to the settings in aws-cli .

If you want to set a specific profile, enter the `AWS_PROFILE` or `AWS_DEFAULT_PROFILE` environment variable as the profile you want.

## How do I upload a stage?

You can get the stage with the command below.

```bash
env-s3nc upload
```

If you want to upload only a specific stage, you can set the stage as shown below.

```bash
env-s3nc upload -s <stage>
```

## How do I download the stage file?

You can get the stage with the command below.

```bash
env-s3nc download
```

If you want to download only a specific stage, you can set the stage as shown below.

```bash
env-s3nc download -s <stage>
```

## How do I delete a stage?

You can delete a stage using the command below.

```bash
env-s3nc stage remove <stage> -c
```

## How are they stored on the stage?

It is saved as `{workspace}/{target}`

`workspace` is the name of the current project folder, and `target` can be set by entering the `-t` parameter in stage creation. so for example `nodejs-boilerplate/.env`

If you need to share environment variables with other developers, you can collaborate by providing an `.env-s3nc.json` file. `.env-s3nc.json` itself does not contain AWS credential information.
