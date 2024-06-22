# CrossValue Gated Discord Bot

CrossValue Gated Discord Bot which facilitates secure and gated exclusive access to server channels for users holding CrossValue Chain (XCR) tokens. The bot verifies user's XCR balance, granting them the CVC Insider role if they meet the required balance. This role provides exclusive access to crossvalue gated channel, and periodically checks and updates their roles based on their current balance.

### Prerequisites

1. A Discord Account

2. An ethereum compatible wallet(eg. Metamask) with XCR testnet tokens. You can get testnet tokens from the CrossValue Discord server.

### Steps:

1. Join the CrossValue Hub Discord Server: https://discord.gg/S28xtbrYXt

2. Make sure you have at least 1 LinkFolio Profile minted to wallet to be verified. Please go to https://linkfol-io.vercel.app/ to create a LinkFolio Profile(You can think of it as web3 version of linktree to manage all your social links)

3. Open the `#⁠start-here` channel on discord server.Type the command `/verify` in the channel.

4. Our bot will send you a link to connect your wallet and sign a message. After you sign the message, the bot will verify if you have a LinkFolio Profile minted to your wallet.

5. If you have LinkFolio Profile NFT in your wallet, you will be assigned the `CVC Insider` role and gain access to the exclusive channels and perks on the server. If not, you will still be assigned the `member` role, which will allow you access to the `⁠#general` channels on the server.

## Getting Started(Developer Guide)

### Prerequisites

1. A Discord account
2. A Discord server where you have permissions to manage roles and channels and add bots.
3. An Ethereum wallet with some XCR testnet tokens. You can get some test tokens from the [CrossValue Chain Docs](https://docs.crossvalue.io/testnet/claim-kura-testnet-xcr).

### Steps:

Coming soon...

### Troubleshooting

If you encounter any issues with the bot, please do the following:

1. Check that the bot has the necessary permissions in the server (Manage Roles, Manage Channels, Manage Messages)
2. Check that the environment variables have been set up correctly in the .env file
3. Check the logs for any error messages

## Change Log

### v0.0.1

- Initial release

### v0.0.2

- Added gating by utility LinkFolio NFT token balance

## Built With

- [Discord](https://discord.com/) - A free communications app that lets you share voice, video, and text chat with friends, game communities, and developers.
- [Discord.js](https://discord.js.org/) - A powerful Node.js module that allows you to interact with the Discord API very easily.
- [Ethers.js](https://docs.ethers.io/v5/) - A library that allows you to interact with the Ethereum blockchain.
- [Express.js](https://expressjs.com/) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- [CrossValue Chain](https://crossvalue.io/) - An EVM-compatible Layer 1 blockchain with integrated autonomous decentralized on-chain storage.

## Safety

This is experimental software and subject to change over time.

This is a proof of concept and is not ready for production use. It is not audited and has not been tested for security. Use at your own risk.
I do not give any warranties and will not be liable for any loss incurred through any use of this codebase.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
