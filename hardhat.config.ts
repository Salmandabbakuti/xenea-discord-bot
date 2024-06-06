import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const accounts = vars.has("PRIVATE_KEY") ? [vars.get("PRIVATE_KEY")] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    cvcKura: {
      url: "https://rpc-kura.cross.technology/",
      accounts
    },
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts
    }
  }
};

export default config;
