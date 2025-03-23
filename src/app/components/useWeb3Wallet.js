'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ABI for the token contract
const tokenABI = [
  // Basic ERC-20 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Staking functions
  "function stake(uint256 amount) external",
  "function unstake(uint256 amount) external",
  "function claimStakingReward() external",
  "function getStakeInfo(address account) view returns (uint256 stakedAmount, uint256 pendingReward)"
];

export default function useWeb3Wallet() {
  const [userAddress, setUserAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  
  // Token contract address - replace with your actual contract
  const tokenContractAddress = "0xYourTokenContractAddress";

  const initializeProvider = async () => {
    try {
      console.log('Initializing provider...');
      if (window.ethereum) {
        const ethersProvider = new ethers.BrowserProvider(window.ethereum);
        console.log('Provider initialized');
        setProvider(ethersProvider);
        return ethersProvider;
      } else {
        throw new Error('No Ethereum wallet detected');
      }
    } catch (error) {
      console.error('Provider initialization error:', error);
      setConnectionError('Error connecting to wallet. Please ensure you have MetaMask installed.');
      return null;
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      console.log('Connecting wallet...');
      
      const ethersProvider = provider || await initializeProvider();
      if (!ethersProvider) {
        throw new Error('Provider not available');
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log('Connected to account:', account);
      
      // Get signer
      const ethersSigner = await ethersProvider.getSigner();
      console.log('Signer obtained');
      
      // Initialize token contract
      const contract = new ethers.Contract(tokenContractAddress, tokenABI, ethersSigner);
      console.log('Contract initialized');
      
      setUserAddress(account);
      setSigner(ethersSigner);
      setTokenContract(contract);
      return account;
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectionError(error.message || 'Error connecting wallet');
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        } else {
          setUserAddress(null);
          setSigner(null);
          setTokenContract(null);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      // Clean up event listener
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Auto-initialize provider on component mount
  useEffect(() => {
    initializeProvider();
  }, []);

  return {
    connectWallet,
    userAddress,
    provider,
    signer,
    tokenContract,
    isConnecting,
    connectionError
  };
}
