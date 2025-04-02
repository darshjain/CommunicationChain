/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/YOUR_API_KEY",
      accounts: ["0xPRIVATE_KEY"]
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/YOUR_API_KEY",
      accounts: ["0xPRIVATE_KEY"]
    }
  }
};
