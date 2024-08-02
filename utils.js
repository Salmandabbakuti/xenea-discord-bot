const { REST, Routes } = require("discord.js");
const { DISCORD_BOT_TOKEN, DISCORD_BOT_APPLICATION_ID } = require("./config.js");

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
  console.log(
    `Started deploying ${commands.length} application (/) commands on guild ${guildId}.`
  );
  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(DISCORD_BOT_APPLICATION_ID, guildId),
      { body: commands }
    );

    console.log(
      `Successfully deployed ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error("Error while deploying application (/) commands:", guildId, error);
  }
};

module.exports = {
  deployCommands
};