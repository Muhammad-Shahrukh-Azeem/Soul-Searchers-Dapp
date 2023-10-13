// pages/customization.js
import CustomizationIcon from "@/components/CustomizationIcon";
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Select from 'react-select'
import { getUnStakedPoints, upgradeName } from '../Interaction/init.js';
import { fetchNFTss } from "../Interaction/FetchNFTs.mjs";
import ConnectButton from '@/components/ConnectButton.js';
import { useUpgradeName } from "@/Interaction/contractWrite.js";

import {
    useAccount,
  } from 'wagmi'


export default function Customization({ signer, connectWallet, disconnectWallet, loading }) {
    const [walletConnected, setWalletConnected] = useState(false);
    const [nfts, setNfts] = useState([]);
    const URI = "https://soul-searchers-staking-complete.vercel.app/api/file/";
    const filterAmount = 15;

    const { address } = useAccount()

    const { upgradeName: upgradeNameNFT, isUpgradeNameLoading, isUpgradeNameSuccessful } = useUpgradeName();


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

                    const unstakedNFTsWithDetails = await Promise.all(unstakedNftsData[0].map(async nft => {
                        const points = await getUnStakedPoints(nft.tokenId);
                        const response = await fetch(`/api/file/${nft.tokenId}.json`);
                        const data = await response.json();
                        return {
                            id: nft.tokenId,
                            name: data.name,
                            isStaked: false,
                            image: `/api/file/${nft.tokenId}.png`,
                            points: points,
                            specialStake: false
                        };
                    }));
                    setNfts(unstakedNFTsWithDetails);
                } catch (error) {
                    console.error('Error fetching NFT data:', error);
                }
            };

            fetchNFTData();
        }
    }, [address]);

    const [selectedNFT, setSelectedNFT] = useState(null);
    const [nftName, setNftName] = useState('');

    const userNFTs = nfts.filter(nft => nft.points > filterAmount).map(nft => ({
        value: nft.id,
        label: nft.name,
        image: nft.image
    }));



    const handleNFTChange = (selectedOption) => {
        setSelectedNFT(selectedOption);
    };

    const handleNameChange = (e) => {
        setNftName(e.target.value);
    };

    const handleSubmit = async () => {
        if (!selectedNFT || !nftName) {
            console.error('Please select an NFT and enter a new name');
            return;
        }

        const selectedNFTDetails = nfts.find(nft => nft.id === selectedNFT.value);

        if (selectedNFTDetails && selectedNFTDetails.points < 5000) {
            alert(`Insufficient points. You need at least 5000 points to perform this action. You need ${(5000 - Number(selectedNFTDetails.points))} more points.`);
            return;
        }

        const canChangeImage = await upgradeNameNFT({ args: [selectedNFT.value]});
        if (canChangeImage != null) {
            try {

                const response = await fetch('/api/upgradeName', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tokenId: selectedNFT.value,
                        newName: nftName,
                    }),
                });

                const result = await response.json();

                if (result.success) {
                    console.log('Name upgraded successfully');
                    setNfts((prevNfts) =>
                        prevNfts.map((nft) =>
                            nft.id === selectedNFT.value ? { ...nft, name: nftName } : nft
                        )
                    );
                } else {
                    console.error('Error upgrading name');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            console.error("Error: in name upgrade")
        }
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
                                            <CustomizationIcon />
                                            <span className="font-title text-primary">Customization</span>
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
                    <div className="space-y-4 py-auto text-center w-full bg-primary-bg rounded p-0">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-full gap-6 p-6 rounded-t-lg bg-secondary-bg">
                                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <CustomizationIcon />
                                            <span className="font-title text-primary">Customization</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6 w-full p-2 sm:p-3 lg:p-6 rounded-b-lg bg-tertiary-bg max-w-[calc(100vw-1rem)]">

                                    <div>
                                        <div>
                                            <div className="font-title">Name your NFT</div>
                                            <div className="relative inline-block">
                                                <img src="rename.png" alt="" width={550} height={210} layout="intrinsic" />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center space-y-4 w-2/5 mx-auto">
                                            <Select
                                                value={selectedNFT}
                                                onChange={handleNFTChange}
                                                options={userNFTs}
                                                placeholder="Select your NFT"
                                                className="w-full font-title self-center border border-transparent"
                                                getOptionLabel={(option) => (
                                                    <div className="flex text-purpleCustom items-center justify-center">
                                                        <img src={option.image} alt={option.label} width={20} className="mr-2" />
                                                        {option.label}
                                                    </div>
                                                )}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: 'transparent',
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        backgroundColor: '#151515',
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        backgroundColor: state.isFocused ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                                                        color: '#9155f6',
                                                        textAlign: 'center',
                                                    }),
                                                    placeholder: (provided) => ({
                                                        ...provided,
                                                        color: '#9155f6',
                                                        textAlign: 'center',
                                                        fontSize: '13px',
                                                    }),
                                                    singleValue: (provided) => ({
                                                        ...provided,
                                                        color: '#9155f6',
                                                        textAlign: 'center',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        width: '100%',
                                                        fontSize: '13px',
                                                    }),
                                                }}
                                            />

                                            <input
                                                type="text"
                                                value={nftName}
                                                onChange={handleNameChange}
                                                placeholder="Enter NFT Name"
                                                className="w-full p-2 border bg-transparent text-white rounded centeredPlaceholder"
                                            />

                                            <button
                                                onClick={handleSubmit}
                                                className="active:scale-95 font-title transition-all flex justify-center items-center rounded-md hover:opacity-80 disabled:opacity-80 bg-purpleGlow text-primary px-6 py-2 text-md">
                                                Pay 5000 Points
                                            </button>
                                        </div>

                                    </div>
                                    <div className="mt-4 text-sm text-gray-600 font-main">
                                        Note: No racist, sexist or homophobic names will be tolerated.
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

