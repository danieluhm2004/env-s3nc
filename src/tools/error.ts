export class EnvS3ncError extends Error {
  name = 'EnvS3ncError';

  constructor(public message: string) {
    super();
  }
}
