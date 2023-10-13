require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // hardhat: {
    //   forking: {
    //     url: "https://eth-mainnet.g.alchemy.com/v2/Hp5Za9Qlo3bRwT6zxRWtwzVoGq7Uqe8s"
    //   }
    // },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/dd9EpJa39E2QqmbtgwgXl4MHY0DHkGg3",
      accounts: ["5d40d64c12b77c03461a09f91ef78613ca7f2b08695685428ba5fdb0b3e84207"],
    }
  },
  etherscan: {
    apiKey: "3U11SWNDZRE6FXR8PIATRTQ885WPJ4Y6ZX"
  }
};
