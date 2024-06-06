const express = require("express");
const cors = require("cors");
const {
  Client,
  GatewayIntentBits,
  Events,
  Partials,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require("discord.js");

const { DISCORD_BOT_TOKEN } = require("./config");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.GuildMember]
});
client.login(DISCORD_BOT_TOKEN);

client.once(Events.ClientReady, () =>
  console.log(`Logged in as ${client.user.tag}`)
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🔥 Server listening at http://localhost:${port} 🚀`)
);