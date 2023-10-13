// pages/leaderboard.js
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import LeaderboardIcon from '@/components/LeaderboardIcon';
import ConnectButton from '@/components/ConnectButton.js';

import {
    useAccount
} from 'wagmi'

export default function Leaderboard({ signer, connectWallet, disconnectWallet, loading }) {

    const [walletConnected, setWalletConnected] = useState(false);

    const { address } = useAccount()

    useEffect(() => {
        // console.log("Signer value:", signer);
        if (address === undefined) {
            // console.log("first", signer);
            setWalletConnected(false);
        } else {
            // console.log("second", signer);
            setWalletConnected(true);
        }
    }, [address]);

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
                {address ? (
                    <div className="space-y-4 py-auto text-center w-full bg-primary-bg rounded p-0">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col w-full gap-6 p-6 rounded-t-lg bg-secondary-bg">
                                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-2">
                                            <LeaderboardIcon />
                                            <span className="font-title text-primary">Leaderboard</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col gap-2 sm:gap-3 lg:gap-6 w-full p-2 sm:p-3 lg:p-6 rounded-b-lg bg-tertiary-bg max-w-[calc(100vw-1rem)]">
                                    <div>
                                        <div>
                                            <div className="font-title">COMING SOON</div>
                                        </div>
                                    </div>
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
                                            <LeaderboardIcon />
                                            <span className="font-title text-primary">Leaderboard</span>
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
                )}
            </div>
        </div>
    );
}

