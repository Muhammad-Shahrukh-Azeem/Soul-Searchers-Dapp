import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "_LC-mQ-dmzf-GuyvYVJh0Q_gCM3cbWXR", // Replace with your Alchemy API Key.
  network: Network.MATIC_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const contractAddress = "0xdcb074190b01a8c08c34866ee972d363c4339d53";

export const fetchNFTss = async (walletAddress) => {
  const ownerAddr = walletAddress;
  let pageKey = null;
  const NFTS = { items: [] };
  let nftsForOwner;

  do {
    nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr, { pageKey });
    pageKey = nftsForOwner.pageKey;

    for (const nft of nftsForOwner.ownedNfts) {
      if (nft.contract.address === contractAddress) {
        const nfts = {};
        nfts.contractAddress = nft.contract.address;
        nfts.tokenId = nft.tokenId;
        NFTS.items.push(nfts);
      }
    }
  } while (pageKey != null);

  return [NFTS.items, NFTS.items.length];
}

// const x = await fetchNFTss('0x6C1D8596f7741d053b068261834D8F76A85Ac758');
// console.log(x);
