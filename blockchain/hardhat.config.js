require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: process.env.MUMBAI_RPC,
      accounts: [process.env.DEPLOYER_KEY],
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      accounts: [process.env.DEPLOYER_KEY],
    },
    sepolia:{
      url:process.env.SEPOLIA,
      accounts:[process.env.DEPLOYER_KEY],
    }
  },
};
