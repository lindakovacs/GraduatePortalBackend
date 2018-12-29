/**
 * On how to setup configuration files,
 * @see https://codingsans.com/blog/node-config-best-practices
 */

require("dotenv").config();

const { env } = process;

const config = {
  useCors: env.USE_CORS === "true",
  dbHost: env.DB_HOST,
  dbName: env.DB_NAME,
  dbUser: env.DB_USERNAME,
  dbPassword: env.DB_PASSWORD,
  awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  s3UploadRegion: env.S3_UPLOAD_REGION,
  s3UploadBucket: env.S3_UPLOAD_BUCKET,
  jwtSecret: env.JWT_SECRET
};

module.exports = config;
