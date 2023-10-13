import React from 'react';
import Link from 'next/link';
import StakingIcon from './StakingIcon'
import ArtUpgradeIcon from './ArtUpgradeIcon'
import LeaderboardIcon from './LeaderboardIcon';
import CustomizationIcon from './CustomizationIcon';
import SocialLinks from './SocialLinks';

export default function Sidebar({ isOpen }) {
    return (
        <div className={`flex flex-col justify-between h-[calc(100vh-60px)] lg:h-[calc(100vh-80px)] font-title fixed z-50 bg-primary-bg overflow-y-scroll scrollbar-thin scrollbar-thumb-secondary ${isOpen ? 'left-0' : 'left-[-100%]'} lg:left-6 top-[60px] lg:top-[90px] transition-all w-[200px] border-r lg:border-r-0 border-primary/20`}>
            <ul className="flex flex-col space-y-[18px] sm:space-y-[22px] lg:space-y-[26px]">
                <div className="flex flex-col gap-3 lg:hidden">
                </div>
                <Link href="/">
                    <li className="before:transition-all before:duration-150 before:ease-linear before:rounded-full before:content-[&quot;&quot;] before:bg-secondary flex items-center gap-3 pl-[10px] lg:pl-1 cursor-pointer before:w-[2px] before:h-[0px] text-white hover:text-primary/80 fill-primary hover:fill-primary/80">
                        <StakingIcon />
                        <span className="text-sm sm:text-base lg:text-lg font-main">Staking</span>
                    </li>
                </Link>
                <Link href="/art-upgrade">
                    <li className="before:transition-all before:duration-150 before:ease-linear before:rounded-full before:content-[&quot;&quot;] before:bg-secondary flex items-center gap-3 pl-[10px] lg:pl-1 cursor-pointer before:w-[2px] before:h-[0px] text-white hover:text-primary/80 fill-primary hover:fill-primary/80">
                        <ArtUpgradeIcon />
                        <span className="text-sm sm:text-base lg:text-lg font-main">Upgrade</span>
                    </li>
                </Link>
                <Link href="/customization">
                    <li className="before:transition-all before:duration-150 before:ease-linear before:rounded-full before:content-[&quot;&quot;] before:bg-secondary flex items-center gap-3 pl-[10px] lg:pl-1 cursor-pointer before:w-[2px] before:h-[0px] text-white hover:text-primary/80 fill-primary hover:fill-primary/80">
                       <CustomizationIcon />
                        <span className="text-sm sm:text-base lg:text-lg font-main">Customization</span>
                    </li>
                </Link>
                <Link href="/leaderboard">
                    <li className="before:transition-all before:duration-150 before:ease-linear before:rounded-full before:content-[&quot;&quot;] before:bg-secondary flex items-center gap-3 pl-[10px] lg:pl-1 cursor-pointer before:w-[2px] before:h-[0px] text-white hover:text-primary/80 fill-primary hover:fill-primary/80">
                        <LeaderboardIcon />
                        <span className="text-sm sm:text-base lg:text-lg font-main">Leaderboard</span>
                    </li>
                </Link>
                <SocialLinks />
            </ul>
        </div>
    );
}

