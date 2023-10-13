import { useContractWrite } from 'wagmi'
import ERC721 from "./ERC721.json" assert { type: 'json' };
import STAKING from "./staking.json" assert { type: 'json' };

import { NFTContractAddress, stakingAddress } from './init';

export const useSetApprovalForAll = (address) => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: NFTContractAddress,
    abi: ERC721.abi,
    functionName: 'setApprovalForAll',
    args: [address, true]
  });

  return {
    setApproval: writeAsync,
    approvalData: data,
    isApprovalLoading: isLoading,
    isApprovalSuccessful: isSuccess
  };
}


export const useStake = () => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: stakingAddress,
    abi: STAKING.abi,
    functionName: 'stake',
  });

  return {
    stake: writeAsync,
    stakeData: data,
    isStakeLoading: isLoading,
    isStakeSuccessful: isSuccess
  };
}


export const useUnStake = () => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: stakingAddress,
    abi: STAKING.abi,
    functionName: 'unstake',
  });

  return {
    unStake: writeAsync,
    unStakeData: data,
    isUnStakeLoading: isLoading,
    isUnStakeSuccessful: isSuccess
  };
}


export const useUpgradeName = () => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: stakingAddress,
    abi: STAKING.abi,
    functionName: 'upgradeName',
  });

  return {
    upgradeName: writeAsync,
    upgradeNameData: data,
    isUpgradeNameLoading: isLoading,
    isUpgradeNameSuccessful: isSuccess
  };
}

export const useupgradeImage = () => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: stakingAddress,
    abi: STAKING.abi,
    functionName: 'upgradeImage',
  });

  return {
    upgradeImage: writeAsync,
    upgradeImageData: data,
    isUpgradeImageLoading: isLoading,
    isUpgradeImageSuccessful: isSuccess
  };
}



export const usemultiStake = () => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: stakingAddress,
    abi: STAKING.abi,
    functionName: 'multiSTake',
  });

  return {
    multiStake: writeAsync,
    multiStakeData: data,
    isMultiStakeLoading: isLoading,
    isMultiStakeSuccessful: isSuccess
  };
}


export const usemultiUnStake = () => {
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    address: stakingAddress,
    abi: STAKING.abi,
    functionName: 'multiUnStake',
  });

  return {
    multiUnStake: writeAsync,
    multiUnSakeData: data,
    isMultiUnSakeLoading: isLoading,
    isMultiUnSakeSuccessful: isSuccess
  };
}


