import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3Modal } from '@web3modal/react';
import { Web3Modal } from "@web3modal/react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import '@/styles/globals.css';
import '@/styles/styles.css';

const chains = [polygon];
const projectId = '3a9a55fa65c55a359f9fb4a38ac95410';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
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
      // console.log('Initiating connection...');
      // console.log('Wagmi Config:', wagmiConfig);
      // console.log('Ethereum Client:', ethereumClient);
      // console.log('useWeb3Modal', open);
  
      try {
        await open();
      } catch (openError) {
        console.error('Error opening Web3Modal:', openError);
        return;
      }
  
      // Get the provider from the useWeb3Modal hook
      // const provider = await ethereumClient.getProvider();
      // console.log("PROVIDER", provider)
      // setProvider(provider);
  
      // if (provider) {
      //   const web3ProviderInstance = new Web3Provider(provider);
      //   setWeb3Provider(web3ProviderInstance);
  
      //   const network = await web3ProviderInstance.getNetwork();
      //   if (network.chainId !== SPECIFIC_CHAIN_ID) {
      //     try {
      //       await provider.request({
      //         method: 'wallet_switchEthereumChain',
      //         params: [{ chainId: '0x' + SPECIFIC_CHAIN_ID.toString(16) }],
      //       });
      //     } catch (switchError) {
      //       console.error('Error switching to the specific chain:', switchError);
      //     }
      //   }
  
      //   const signer = web3ProviderInstance.getSigner();
      //   const address = await signer.getAddress();
      //   console.log("ADDRESS:", address);
  
      //   setSigner(signer);
      //   setAddress(address);
      // } else {
      //   console.error('Provider is undefined after open method call');
      // }
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
    
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

export default App;