/**
 * On how to setup configuration files,
 * @see https://codingsans.com/blog/node-config-best-practices
 */

require("dotenv").config();

const { env } = process;

const config = {
  useCors: env.USE_CORS === "true"
};

module.exports = config;
