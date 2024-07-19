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
const { recoverAddress } = require("@ethersproject/transactions");
const { arrayify } = require("@ethersproject/bytes");
const { hashMessage } = require("@ethersproject/hash");
const { JsonRpcProvider } = require("@ethersproject/providers");
const { Contract } = require("@ethersproject/contracts");
const jwt = require("jsonwebtoken");
const prisma = require("./prisma");

const {
  DISCORD_BOT_TOKEN,
  DISCORD_SERVER_START_HERE_CHANNEL_ID,
  RPC_URL,
  REQUIRED_MINIMUM_BALANCE,
  APP_URL,
  JWT_SECRET
} = require("./config");

const app = express();
app.use(express.json());

const provider = new JsonRpcProvider(RPC_URL);

// compatile with erc20/erc721
const tokenABI = [
  "function balanceOf(address account) view returns (uint256)"
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.GuildMember, Partials.Message, Partials.Channel]
});
client.login(DISCORD_BOT_TOKEN);

client.once(Events.ClientReady, () =>
  console.log(`Logged in as ${client.user.tag}`)
);

client.on(Events.GuildMemberAdd, async (member) => {
  console.log("a new member hopped into server", member.user.tag);
  //get starthere channel from server config table
  const serverConfig = await prisma.serverConfig.findUnique({
    where: { guildId: member.guild.id },
  });

  if (!serverConfig) {
    console.log("Server not configured.");
    return;
  }


  const startHereChannel = member.guild.channels.cache.get(serverConfig.startChannelId);
  if (!startHereChannel) return;

  startHereChannel.send({
    content: `Welcome, ${member.user.username}. We hope you brought pizza! Please type \`/verify\` command to verify your wallet and get access to our exclusive channels and perks!`
  });
});

client.on(Events.GuildMemberRemove, (member) => {
  console.log("a member left the server", member.user.tag, member.id);
});

client.on(Events.MessageCreate, async (msg) => {
  console.log("Message received", msg.content);
  if (msg.author.bot || msg.system || msg.channel.type === "DM") return;

  const serverConfig = await prisma.serverConfig.findUnique({
    where: { guildId: msg.guildId },
  });

  if (!serverConfig) {
    msg.reply("Server not configured.");
    return;
  }

  if (msg.channelId !== serverConfig.startChannelId) return;

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

client.on(Events.InteractionCreate, async (interaction) => {
  console.log("Interaction received", interaction.commandName);
  if (!interaction.isChatInputCommand()) return;

  const serverConfig = await prisma.serverConfig.findUnique({
    where: { guildId: interaction.guildId },
  });

  if (!serverConfig) {
    interaction.reply({ content: "Server not configured.", ephemeral: true });
    return;
  }

  if (interaction.commandName === "ping") {
    interaction.reply({
      content: "pong!",
      ephemeral: true
    });
  } else if (interaction.commandName === "verify") {
    // Verify command logic: TBD
    const jwtToken = jwt.sign(
      { guildId: interaction.guildId, memberId: interaction.member.id },
      JWT_SECRET,
      { expiresIn: "5m" } // 5 minutes
    );
    const greeting = "Hello there! Welcome to the server!";
    const steps = [
      `Please Click on Verify with Wallet to verify your wallet address.`,
      "Make sure you have at least 1 LinkFolio Profile minted to wallet to be verified. Please go to https://linkfol-io.vercel.app/ to create a LinkFolio Profile",
      "Once verified, you'll be automatically assigned the CVC Insider role which will give you access to our exclusive channels and perks!"
    ];
    const outro =
      "If you have any questions or encounter any issues, please don't hesitate to reach out to us. Good luck and have fun!";
    const message = greeting + "\n\n" + steps.join("\n") + "\n\n" + outro;

    const verifyWithWalletButton = new ButtonBuilder()
      .setLabel("Verify with Wallet")
      .setStyle(ButtonStyle.Link)
      .setURL(`${APP_URL}/verify?token=${jwtToken}`);

    const linkfolioButton = new ButtonBuilder()
      .setLabel("LinkFolio")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://linkfol-io.vercel.app/`);
    const actionRow = new ActionRowBuilder().addComponents(
      verifyWithWalletButton,
      linkfolioButton
    );
    interaction.reply({
      content: message,
      components: [actionRow],
      ephemeral: true
    });
  } else {
    interaction.reply({
      content: "Unknown command",
      ephemeral: true
    });
  }
});

app.post("/verify", async (req, res) => {
  if (
    ["token", "address", "message", "signature"].some((key) => !req.body[key])
  )
    return res.status(400).json({
      code: "Bad Request",
      message: "Missing required fields: token/address/message/signature"
    });
  const { token, address, message, signature } = req.body;
  try {
    const { guildId, memberId } = jwt.verify(token, JWT_SECRET);
    console.log("decoded from token", { guildId, memberId });
    console.log("verifying signature and checking balance");
    const digest = arrayify(hashMessage(message));
    const recoveredAddress = recoverAddress(digest, signature);
    if (recoveredAddress.toLowerCase() !== address.toLowerCase())
      return res
        .status(401)
        .send({ code: "Unauthorized", message: "Invalid wallet signature" });

    // get serverconfig
    const serverConfig = await prisma.serverConfig.findUnique({
      where: { guildId },
    });

    if (!serverConfig) {
      return res.status(500).json({
        code: "Internal Server Error",
        message: "Server not configured."
      });
    }
    const { tokenAddress, minimumBalance, startChannelId } = serverConfig;

    const tokenContract = new Contract(tokenAddress, tokenABI, provider);
    const userBalance = await tokenContract.balanceOf(address);
    console.log("user token balance", userBalance.toString());

    const guild = client.guilds.cache.get(guildId);
    const member = await guild.members.fetch(memberId);
    const startHereChannel = guild.channels.cache.get(startChannelId);
    const truncatedAddress = address.slice(0, 5) + "..." + address.slice(-4);

    const hasRequiredBalance = userBalance.gte(minimumBalance);

    const memberRole = guild.roles.cache.find((role) => role.name === "member");
    await member.roles.add(memberRole);

    if (hasRequiredBalance) {
      const cvcInsiderRole = guild.roles.cache.find((role) => role.name === "CVC Insider");
      await member.roles.add(cvcInsiderRole);
      startHereChannel.send(
        `Hey <@${memberId}>, your wallet address ${truncatedAddress} has been verified and you have been given the CVC Insider role. You can now access the #crossvalue-exclusive channel.`
      );
    } else {
      startHereChannel.send(
        `Hey <@${memberId}>, your wallet address ${truncatedAddress} has been verified and you have been given member role. but, you do not have LinkFolio Profile minted to wallet. Please go to https://linkfol-io.vercel.app/ to create a LinkFolio Profile and come back to access the #crossvalue-exclusive channel.`
      );
    }
    return res.status(200).json({ code: "ok", message: "Success" });
  } catch (err) {
    console.log("failed to verify user:", err);
    return res
      .status(500)
      .json({ code: "Internal Server Error", message: err.message });
  }
});

app.get("/verify", (req, res) =>
  res.sendFile(__dirname + "/public/index.html")
);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`🔥 Server listening at http://localhost:${port} 🚀`)
);
