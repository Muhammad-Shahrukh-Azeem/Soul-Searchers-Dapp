// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";
// import dotenv from "dotenv";

// dotenv.config();
const settings = {
  apiKey: "_LC-mQ-dmzf-GuyvYVJh0Q_gCM3cbWXR", // Replace with your Alchemy API Key.
  network: Network.MATIC_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);


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

const x = await fetchNFTss('0xc5C228b086E38e5a084f08715CeF35c68e0871C0');
console.log(x);




// // Setup: npm install alchemy-sdk
// import { Alchemy, Network } from "alchemy-sdk";

// // Setup: npm install alchemy-sdk


// const config = {
//   apiKey: "GQmmVecOmQIFVFu4S3HRVsZwlGrOyUf-",
//   network: Network.ETH_MAINNET,
// };
// const alchemy = new Alchemy(config);

// export const getStakedNfts = async () => {
//   // Wallet address
//   const address = "0x491bafbe0b3b3d69e4dc7273e7cc8b7b9623eef0";

//   // Initialize variables for pagination

//   let totalCount;
//   let nftList = [];
//   let finalList = [];
//   let pgkey = null;
//   // Loop through pages until all NFTs are retrieved
//   do {

//     // console.log("Page key" , pgkey)
//     // Get NFTs for current page
//     const nfts = await alchemy.nft.getNftsForOwner(address, { pageKey: pgkey , contractAddresses: ["0x45408ce844d0bf5061e9b25c2924aade4df884b3"]});

//     // Update totalCount
//     totalCount = nfts.totalCount;
//     pgkey = nfts.pageKey;

//     // Concatenate current page's NFTs to nftList
//     nftList = nftList.concat(nfts.ownedNfts);
//     // Increment page

//   } while (nftList.length < totalCount);

//   // console.log(`Total NFTs owned by ${address}: ${totalCount} \n`);

//   let i = 1;

//   for (let nft of nftList) {
//     const selectedList = {};
//     // console.log(`${i}. ${nft.title}, ID:${Number(nft.title.slice(10))}, Image Url:${nft.media[0].raw}`);
//     selectedList.title = nft.title;
//     selectedList.value = Number(nft.title.slice(10));
//     selectedList.tokenURI = nft.media[0].raw;
//     finalList.push(selectedList);
//     i++;
//   }

//   return [finalList, totalCount];
// };

