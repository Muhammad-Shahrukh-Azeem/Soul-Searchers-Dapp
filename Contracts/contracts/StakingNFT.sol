// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStaking is Ownable {
    IERC721 public nftContract;

    uint256 public POINTS_REQUIRED_FOR_UPGRADE = 19200;
    uint256 public POINTS_REQUIRED_FOR_NAME = 5000;
    uint256 public REWARD_PER_HOUR = 20;
    uint256 public SPECIAL_REWARD_PER_HOUR = 32;

    mapping(uint256 => bool) public specialNFTs; // Mapping to identify special NFTs

    struct StakeInfo {
        uint256 stakedAt;
        uint256 points;
        uint256 usedCounter;
        uint256 unStakedAt;
        bool isStaked;
        bool specialStake;
    }

    struct Data {
        uint tokenId;
        uint points;
        bool isStaked;
        bool specialStake;
    }

    mapping(uint256 => StakeInfo) public stakes;

    mapping(address => Data[]) public userStakes;

    event Staked(uint256 tokenId, address staker);
    event Unstaked(uint256 tokenId, address unstaker);
    event ImageUpgraded(uint256 tokenId, address upgrader, uint256 usedCounter);
    event NameUpgraded(uint256 tokenId, address upgrader);

    constructor(address _nftContract) {
        nftContract = IERC721(_nftContract);
    }

    function setSpecialNFT(uint256[] memory tokenId) external onlyOwner {
        for (uint i = 0; i < tokenId.length; i++) {
            specialNFTs[i] = true;
        }
    }

    function removeSpecialNFT(uint256 tokenId) external onlyOwner {
        specialNFTs[tokenId] = false;
    }

    function setMaxPointsForArt(uint256 _newMax) external onlyOwner {
        POINTS_REQUIRED_FOR_UPGRADE = _newMax;
    }

    function setMaxPointsForName(uint256 _newMax) external onlyOwner {
        POINTS_REQUIRED_FOR_NAME = _newMax;
    }

    function setRewardPerHour(uint256 _new) external onlyOwner {
        REWARD_PER_HOUR = _new;
    }

    function setSpecialRewardPerHour(uint256 _new) external onlyOwner {
        SPECIAL_REWARD_PER_HOUR = _new;
    }

    function stake(uint256 tokenId, bool _specialStake) public {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Not the owner of NFT"
        );
        nftContract.transferFrom(msg.sender, address(this), tokenId);

        stakes[tokenId].stakedAt = block.timestamp;
        stakes[tokenId].isStaked = true;
        stakes[tokenId].specialStake = _specialStake;

        Data memory newStake;

        newStake = Data({
            tokenId: tokenId,
            points: stakes[tokenId].points,
            isStaked: true,
            specialStake: _specialStake
        });

        userStakes[msg.sender].push(newStake);

        emit Staked(tokenId, msg.sender);
    }

    function multiSTake(
        uint[] memory _tokenIds,
        bool[] memory _specialStakes
    ) public {
        require(
            _tokenIds.length == _specialStakes.length,
            "Invalid parameters"
        );
        for (uint i = 0; i < _tokenIds.length; i++) {
            stake(_tokenIds[i], _specialStakes[i]);
        }
    }

    function getTotalPointsOfUser(
        address user
    ) public view returns (uint256 totalPoints) {
        Data[] memory stakesForUser = userStakes[user];
        for (uint i = 0; i < stakesForUser.length; i++) {
            totalPoints += getTotalPoints(stakesForUser[i].tokenId);
        }
    }

    function getAllStakesOfUser(
        address user
    ) external view returns (Data[] memory) {
        return userStakes[user];
    }

    function getTotalPoints(uint256 tokenId) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - stakes[tokenId].stakedAt;
        uint256 hoursStaked = timeStaked / 3600;
        uint256 pointsEarned = 0;
        if (stakes[tokenId].specialStake || stakes[tokenId].isStaked) {
            if (stakes[tokenId].specialStake) {
                pointsEarned = hoursStaked * SPECIAL_REWARD_PER_HOUR;
            } else if (!stakes[tokenId].specialStake) {
                pointsEarned = hoursStaked * REWARD_PER_HOUR;
            }
        }
        return (stakes[tokenId].points + pointsEarned);
    }

    function getPointsOfNFT(uint _tokenId) public view returns (uint) {
        return stakes[_tokenId].points;
    }

    function getIfLockingNotRequired(uint _tokenId) public view returns (bool) {
        if (stakes[_tokenId].points >= POINTS_REQUIRED_FOR_UPGRADE) {
            return true;
        }
        return false;
    }

    function unstake(uint256 tokenId) public {
        require(
            nftContract.ownerOf(tokenId) == address(this),
            "NFT not staked"
        );

        if (stakes[tokenId].specialStake) {
            require(
                stakes[tokenId].points >= POINTS_REQUIRED_FOR_UPGRADE,
                "Cannot Unlock before Accuring Required Points"
            );
        }
        // Check if it's a special NFT
        if (specialNFTs[tokenId]) {
            uint256 accruedPoints = getTotalPoints(tokenId);
            if (stakes[tokenId].usedCounter == 0) {
                require(
                    accruedPoints >= POINTS_REQUIRED_FOR_UPGRADE,
                    "Special NFTs can't unstake for first time before accuring required points"
                );
            }
        }
        // Update points before unstaking
        stakes[tokenId].points = getTotalPoints(tokenId);
        stakes[tokenId].unStakedAt = block.timestamp;
        stakes[tokenId].isStaked = false;

        // Find the stake in the user's stake array and remove it
        Data[] storage stakesForUser = userStakes[msg.sender];
        for (uint i = 0; i < stakesForUser.length; i++) {
            if (stakesForUser[i].tokenId == tokenId) {
                stakesForUser[i] = stakesForUser[stakesForUser.length - 1];
                stakesForUser.pop();
                break;
            }
        }

        nftContract.transferFrom(address(this), msg.sender, tokenId);

        emit Unstaked(tokenId, msg.sender); // Emitting the event
    }


    function multiUnStake(uint[] memory _tokenIds) public {
        require(
            _tokenIds.length > 0,
            "Zero Selected"
        );
        for (uint i = 0; i < _tokenIds.length; i++) {
            unstake(_tokenIds[i]);
        }
    }

    function upgradeImage(uint256 tokenId) external returns (bool) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        uint256 accruedPoints = stakes[tokenId].points;
        require(
            accruedPoints >= POINTS_REQUIRED_FOR_UPGRADE,
            "Insufficient points"
        );

        stakes[tokenId].points = accruedPoints - POINTS_REQUIRED_FOR_UPGRADE; // Deduct used points
        stakes[tokenId].usedCounter += 1;
        Data[] storage stakesForUser = userStakes[msg.sender];
        for (uint i = 0; i < stakesForUser.length; i++) {
            if (stakesForUser[i].tokenId == tokenId) {
                stakesForUser[i].points -= POINTS_REQUIRED_FOR_UPGRADE;
                break;
            }
        }
        emit ImageUpgraded(tokenId, msg.sender, stakes[tokenId].usedCounter); // Emitting the event
        return true;
    }

    function upgradeName(uint256 tokenId) external returns (bool) {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        uint256 accruedPoints = stakes[tokenId].points;
        require(
            accruedPoints >= POINTS_REQUIRED_FOR_NAME,
            "Insufficient points"
        );

        stakes[tokenId].points = accruedPoints - POINTS_REQUIRED_FOR_NAME; // Deduct used points
        Data[] storage stakesForUser = userStakes[msg.sender];
        for (uint i = 0; i < stakesForUser.length; i++) {
            if (stakesForUser[i].tokenId == tokenId) {
                stakesForUser[i].points -= POINTS_REQUIRED_FOR_NAME;
                break;
            }
        }
        emit NameUpgraded(tokenId, msg.sender); // Emitting the event
        return true;
    }
}
