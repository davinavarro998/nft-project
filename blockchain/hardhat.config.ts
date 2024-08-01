import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",

  networks:{
    localhost:{
      url:"http://127.0.0.1:8545"
    },

    sepolia:{
      accounts:{
        mnemonic:`${process.env.MNEMONIC}`,
      },
      chainId:11155111,
      url:`${process.env.SEPOLIA_RPC}`
    }
  },
  etherscan:{
    apiKey:`${process.env.ETHERSCAN_API_KEY}`
  }
};

export default config;
