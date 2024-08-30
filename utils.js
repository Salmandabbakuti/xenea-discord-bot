const { REST, Routes } = require("discord.js");
const { createLogger, format, transports } = require('winston');
const { DISCORD_BOT_TOKEN, DISCORD_BOT_APPLICATION_ID, LOG_LEVEL } = require("./config.js");

const { combine, timestamp, printf, colorize, errors, simple } = format;

// Log format
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const extraArgs = meta[Symbol.for('splat')];
  const stringArgs = extraArgs?.length ? extraArgs.join(" ") : "";
  return `${timestamp} [${level}]: ${message} ${stringArgs}`;
});

// Logger configuration
const logger = createLogger({
  level: LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: 'MMM D YYYY hh:mm:ss A'
    }),
    simple(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: LOG_LEVEL || 'info',
      format: combine(
        colorize(),
        logFormat
      )
    })
  ]
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

module.exports = {
  deployCommands,
  logger
};