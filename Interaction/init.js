import { ethers } from 'ethers';
import ERC721 from "./ERC721.json" assert { type: 'json' };
import STAKING from "./staking.json" assert { type: 'json' };


let provider = new ethers.providers.JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/_LC-mQ-dmzf-GuyvYVJh0Q_gCM3cbWXR"); // MAINNET
// let provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/dd9EpJa39E2QqmbtgwgXl4MHY0DHkGg3"); // TESTNET



// NEW ADDRESS FOR STAKING = 0xF9103c34E186De1678A4925De749CA9deb5F4659

// NEW ADDRESS FOR STAKING = 0xb9a4e3856Abd141A6CD5aE1D7BD8A5D979B276F5
// export const NFTContractAddress = "0x29e648F05a16190eeFA21F963CB45b13A6c8fa8c"; // Testnet mumbai

export const NFTContractAddress = "0xDCB074190B01A8c08c34866eE972D363C4339D53"; // mainnet poygon

// export const stakingAddress = "0xb9a4e3856Abd141A6CD5aE1D7BD8A5D979B276F5"; // Testnet mumbai

export const stakingAddress = "0x5A4fF7b2d7AD3545E9f80d3831068Daa91609A9C";  // mainnet poygon





export const setApprovalForAll = async (signer) => {
    try {
        let erc721Contract = new ethers.Contract(NFTContractAddress, ERC721.abi, signer);
        let approve = await erc721Contract.setApprovalForAll(stakingAddress, true);
        return approve;
    } catch (error) {
        console.error(`Error in approveNFT: ${error}`);
    }
}

// console.log("setApprovalForAll", await setApprovalForAll(signerOwner))

export const isApprovedForAll = async (address) => {
    try {
        let erc721Contract = new ethers.Contract(NFTContractAddress, ERC721.abi, provider);
        let approve = await erc721Contract.isApprovedForAll(address, stakingAddress);
        return approve;
    } catch (error) {
        console.error(`Error in isApprovedForAll: ${error}`);
    }
}

// console.log("isApprovedForAll", await isApprovedForAll(signerOwner))



export const getAllStakesOfUser = async (addr) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, provider);
        let stakeData = await stakingContract.getAllStakesOfUser(addr);

        // Format the returned data
        let formattedStakeData = stakeData.map(stake => ({
            tokenId: stake.tokenId.toNumber(),
            points: stake.points.toNumber(),
            isStaked: stake.isStaked,
            specialStake: stake.specialStake, // Changed isLocked to specialStake
        }));

        return formattedStakeData;
    } catch (error) {
        console.error(`Error in getAllStakesOfUser: ${error}`);
    }
}

// Testing the function
// console.log("getAllStakesOfUser", await getAllStakesOfUser(signerOwner));




export const getTotalPointsOfUser = async (addr) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, provider);
        let points = await stakingContract.getTotalPointsOfUser(addr);
        return (points.toNumber());
    } catch (error) {
        console.error(`Error in getTotalPointsOfUser: ${error}`);
    }
}


// console.log("getTotalPointsOfUser", await getTotalPointsOfUser(signerOwner))


export const stake = async (signer, id, lock) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, signer);
        let stake = await stakingContract.stake(id, lock, { gasLimit: ethers.utils.parseUnits('4000000', 'wei') });
        return true;
    } catch (error) {
        console.error(`Error in stake: ${error}`);
        return false;

    }
}

// console.log("Stake NFT", await stake(signerOwner, 3, false))

export const unstake = async (signer, id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, signer);
        let unstake = await stakingContract.unstake(id, { gasLimit: ethers.utils.parseUnits('4000000', 'wei') });
        return true;
    } catch (error) {
        console.error(`Error in unstake: ${error}`);
        return false;

    }
}

// console.log("unstake NFT", await unstake(signerOwner, 1))


export const upgradeImage = async (signer, id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, signer);
        let upgrade = await stakingContract.upgradeImage(id, { gasLimit: ethers.utils.parseUnits('4000000', 'wei') });
        return upgrade;
    } catch (error) {
        console.error(`Error in upgradeImage: ${error}`);
    }
}


export const upgradeName = async (signer, id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, signer);
        let upgrade = await stakingContract.upgradeName(id, { gasLimit: ethers.utils.parseUnits('4000000', 'wei') });
        return upgrade;
    } catch (error) {
        console.error(`Error in upgradeName: ${error}`);
    }
}

export const getStakedPoints = async (id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, provider);
        let points = await stakingContract.getTotalPoints(id);
        return (points.toNumber());
    } catch (error) {
        console.error(`Error in upgradeName: ${error}`);
    }
}


export const getUnStakedPoints = async (id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, provider);
        let points = await stakingContract.getPointsOfNFT(id);
        return (points.toNumber());
    } catch (error) {
        console.error(`Error in upgradeName: ${error}`);
    }
}

export const getIfLockingNotRequired = async (id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, provider);
        let permission = await stakingContract.getIfLockingNotRequired(id);
        return permission;
    } catch (error) {
        console.error(`Error in upgradeName: ${error}`);
    }
}


export const getIfAlreadyUpgraded = async (id) => {
    try {
        let stakingContract = new ethers.Contract(stakingAddress, STAKING.abi, provider);
        let stake = await stakingContract.stakes(id);
        return (stake.usedCounter).toNumber();
    } catch (error) {
        console.error(`Error in upgradeName: ${error}`);
    }
}

