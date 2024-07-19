# Xenea Gated Discord Bot

The Xenea Gated Discord Bot facilitates secure and gated exclusive access to server channels for users holding specific tokens. This bot verifies users' token balances, granting them roles based on their holdings. This role-based access provides exclusive entry to gated channels and periodically checks and updates their roles based on their current balance. Xenea Discord Bot allows you to gate Discord channels to certain users who hold a specific amount of NFT tokens or ERC20 tokens on Xenea Testnet/mainnet. This bot can be installed on any Discord server and configured with your own tokens and roles.

### Prerequisites

1. A Discord Account

2. A Discord server where you have permissions to manage roles and channels and add bots.

3. A wallet with required ERC20/721 tokens to be verified.

### Steps:

#### For Server Admins

1. Install the Xenea bot on your Discord server. You can use the following link to add the bot to your server. [Add Bot to Server](https://discord.com/oauth2/authorize?client_id=1248189350177669150)

2. Move the bot to the top of the role hierarchy in your server. This is required for the bot to assign roles to users. Settings -> Roles -> Drag the bot role to the top.

3. Set up the server config(i.e token address, required balance, role to assign) using the command `/serverconfig` in the `#⁠start-here` channel on the server.

#### For Server Members

4. Open the `#⁠start-here` (or any info channel your community managers instruct) channel on discord server. Type the command `/verify` in the channel.

5. Bot will send you a link to connect your wallet and sign a message. After you sign the message, the bot will verify if you have required ERC20/721 tokens(token address and required amount set by server admin) in your wallet.

6. If you have required amount of said tokens in wallet, you will be assigned the gated role(set by server admin in config) and gain access to the exclusive channels and perks on the server.

## Getting Started(Developer Guide)

### Prerequisites

1. A Discord account
2. A Discord server where you have permissions to manage roles and channels and add bots.
3. A wallet with required ERC20/721 tokens to be verified.

### Steps:

Coming soon...

### Troubleshooting

If you encounter any issues with the bot, please do the following:

1. Check that the bot has the necessary permissions in the server (Manage Roles, Manage Channels, Manage Messages)
2. Make sure bot role is higher than the roles it is assigning
3. Check that the environment variables have been set up correctly in the .env file
4. Check the logs for any error messages

## Change Log

### v1.0.0

- Added gating by any ERC20/721 token balances.
- Made the bot generic, allowing installation on multiple Discord servers with customizable options for token address, required balance, and role to assign.

### v0.0.2

- Added gating by utility LinkFolio NFT token balance

### v0.0.1

- Initial release

## Built With

- [Discord](https://discord.com/) - A free communications app that lets you share voice, video, and text chat with friends, game communities, and developers.
- [Discord.js](https://discord.js.org/) - A powerful Node.js module that allows you to interact with the Discord API very easily.
- [Ethers.js](https://docs.ethers.io/v5/) - A library that allows you to interact with the Ethereum blockchain.
- [Express.js](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [Xenea](https://xenea.io/) - An EVM-compatible Layer 1 blockchain with integrated autonomous decentralized on-chain storage.

## Safety

This is experimental software and subject to change over time.

This is a proof of concept and is not ready for production use. It is not audited and has not been tested for security. Use at your own risk.
I do not give any warranties and will not be liable for any loss incurred through any use of this codebase.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
