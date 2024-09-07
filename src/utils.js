const { REST, Routes } = require("discord.js");
const fetch = require("node-fetch");
const { createLogger, format, transports } = require('winston');
const errsole = require('errsole');
const ErrsoleSQLite = require('errsole-sqlite');
const { DISCORD_BOT_TOKEN, DISCORD_BOT_APPLICATION_ID, LOG_LEVEL } = require("./config.js");

const { combine, timestamp, printf, colorize, errors } = format;

//errsole setup
errsole.initialize({
  storage: new ErrsoleSQLite("./logs.db"),
  collectLogs: ['error', 'warn', 'info', 'debug'],
  port: 3001,
  enableConsoleOutput: true,
  enableDashboard: true,
});
// Log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const extraArgsArr = meta[Symbol.for('splat')];
  const extraArgs = extraArgsArr?.length ? extraArgsArr.join(" ") : "";
  return `${timestamp} [${level}]: ${message} ${extraArgs}`;
});

// Logger configuration
const logger = createLogger({
  level: LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    colorize(),
    timestamp({
      format: 'MMM D YYYY hh:mm:ss A'
    }),
    logFormat
  ),
  transports: [new transports.Console()]
});

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
    async execute(interaction) {
      await interaction.reply("Pong!");
    }
  },
  {
    name: "verify",
    description:
      "Verify your wallet to access gated channels",
  },
  {
    name: "get-serverconfig",
    description: "Get server settings for verification/gating",
  },
  {
    name: "set-serverconfig",
    description: "Configure server settings for verification/gating by admin",
    options: [
      {
        name: "tokenaddress",
        description: "Contract address of ERC20/721 token for gating access",
        type: 3,
        required: true
      },
      {
        name: "minimumbalance",
        description: "Required minimum balance to assign gated role",
        type: 4,
        required: true
      },
      {
        name: "startchannel",
        description: "Channel to receive informational messages from bot",
        type: 7,
        required: true
      },
      {
        name: "role",
        description: "Role to assign to verified users",
        type: 8,
        required: true
      },
      {
        name: "webhookurl",
        description: "Discord channel Webhook URL to post critical messages to server admins",
        type: 3,
        required: false
      }
    ]
  }
];
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(DISCORD_BOT_TOKEN);

const deployCommands = async (guildId) => {
  logger.info(
    `Started deploying ${commands.length} application (/) commands on guild ${guildId}.`
  );
  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(DISCORD_BOT_APPLICATION_ID, guildId),
      { body: commands }
    );

    logger.info(
      `Successfully deployed ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    logger.error("Error while deploying application (/) commands:", guildId, error);
  }
};

const postDataToWebhook = (webhookUrl, data) => {
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((res) => {
      if (!res.ok) {
        logger.error(`Failed to post data to webhook: ${res.status} - ${res.statusText}`);
        return;
      }
      logger.info("Data posted to webhook successfully");
    })
    .catch((err) => logger.error("Error while posting data to webhook", err));
};

module.exports = {
  deployCommands,
  logger,
  postDataToWebhook,
  errsole
};