// pages/art-upgrade.js
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import 'tailwindcss/tailwind.css';
import ArtUpgradeIcon from '@/components/ArtUpgradeIcon';
import { getUnStakedPoints, upgradeImage, getIfAlreadyUpgraded } from '../Interaction/init.js';
import { fetchNFTss } from '../Interaction/FetchNFTs.mjs';
import ConnectButton from '@/components/ConnectButton.js';
import { useupgradeImage } from '@/Interaction/contractWrite.js';
import UpgradeAnimation from '@/components/UpgradeAnimation';

import {
    useAccount,

} from 'wagmi'


export default function ArtUpgrade({ signer, connectWallet, disconnectWallet, loading }) {
    const [walletConnected, setWalletConnected] = useState(false);
    const [nfts, setNfts] = useState([]);
    const URI = "https://soul-searchers-staking-complete.vercel.app/api/file/";
    const filterLimit = 0;
    const [isUpgrading, setIsUpgrading] = useState(false);

    const { address } = useAccount()

    const { upgradeImage: upgradeImageNFT, isUpgradeImageLoading, isUpgradeImageSuccessful } = useupgradeImage();

    useEffect(() => {
        if (address === undefined) {
            setWalletConnected(false);
        } else {
            setWalletConnected(true);

            const fetchNFTData = async () => {
                try {
                    const walletAddress = address;
                    const [unstakedNftsData] = await Promise.all([
                        fetchNFTss(walletAddress)
                    ]);

                    // Fetch details for each unstaked NFT
                    const unstakedNFTsWithDetails = await Promise.all(unstakedNftsData[0].map(async nft => {
                        const points = await getUnStakedPoints(nft.tokenId);
                        const upgradeCount = await getIfAlreadyUpgraded(nft.tokenId);
                        const response = await fetch(`/api/file/${nft.tokenId}.json`);
                        const data = await response.json();
                        return {
                            id: nft.tokenId,
                            name: data.name,
                            isStaked: false,
                            image: `/api/file/${nft.tokenId}.png`,
                            points: points,
                            specialStake: false,
                            upgradeCount: upgradeCount // Add upgradeCount to the nft object
                        };
                    }));

                    setNfts([...unstakedNFTsWithDetails]);
                    console.log("======", nfts)
                } catch (error) {
                    console.error('Error fetching NFT data:', error);
                }
            };

            fetchNFTData();
        }
    }, [address]);

    const handleUpgrade = async (nftId) => {

        const nft = nfts.find(nft => nft.id === nftId);
        if (nft.points < 19200) {
            alert(`Points should be greater than 19200 to proceed with the upgrade. You need ${(19200 - Number(nft.points))} more points.`);
            return;
        }
        const canChange = await upgradeImageNFT({ args: [nftId] });
        setIsUpgrading(true);
        if (canChange != null) {
            try {
                // Step 1: Make an API call to upgrade the NFT
                const response = await fetch('/api/upgradeNFT', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ tokenId: nftId }),
                });

                const result = await response.json();

                // Step 2: If the API call is successful, update the nfts state
                if (result.success) {
                    console.log(`NFT with ID: ${nftId} upgraded successfully`);
                    setNfts((prevNfts) =>
                        prevNfts.map((nft) =>
                            nft.id === nftId ? { ...nft, image: `/api/file/${nftId}.png` } : nft
                        )
                    );
                    
                } else {
                    console.error(`Error upgrading NFT with ID: ${nftId}`);
                }
            } catch (error) {
                console.error(`Error upgrading NFT with ID: ${nftId}`, error);
            }
        }
    };

    const handleAnimationEnd = () => {
        setIsUpgrading(false);
    };

    return (
        <div className="bg-primary-bg text-white min-h-screen flex flex-col p-6 px-4 font-main">
            <Navbar
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
                address={address}
                loading={loading}
            />
            <Sidebar></Sidebar>

            <div className="hero flex flex-col items-center justify-center mt-[5rem] p-0 shadow-lg rounded w-full lg:pl-[240px]">
                {!walletConnected ? (
                    <div className="space-y-4 py-auto text-center w-full bg-primary-bg rounded p-0">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-full gap-6 p-6 rounded-t-lg bg-secondary-bg">
                                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <ArtUpgradeIcon />
                                            <span className="font-title text-primary">Art Upgrade</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6 w-full p-2 sm:p-3 lg:p-6 rounded-b-lg bg-tertiary-bg max-w-[calc(100vw-1rem)]">
                                <div className="flex items-center justify-center">
                                    <ConnectButton
                                        connectWallet={connectWallet}
                                        disconnectWallet={disconnectWallet}
                                        address={address}
                                        loading={loading}
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
                                        <ArtUpgradeIcon />
                                        <span className="font-title text-primary">Art Upgrade</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6 w-full p-2 sm:p-3 lg:p-6 rounded-b-lg bg-tertiary-bg max-w-[calc(100vw-1rem)]">
                                <div className="overflow-y-auto max-h-[70vh]"> {/* Scrollable container */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"> {/* Responsive grid layout */}
                                        {nfts.filter(nft => nft.points >= filterLimit).map(nft => (
                                            <div key={nft.id} className="p-3 border border-gray-700 rounded-lg shadow-md bg-tertiary-bg text-center">
                                                <h2 className="mb-6 my-3 mx-5 border rounded-md border-gray-700 text-white bg-secondary-bg truncate break-words">{nft.name}</h2>
                                                <img src={nft.image} alt={nft.name} className="w-full h-45 object-cover mb-2 rounded" />
                                                <p className='mb-2'>Points: {nft.points}</p>
                                                {nft.upgradeCount > 1 ? (
                                                    <p className="text-purpleGlow font-title active:scale-95 transition-all flex justify-center items-center border border-purpleGlow rounded-md hover:opacity-80 disabled:opacity-80 bg-transparent relative w-full px-6 py-1 mr-6 text-sm"
                                                    >Evolved</p>
                                                ) : (
                                                    <div>
                                                        <button
                                                            className="text-purpleGlow font-title active:scale-95 transition-all flex justify-center items-center border border-purpleGlow rounded-md hover:opacity-80 disabled:opacity-80 bg-transparent relative w-full px-6 py-1 mr-6 text-sm"
                                                            onClick={() => handleUpgrade(nft.id)}
                                                        >
                                                            Upgrade
                                                        </button>
                                                        {isUpgrading && (
                                                            <UpgradeAnimation
                                                                oldImage={`/api/file/${nft.id}.png`}
                                                                newImage="/Duck.png"
                                                                onAnimationEnd={handleAnimationEnd}
                                                            />
                                                        )}

                                                    </div>
                                                )}
                                            </div>
                                        ))}

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