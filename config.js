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
  jwtSecret: env.JWT_SECRET
};

module.exports = config;
