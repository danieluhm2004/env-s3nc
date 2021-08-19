import AWS from 'aws-sdk';

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile:
    process.env.AWS_DEFAULT_PROFILE || process.env.AWS_PROFILE || 'default',
});

export const s3 = new AWS.S3();
