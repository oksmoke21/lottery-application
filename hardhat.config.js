require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.apiPublicKeyPolygon}`,
      accounts: [process.env.privateKey]
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.apiPublicKeyPolygon}`,
      accounts: [process.env.privateKey]
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.apiPublicKeyEthereum}`,
      accounts: [process.env.privateKey]
    },
  }
};
