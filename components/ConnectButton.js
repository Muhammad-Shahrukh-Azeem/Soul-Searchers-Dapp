import React from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi'

const ConnectButton = ({ connectWallet }) => {

  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { isLoading } = useConnect()

  // console.log("AAAA",isLoading)

  return (
    <div>
      {address ? (
        <div className="flex items-center">
          {/* <AddressAvatar address={address} /> */}
          <button
            className="active:scale-95 transition-all flex justify-center items-center border border-secondary rounded-md hover:opacity-80 disabled:opacity-80 bg-purple-500 text-white px-6 py-1 font-title text-sm"
            // onClick={() => alert('Address Button Clicked')}
            disabled={isLoading}
          >
            {address.substring(0, 6) + '...' + address.substring(address.length - 4)}
          </button>
          <button
            className="ml-2 active:scale-95 transition-all flex justify-center items-center border border-secondary rounded-md hover:opacity-80 disabled:opacity-80 bg-red-500 text-white px-6 py-1 font-title text-sm"
            onClick={disconnect}
            disabled={isLoading}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          className="active:scale-95 transition-all flex justify-center items-center border border-secondary rounded-md hover:opacity-80 disabled:opacity-80 bg-purple-500 text-white px-6 py-1 font-title text-sm"
          onClick={connectWallet}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Connect"}
        </button>
      )}
    </div>
  );
};

export default ConnectButton;
