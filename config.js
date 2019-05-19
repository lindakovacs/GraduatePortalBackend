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
  googleSheetApiKey: env.GOOGLE_SHEET_API_KEY,
  googleApiCredentials: {
    type: "service_account",
    project_id: env.project_id,
    private_key_id: env.private_key_id,
    private_key: env.private_key,
    client_email: env.client_email,
    client_id: env.client_id,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/jamal-236%40albanycancodegraduateportal.iam.gserviceaccount.com"
  }
};

module.exports = config;
