import React, { useState } from "react";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import Sidebar from "./Sidebar";

export default function Navbar({
  connectWallet,
  disconnectWallet,
  address,
  loading,
}) {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isHamburger, setIsHamburger] = useState(true);

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
    setIsHamburger(!isHamburger);
  };

  return (
    <div className="px-6 fixed left-0 top-0 w-full h-[60px] z-20 lg:h-[80px] bg-primary-bg flex justify-between items-center">
      <div className="flex items-center h-full gap-3 z-40 bg-primary-bg">
        <Link href="/">
          <img
            src="./logo.png"
            className="h-[70px] lg:ml-6 inline lg:inline"
            alt="Logo"
          />
        </Link>
      </div>
      <div className="flex items-center ml-auto">
        <div className="items-center z-50 justify-center flex lg:hidden">
          <button
            className="text-md text-secondary hover:bg-transparent focus:outline-none focus:ring-0 hover:opacity-80 disabled:opacity-80"
            onClick={toggleNavbar}
          >
            <svg viewBox="0 0 512 512" className="w-4 h-4 fill-white">
              <g>
                {isHamburger ? (
                  <>
                    <path d="M480,224H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,224,480,224z"></path>
                    <path d="M32,138.667h448c17.673,0,32-14.327,32-32s-14.327-32-32-32H32c-17.673,0-32,14.327-32,32S14.327,138.667,32,138.667z"></path>
                    <path d="M480,373.333H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,373.333,480,373.333z"></path>
                  </>
                ) : (
                  <>
                    <path
                      d="M32,32L480,480"
                      stroke="white"
                      strokeWidth="32"
                    ></path>
                    <path
                      d="M480,32L32,480"
                      stroke="white"
                      strokeWidth="32"
                    ></path>
                  </>
                )}
              </g>
            </svg>
          </button>
        </div>
        <div className="items-center hidden lg:flex">
          <ConnectButton
            connectWallet={connectWallet}
            disconnectWallet={disconnectWallet}
            address={address}
            loading={loading}
          />
        </div>
      </div>
      <div
        className={`absolute left-0 top-0 flex items-center w-full h-screen gap-3 px-2 lg:relative lg:w-max sm:px-3 ${
          isNavbarOpen ? "block bg-primary-bg" : "hidden"
        } lg:block`}
      >
        <Sidebar isOpen={isNavbarOpen}></Sidebar>
      </div>
    </div>
  );
}