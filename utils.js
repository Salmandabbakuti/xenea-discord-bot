const { REST, Routes } = require("discord.js");
const { DISCORD_BOT_TOKEN, DISCORD_SERVER_APPLICATION_ID } = require("./config.js");

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
      "Verify your wallet to access exclusive server channels",
  },
  {
    name: "serverconfig",
    description: "Configure the server",
    options: [
      {
        name: "tokenaddress",
        description: "Token Address",
        type: 3,
        required: true
      },
      {
        name: "minimumbalance",
        description: "Minimum Balance",
        type: 4,
        required: true
      },
      {
        name: "startchannel",
        description: "Start Channel",
        type: 7,
        required: true
      },
      {
        name: "role",
        description: "Role to assign",
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
    `Started refreshing ${commands.length} application (/) commands.`
  );
  try {
    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(DISCORD_SERVER_APPLICATION_ID, guildId),
      { body: commands }
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error("Error while refreshing application (/) commands:", error);
  }
};

module.exports = {
  deployCommands
};