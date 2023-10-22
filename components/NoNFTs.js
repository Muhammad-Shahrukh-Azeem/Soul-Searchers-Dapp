import React from 'react';

export default function NoNFTs() {
    return (
        <div className="text-center font-title mt-[2.5rem]">
            <p className="text-3xl uppercase ">No Searchers Available.</p>
            <p className="mb-6 text-3xl uppercase">You should consider buying one.</p>
            <div className="flex justify-center gap-4 mt-8">
                <div className='mt-3 font-title uppercase'> Buy On</div>
                <a href="https://magiceden.io/collections/polygon/0xDCB074190B01A8c08c34866eE972D363C4339D53" target="_blank" rel="noopener noreferrer">
                    <button className="font-title transition-all flex justify-center items-center rounded-md hover:opacity-80 disabled:opacity-80 bg-purpleCustom text-primary px-6 py-2 text-md h-[45px] w-[180px]">
                        <img src="/dew.png" alt="Dew Icon" className="mr-2 h-5" />
                    </button>
                </a>
                <a href="https://dew.gg/collection/soul-searchers-polygon" target="_blank" rel="noopener noreferrer">
                    <button className="font-title transition-all flex justify-center items-center rounded-md hover:bg-pink-900 disabled:opacity-80 bg-pink-700 text-primary px-6 py-2 text-md h-[45px] w-[180px]">
                        <img src="/me.png" alt="Magic Eden Icon" className="mr-2 h-7" />
                    </button>
                </a>
            </div>
        </div>
    );
}