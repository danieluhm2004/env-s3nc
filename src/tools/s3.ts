import AWS from 'aws-sdk';

const { AWS_DEFAULT_PROFILE, AWS_PROFILE } = process.env;

AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: AWS_DEFAULT_PROFILE || AWS_PROFILE || 'default',
});

export const s3 = new AWS.S3();
