// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

// MUMBAI NEW
// 0xb9a4e3856Abd141A6CD5aE1D7BD8A5D979B276F5


const hre = require("hardhat");

async function main() {

  const NFTAddress = '0x29e648F05a16190eeFA21F963CB45b13A6c8fa8c';
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
