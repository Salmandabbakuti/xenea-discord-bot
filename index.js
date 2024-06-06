const express = require("express");
const cors = require("cors");
const {
  Client,
  GatewayIntentBits,
  Events,
  Partials
} = require("discord.js");

const { DISCORD_BOT_TOKEN, DISCORD_SERVER_START_HERE_CHANNEL_ID } = require("./config");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember, Partials.Message]
});
client.login(DISCORD_BOT_TOKEN);

client.once(Events.ClientReady, () =>
  console.log(`Logged in as ${client.user.tag}`)
);

client.on(Events.MessageCreate, (msg) => {
  console.log("Message received", msg.content, msg.author.tag);
  if (
    msg.author.bot ||
    msg.system ||
    msg.channelId !== DISCORD_SERVER_START_HERE_CHANNEL_ID ||
    msg.channel.type === "DM"
  )
    return;

  // Basic command handler
  const commands = {
    ping: "pong",
    pong: "ping",
    "ping pong": "pong ping",
    date: new Date().toUTCString()
  };

  const commandResponse = commands[msg.content.toLowerCase()];
  if (commandResponse) {
    msg.reply(commandResponse);
  } else {
    const possibleCommands = [
      "/ping",
      "/verify",
      ...Object.keys(commands)
    ].join(", ");
    msg.reply(
      `I don't know what you mean. I can only respond to the following commands: ${possibleCommands}`
    );
  }
});

client.on(Events.InteractionCreate, (interaction) => {
  console.log("Interaction received", interaction.commandName);
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    interaction.reply({
      content: "pong!",
      ephemeral: true
    });
  } else if (interaction.commandName === "verify") {
    // Verify command logic: TBD
    interaction.reply({
      content: "This command is not implemented yet",
      ephemeral: true
    });
  } else {
    interaction.reply({
      content: "Unknown command",
      ephemeral: true
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🔥 Server listening at http://localhost:${port} 🚀`)
);
