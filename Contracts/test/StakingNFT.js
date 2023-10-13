const { expect } = require("chai");

describe("NFTStaking", function() {
    let NFTStaking, nftStaking, NFT, nft, owner, addr1, addr2;

    beforeEach(async function() {
        // Deploy the NFT contract
        NFT = await ethers.getContractFactory("MyERC721");
        nft = await NFT.deploy("TestNFT", "TST");
        await nft.deployed();

        // Deploy the NFTStaking contract
        NFTStaking = await ethers.getContractFactory("NFTStaking");
        nftStaking = await NFTStaking.deploy(nft.address);
        await nftStaking.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe("Staking", function() {
        it("Should allow users to stake their NFTs", async function() {
            await nft.mint(addr1.address, 1);
            await nft.connect(addr1).approve(nftStaking.address, 1);
            await nftStaking.connect(addr1).stake(1);
            expect(await nft.ownerOf(1)).to.equal(nftStaking.address);
        });

        it("Should not allow non-owners to stake NFTs", async function() {
            await nft.mint(addr1.address, 1);
            await expect(nftStaking.connect(addr2).stake(1)).to.be.revertedWith("Not the owner of NFT");
          });

    });

    describe("Special NFTs", function() {
      it("Should allow the owner to set a special NFT", async function() {
          await nftStaking.setSpecialNFT(1);
          expect(await nftStaking.specialNFTs(1)).to.equal(true);
      });

      it("Should not allow non-owners to set a special NFT", async function() {
          await expect(nftStaking.connect(addr1).setSpecialNFT(1)).to.be.revertedWith("Ownable: caller is not the owner");
      });
  });

  describe("Unstaking", function() {
      beforeEach(async function() {
          await nft.mint(addr1.address, 1);
          await nft.connect(addr1).approve(nftStaking.address, 1);
          await nftStaking.connect(addr1).stake(1);
      });

      it("Should allow users to unstake their NFTs", async function() {
          await nftStaking.connect(addr1).unstake(1);
          expect(await nft.ownerOf(1)).to.equal(addr1.address);
      });

      it("Should not allow unstaking of special NFTs between 50% and 100% points", async function() {
        await nftStaking.setSpecialNFT(1);
        
        // Manipulate time to ensure the NFT has accrued more than 50% but less than 100% of the required points
        const requiredPoints = await nftStaking.POINTS_REQUIRED_FOR_UPGRADE();
        const halfPoints = requiredPoints / 2;
        await network.provider.send("evm_increaseTime", [halfPoints * 3550]); // Assuming 1 point per hour
        await network.provider.send("evm_mine");
    
        await expect(nftStaking.connect(addr1).unstake(1)).to.be.revertedWith("Special NFTs can't unstake between 50% and 100%");
    });
    
  });

  describe("Upgrading", function() {
      beforeEach(async function() {
          await nft.mint(addr1.address, 1);
          await nft.connect(addr1).approve(nftStaking.address, 1);
          await nftStaking.connect(addr1).stake(1);
      });

      it("Should allow users to upgrade their NFT image if they have enough points", async function() {
        const requiredPoints = await nftStaking.POINTS_REQUIRED_FOR_UPGRADE();
        await network.provider.send("evm_increaseTime", [requiredPoints * 3600]); // Assuming 1 point per hour
        await network.provider.send("evm_mine");
        await nftStaking.connect(addr1).unstake(1);
        await nftStaking.connect(addr1).upgradeImage(1);
        const stakeInfo = await nftStaking.stakes(1);
        expect(stakeInfo.usedCounter).to.equal(1);
    });
    

  //   it("Should not allow users to upgrade their NFT image if they don't have enough points", async function() {
  //     await nftStaking.connect(addr1).unstake(1); // Ensure the NFT is unstaked and owned by addr1
  //     // Manipulate time to ensure the NFT hasn't accrued enough points for an upgrade
  //     const requiredPoints = await nftStaking.POINTS_REQUIRED_FOR_UPGRADE();
  //     await network.provider.send("evm_increaseTime", [(requiredPoints / 2) * 3600]); // Assuming 1 point per hour
  //     await network.provider.send("evm_mine");
  //     await expect(nftStaking.connect(addr1).upgradeImage(1)).to.be.revertedWith('Insufficient points');
  // });
  
  
  });

describe("Points Management", function() {
    beforeEach(async function() {
        await nft.mint(addr1.address, 1);
        await nft.connect(addr1).approve(nftStaking.address, 1);
        await nftStaking.connect(addr1).stake(1);
    });

    it("Should reward correct number of points over time", async function() {
        const REWARD_PER_HOUR = await nftStaking.REWARD_PER_HOUR();

        // Manipulate time to accrue points
        const hoursToIncrease = 5; // Let's say we want to check for 5 hours
        await network.provider.send("evm_increaseTime", [hoursToIncrease * 3600]);
        await network.provider.send("evm_mine");

        // Unstake to update the points in the contract
        await nftStaking.connect(addr1).unstake(1);

        // Check the points
        const expectedPoints = hoursToIncrease * REWARD_PER_HOUR;
        const actualPoints = await nftStaking.getPointsOfNFT(1);
        expect(actualPoints).to.equal(expectedPoints);
    });

    it("Should reduce correct number of points after upgrade", async function() {
        const REWARD_PER_HOUR = await nftStaking.REWARD_PER_HOUR();

        // Manipulate time to ensure the NFT has accrued enough points for an upgrade
        const requiredPoints = await nftStaking.POINTS_REQUIRED_FOR_UPGRADE();
        await network.provider.send("evm_increaseTime", [requiredPoints * 3600 / REWARD_PER_HOUR]);
        await network.provider.send("evm_mine");

        // Unstake to update the points in the contract
        await nftStaking.connect(addr1).unstake(1);

        // Upgrade the image
        await nftStaking.connect(addr1).upgradeImage(1);

        // Check the points after upgrade
        const expectedPointsAfterUpgrade = 0; // Since we assume the NFT accrued just the right amount of points for an upgrade
        const actualPointsAfterUpgrade = await nftStaking.getPointsOfNFT(1);
        expect(actualPointsAfterUpgrade).to.equal(expectedPointsAfterUpgrade);
    });
});


});