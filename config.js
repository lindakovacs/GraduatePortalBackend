/**
 * On how to setup configuration files,
 * @see https://codingsans.com/blog/node-config-best-practices
 */

require("dotenv").config();

const { env } = process;

const config = {
  useCors: env.USE_CORS === "true",
  dbName: process.env.MONGO_DATABASE,
  dbCluster: process.env.MONGO_CLUSTER,
  dbUser: process.env.MONGO_USER,
  dbPassword: process.env.MONGO_PASSWORD,
  mongoUri: `mongodb+srv://${dbUser}:${dbPassword}@cluster${dbCluster}.mongodb.net/${dbName}?retryWrites=true`;
  awsAccessKeyId: env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  s3UploadRegion: env.S3_UPLOAD_REGION,
  s3UploadBucket: env.S3_UPLOAD_BUCKET,
  jwtSecret: env.JWT_SECRET
};

module.exports = config;
