import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3Modal } from '@web3modal/react';
import { AlchemyProvider } from '@ethersproject/providers';
import { Web3Modal } from "@web3modal/react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import '@/styles/globals.css';
import '@/styles/styles.css';

// const chains = [polygon];
const projectId = '5d9d49a124da1cad2eb9597a60dc039c';

const { chains, publicClient } = configureChains([polygon],[w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App({ Component, pageProps }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(undefined);
  const [address, setAddress] = useState(undefined);
  const { open, close } = useWeb3Modal();
  const [web3Provider, setWeb3Provider] = useState(null);
  const SPECIFIC_CHAIN_ID = 80001;

  useEffect(() => {
    if (provider) {
      const web3ProviderInstance = new Web3Provider(provider);
      setWeb3Provider(web3ProviderInstance);
    }
  }, [provider]);

  const connectWallet = async () => {
    try {
      try {
        await open();
      } catch (openError) {
        console.error('Error opening Web3Modal:', openError);
        return;
      }
  
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  

  const disconnectWallet = () => {
    close();
    setProvider(undefined);
    setSigner(undefined);
    setAddress(undefined);
  };

  return (
    <>
    <WagmiConfig config={wagmiConfig}>
      <Component
        {...pageProps}
        signer={signer}
        address={address}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
    </WagmiConfig>
    
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} defaultChain={polygon} />
    </>
  );
}

export default App;