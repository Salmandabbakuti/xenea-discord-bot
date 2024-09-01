require("dotenv").config();

module.exports = {
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  DISCORD_BOT_APPLICATION_ID: process.env.DISCORD_BOT_APPLICATION_ID,
  RPC_URL: process.env.RPC_URL,
  APP_URL: process.env.APP_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  LOG_LEVEL: process.env.LOG_LEVEL
};