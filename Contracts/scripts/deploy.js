// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// MUMBAI NEW
// 0xb9a4e3856Abd141A6CD5aE1D7BD8A5D979B276F5


// Mainnet
// 0x5A4fF7b2d7AD3545E9f80d3831068Daa91609A9C

const hre = require("hardhat");

async function main() {

  const NFTAddress = '0xDCB074190B01A8c08c34866eE972D363C4339D53';
  const Lock = await hre.ethers.getContractFactory("NFTStaking");
  const lock = await Lock.deploy(NFTAddress);

  await lock.deployed();

  console.log(
    `Deployed to ${lock.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
