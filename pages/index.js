import { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import StakingIcon from '@/components/StakingIcon';
import { getAllStakesOfUser, getStakedPoints, getUnStakedPoints, isApprovedForAll, getIfLockingNotRequired, stakingAddress, getTotalPointsOfUser } from '../Interaction/init.js';
import { fetchNFTss } from '../Interaction/FetchNFTs.mjs';
import NoNFTs from '@/components/NoNFTs.js';
import ConnectButton from '@/components/ConnectButton.js';
import { useSetApprovalForAll, useStake, useUnStake, usemultiStake, usemultiUnStake } from '@/Interaction/contractWrite.js';

import {
    useAccount,
} from 'wagmi'

export default function Home({ signer, connectWallet }) {
    const [walletConnected, setWalletConnected] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [stakedNFTCount, setStakedNFTCount] = useState(0);
    const [yourStakedNFTCount, setYourStakedNFTCount] = useState(0);
    const [selectedNFTs, setSelectedNFTs] = useState([]);

    const [imageLoaded, setImageLoaded] = useState({});
    const [totalPoints, setTotalPoints] = useState(0);

    const { setApproval, isApprovalLoading, isApprovalSuccessful } = useSetApprovalForAll(stakingAddress);
    const { stake: stakeNFT, isStakeLoading, isStakeSuccessful } = useStake();
    const { unStake: unStakeNFT, isUnStakeLoading, isUnStakeSuccessful } = useUnStake();
    const { multiUnStake: multiUnStakeNFT } = usemultiUnStake();
    const { multiStake: multiStakeNFT } = usemultiStake();



    const multipleNFTsSelected = selectedNFTs.length > 1;


    const { address } = useAccount()




    // const URI = "https://staking.searchers.gg/api/file/";
    const URI = "http://localhost:3000/api/file/";


    useEffect(() => {
        // console.log("first", address);

        if (address === undefined) {
            setWalletConnected(false);
        } else {
            // console.log("second", signer);
            setWalletConnected(true);

            const fetchNFTData = async () => {
                try {
                    const walletAddress = address;
                    const [stakes, unstakedNftsData] = await Promise.all([
                        getAllStakesOfUser(address),
                        fetchNFTss(walletAddress)
                    ]);

                    const tempTotalPoints = await getTotalPointsOfUser(address);
                    setTotalPoints(tempTotalPoints);
                    // console.log("TTPP", totalPoints)
                    // const stakedCount = stakes.length;
                    const totalStakedInContract = await fetchNFTss(stakingAddress);
                    setStakedNFTCount(totalStakedInContract[1]);


                    // Fetch points for each staked NFT
                    const stakedNFTsWithPoints = await Promise.all(stakes.map(async stake => {
                        const points = await getStakedPoints(stake.tokenId);
                        const response = await fetch(`/api/file/${stake.tokenId}.json`);
                        const data = await response.json();
                        return {
                            id: stake.tokenId,
                            name: data.name,
                            isStaked: stake.isStaked,
                            image: `/api/file/${stake.tokenId}.png`,
                            points: points, // Set the points from getTotalPoints
                            specialStake: stake.specialStake
                        };
                    }));

                    const yourStakedNFTs = stakedNFTsWithPoints.filter(stakedNFTsWithPoints => stakedNFTsWithPoints.isStaked);
                    setYourStakedNFTCount(yourStakedNFTs.length);

                    // Fetch points for each unstaked NFT
                    const formattedUnstakedNFTs = await Promise.all(unstakedNftsData[0].map(async nft => {
                        const points = await getUnStakedPoints(nft.tokenId);
                        const response = await fetch(`/api/file/${nft.tokenId}.json`);
                        // const responseImg = await fetch(`/api/file/${nft.tokenId}.png`);
                        console.log(`/api/file/${nft.tokenId}.png`)
                
                        const data = await response.json();
                        return {
                            id: nft.tokenId,
                            name: data.name,
                            isStaked: false,
                            image: `/api/file/${nft.tokenId}.png`,
                            points: points, // Set the points from getTotalPoints
                            specialStake: false
                        };
                    }));

                    setNfts([...stakedNFTsWithPoints, ...formattedUnstakedNFTs]);


                    // Initialize imageLoaded state
                    const initialImageLoadedState = {};
                    [...stakedNFTsWithPoints, ...formattedUnstakedNFTs].forEach(nft => {
                        initialImageLoadedState[nft.id] = false;
                    });
                    setImageLoaded(initialImageLoadedState);
                } catch (error) {
                    console.error('Error fetching NFT data:', error);
                }
            };


            fetchNFTData();
        }
    }, [address]);


    const [activeTab, setActiveTab] = useState('Stake');


    const handleMultiStake = async (selectedNFTIds) => {
        const specialStakes = selectedNFTIds.map(id => {
            const nft = nfts.find(n => n.id === id);
            return nft?.specialStake || false;
        });

        let checkApprove = await isApprovedForAll(address);

        if (!checkApprove) {
            try {
                await setApproval();
            } catch (error) {
                alert('Approval Error');
                return;
            }
        }


        try {
            const multiStake = await multiStakeNFT({ args: [selectedNFTIds, specialStakes] });

            if (multiStake != null) {
                setNfts(prevNfts =>
                    prevNfts.map(nft =>
                        selectedNFTIds.includes(nft.id) ? { ...nft, isStaked: true } : nft
                    )
                );
            }

            setSelectedNFTs([]);  // Reset the selected NFTs after staking
        } catch (error) {
            console.error("Error staking multiple NFTs:", error);
        }
    }



    const handleStake = async (id, lock) => {

        let checkApprove = await isApprovedForAll(address);

        if (!checkApprove) {
            try {
                await setApproval();
            } catch (error) {
                alert('Approval Error');
                return;
            }
        }
        try {
            const stakeSucess = await stakeNFT({ args: [id, lock] });


            if (stakeSucess != null) {

                setNfts(prevNfts => prevNfts.map(nft => nft.id === id ? { ...nft, isStaked: true, specialStake: lock } : nft));
                const totalStakedInContract = await fetchNFTss(stakingAddress);
                setStakedNFTCount(totalStakedInContract[1]);
            }
        } catch (error) {
            console.error('Error staking NFT:', error);
            return;
        }

    };

    const handleUnstake = async (id) => {
        try {

            const nft = nfts.find(nft => nft.id === id);
            if (nft.specialStake) {
                const canUnstake = await getIfLockingNotRequired(id);
                if (!canUnstake) {
                    alert(`Required points not earned yet. You need ${19200 - Number(nft.points)} more`);
                    return;
                }
            }
            let unstakeSucess = await unStakeNFT({ args: [id] });
            if (unstakeSucess != null) {
                setNfts(prevNfts => prevNfts.map(nft => nft.id === id ? { ...nft, isStaked: false } : nft));
                const totalStakedInContract = await fetchNFTss(stakingAddress);
                setStakedNFTCount(totalStakedInContract[1]);
            }
        } catch (error) {
            console.error('Error unstaking NFT:', error);
            return;
        }

    };

    const handleMultiUnstake = async (selectedNFTIds) => {
        try {
            // You may need to modify the multiUnStake function to handle multiple NFTs.
            const multiUnStake = await multiUnStakeNFT({ args: [selectedNFTIds] });

            if (multiUnStake != null) {
                setNfts(prevNfts =>
                    prevNfts.map(nft =>
                        selectedNFTIds.includes(nft.id) ? { ...nft, isStaked: false } : nft
                    )
                );
            }

            setSelectedNFTs([]);  // Reset the selected NFTs after unstaking
        } catch (error) {
            console.error("Error unstaking multiple NFTs:", error);
        }
    }

    const toggleLock = (id) => {
        setNfts(prevNfts =>
            prevNfts.map(nft =>
                nft.id === id ? { ...nft, specialStake: !nft.specialStake } : nft
            )
        );
    };

    const toggleMultipleLock = () => {
        if (selectedNFTs.length === 0) return;

        const firstSelectedNFT = nfts.find(nft => nft.id === selectedNFTs[0]);
        const newLockState = !firstSelectedNFT.specialStake;

        setNfts(prevNfts =>
            prevNfts.map(nft =>
                selectedNFTs.includes(nft.id) ? { ...nft, specialStake: newLockState } : nft
            )
        );
    };


    const handleNFTSelection = (id) => {
        if (selectedNFTs.includes(id)) {
            setSelectedNFTs(prevSelected => prevSelected.filter(nftId => nftId !== id));
        } else {
            setSelectedNFTs(prevSelected => [...prevSelected, id]);
        }
    };



    const stakedPercentage = ((stakedNFTCount / 3500) * 100).toFixed(2);

    return (
        <div className="bg-primary-bg text-white min-h-screen flex flex-col p-6 px-4 font-main">
            <Navbar connectWallet={connectWallet} />
            <Sidebar />

            <div className="hero flex flex-col items-center justify-center mt-[5rem] p-0 shadow-lg rounded w-full lg:pl-[240px]">
                {!walletConnected ? (
                    <div className="space-y-4 py-auto text-center w-full bg-primary-bg rounded p-0">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-full gap-6 p-6 rounded-t-lg bg-secondary-bg">
                                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <StakingIcon />
                                            <span className="font-title text-primary">Staking</span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden relative flex justify-center rounded-full bg-secondary-bg border border-delimiter w-full h-[20px]">
                                        <div className="absolute top-0 left-0 h-full px-2 duration-200 ease-in-out bg-secondary text-end text-primary text-md" style={{ width: '0%' }}></div>
                                        <span className="z-10 mx-auto text-xs">
                                            <span className="text-sm text-primary/80">Connect wallet to load</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6 w-full p-2 sm:p-3 lg:p-6 rounded-b-lg bg-tertiary-bg max-w-[calc(100vw-1rem)]">
                                <div className="flex items-center justify-center">
                                    <ConnectButton
                                        connectWallet={connectWallet}
                                    // disconnectWallet={disconnectWallet}
                                    // address={address}
                                    // loading={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col w-full gap-6 p-6 rounded-t-lg bg-secondary-bg">
                            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6">
                                <div className="flex items-center justify-between gap-6">
                                    <div className="flex items-center gap-2">
                                        <StakingIcon />
                                        <span className="font-title text-primary">Staking</span>
                                    </div>
                                </div>
                                <div className="h-auto w-full overflow-hidden relative flex justify-center rounded-full bg-secondary-bg border border-delimiter h-[20px]">
                                    <div className="absolute top-0 left-0 h-full px-2 duration-200 ease-in-out bg-secondary text-end text-primary text-md" style={{ width: `${stakedPercentage}%` }}></div>
                                    <span className="z-10 mx-auto text-xs">{stakedNFTCount}/3500</span>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-primary/70">Total Staked</span>
                                        <span className="text-sm text-primary">{stakedNFTCount}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-primary/70">Your Staked Searchers</span>
                                            <span className="text-sm text-right text-primary w-max">{yourStakedNFTCount} / {nfts.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6 w-full p-2 sm:p-3 lg:p-6 rounded-b-lg bg-tertiary-bg max-w-[calc(100vw-1rem)]">
                                <div className="flex justify-center gap-4 bg-secondary-bg p-3">
                                    <button
                                        onClick={() => setActiveTab('Stake')}
                                        className={`text-primary font-title active:scale-95 transition-all flex justify-center items-center border border-secondary rounded-md hover:opacity-80 disabled:opacity-80 bg-secondary relative w-48 px-6 py-1 mr-6 text-sm ${activeTab === 'Stake' ? 'bg-secondary text-primary' : 'text-secondary'}`}
                                    >
                                        Stake
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('Unstake')}
                                        className={`text-primary font-title active:scale-95 transition-all flex justify-center items-center border border-secondary rounded-md hover:opacity-80 disabled:opacity-80 bg-secondary relative w-48 px-6 py-1 mr-6 text-sm ${activeTab === 'Unstake' ? 'bg-secondary text-primary' : 'text-secondary'}`}
                                    >
                                        Unstake
                                    </button>
                                </div>
                                <div className="mt-4">

                                    {multipleNFTsSelected && (
                                        <button
                                            onClick={() => {
                                                if (activeTab === 'Stake') {
                                                    console.log(selectedNFTs)
                                                    handleMultiStake(selectedNFTs);
                                                } else {
                                                    handleMultiUnstake(selectedNFTs);
                                                }
                                            }}
                                            className="text-purpleGlow font-title active:scale-95 transition-all flex justify-center items-center border border-purpleGlow rounded-md hover:opacity-80 disabled:opacity-80 bg-transparent relative w-full px-6 py-1 mr-6 text-sm mt-4 mb-4"
                                        >
                                            {activeTab === 'Stake' ? 'Multi-Stake' : 'Multi-Unstake'}
                                        </button>
                                    )}
                                    <div className={`grid ${nfts.length === 0 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5'} gap-4 bg-tertiary-bg-bg p-5`}>
                                        {nfts.length === 0 ? (
                                            <NoNFTs />
                                        ) : (
                                            nfts.filter(nft => activeTab === 'Stake' ? !nft.isStaked : nft.isStaked).map(nft => (
                                                <div
                                                    key={nft.id}
                                                    className={`p-3 border-2 ${selectedNFTs.includes(nft.id) ? 'border-purpleCustom border-4' : 'border-gray-700'} hover:border-purpleCustom hover:border-4 rounded-lg shadow-md bg-tertiary-bg text-center relative`}
                                                >
                                                    <input
                                                        id={`nft-${nft.id}`}
                                                        type="checkbox"
                                                        className="custom-checkbox"
                                                        checked={selectedNFTs.includes(nft.id)}
                                                        onChange={() => handleNFTSelection(nft.id)}
                                                    />
                                                    <label htmlFor={`nft-${nft.id}`} className="card-label w-full h-full">
                                                        <h2 className="mb-6 my-3 mx-5 border rounded-md border-gray-700 text-white bg-secondary-bg truncate break-words">{nft.name}</h2>
                                                        <img
                                                            src={nft.image}
                                                            alt={nft.name}
                                                            loading="lazy"
                                                            className="w-full h-45 object-cover mb-2 rounded"
                                                        // onLoad={() => setImageLoaded(prevState => ({ ...prevState, [nft.id]: true }))}
                                                        />
                                                        <p className='mb-2'>Points: {nft.points}</p>
                                                        {nft.isStaked ? (
                                                            nft.specialStake ? (
                                                                <span className="text-sm text-gray-500 my-2 w-full">
                                                                    🔒 Earning 40 per hour
                                                                </span>
                                                            )

                                                            : (
                                                                <span className="text-sm text-gray-500 my-2  w-full">
                                                                    Earning 25 per hour
                                                                </span>
                                                            )
                                                    ) : (
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label htmlFor={`lock-${nft.id}`} className="flex items-center cursor-pointer">
                                                                <span className="text-xs text-gray-500 mr-2">{!nft.specialStake ? 'Unlock' : 'Locked'}</span>
                                                                <div className="relative">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`lock-${nft.id}`}
                                                                        name={`lock-${nft.id}`}
                                                                        checked={nft.specialStake}
                                                                        onChange={() => toggleLock(nft.id)}
                                                                        className="sr-only"
                                                                    />
                                                                    <div className="block bg-gray-600 w-12 h-6 rounded-full"></div>
                                                                    <div className="dot absolute left-1 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out">
                                                                        <span className="lock-text text-xs text-gray-500"></span>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                            <span className="text-sm text-gray-500 ml-2">{nft.specialStake ? '40 per hour' : '25 per hour'}</span>
                                                        </div>

                                                        )}



                                                        <button
                                                            onClick={() => activeTab === 'Stake' ? handleStake(nft.id, nft.specialStake) : handleUnstake(nft.id)}
                                                            className="text-purpleGlow font-title active:scale-95 transition-all flex justify-center items-center border border-purpleGlow rounded-md hover:opacity-80 disabled:opacity-80 bg-transparent relative w-full px-6 py-1 mr-6 text-sm"
                                                        >
                                                            {activeTab}
                                                        </button>
                                                    </label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}