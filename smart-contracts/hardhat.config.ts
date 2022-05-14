import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-vyper";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./scripts";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  vyper: {
    version: "0.2.8",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // forking: {
      //   url: process.env.ETHEREUM_RPC_URL!,
      // },
      // mining: {
      //   auto: false,
      //   interval: 5000,
      // },
    },
    rinkeby: {
      chainId: 4,
      url: process.env.RINKEBY_RPC_URL,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
