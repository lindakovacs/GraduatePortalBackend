/**
 * On how to setup configuration files,
 * @see https://codingsans.com/blog/node-config-best-practices
 */

require("dotenv").config();

const { env } = process;

const config = {
  useCors: env.USE_CORS === "true",
  mongoUri: env.MONGO_DB_URI,
  mongoDbName: env.MONGO_DB_NAME,
  awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  s3UploadRegion: env.S3_UPLOAD_REGION,
  s3UploadBucket: env.S3_UPLOAD_BUCKET,
  jwtSecret: env.JWT_SECRET,
  gmailUser: env.GMAIL_USER,
  gmailPassword: env.GMAIL_PASSWORD,
  ebUrl: env.EB_URL
};

module.exports = config;

