// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";
// import dotenv from "dotenv";

// dotenv.config();
const settings = {
  apiKey: "_LC-mQ-dmzf-GuyvYVJh0Q_gCM3cbWXR", // Replace with your Alchemy API Key.
  network: Network.MATIC_MAINNET, // Replace with your network.
};

const contractAddress = "0xdcb074190b01a8c08c34866ee972d363c4339d53";

export const fetchNFTss = async (walletAddress) => {

const alchemy = new Alchemy(settings);

const ownerAddr = walletAddress;

const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
// console.log("number of NFTs found:", nftsForOwner.totalCount);
// console.log("...");

const NFTS = {
  items: []
};

// Print contract address and tokenId for each NFT:
for (const nft of nftsForOwner.ownedNfts) {

  if(nft.contract.address == contractAddress){
    const nfts = {};
    nfts.contractAddress = nft.contract.address;

    nfts.tokenId = nft.tokenId;
    // oldNFT.tokenURI = nft.tokenUri.gateway;
    NFTS.items.push(nfts);
  }
}
// console.log(allOld);
// console.log(allNew);

return [NFTS.items, nftsForOwner.totalCount];

}

// const x = await fetchNFTss('0x25dD6D56533F72512BAe2B7a312984241F84De95');
// console.log(x);
