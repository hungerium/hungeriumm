'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import useWeb3Wallet from './useWeb3Wallet';
import { FaWallet, FaLock, FaGift, FaChartLine, FaClock, FaCoins, FaPlus, FaMinus, FaInfoCircle, FaExclamationTriangle, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmModal from './ConfirmModal';

console.log('Ethers library loaded in Staking:', typeof ethers !== 'undefined');

// Format helper
function formatNumberShort(val) {
  if (!val) return '0';
  let num = parseFloat(val.toString().replace(/[^\d.\-]/g, ''));
  if (isNaN(num)) return '0';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Helper function to extract numeric value from formatted strings like "8.1 COFFY"
function getNumericValue(val) {
  if (!val) return 0;
  const num = parseFloat(val.toString().replace(/[^\d.\-]/g, ''));
  return isNaN(num) ? 0 : num;
}

// Helper to format integer with thousands separator
function formatInteger(val) {
  if (!val) return '0';
  let num = parseFloat(val.toString().replace(/[^\d.\-]/g, ''));
  if (isNaN(num)) return '0';
  return Math.round(num).toLocaleString();
}

// Helper to format balance for display: <1 ise küsuratlı, >=1 ise tam sayı ve binlik ayraçlı
function formatBalanceDisplay(val) {
  if (!val) return '0';
  let num = parseFloat(val.toString().replace(/[^\d.\-]/g, ''));
  if (isNaN(num)) return '0';
  if (num < 1 && num > 0) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  }
  return Math.floor(num).toLocaleString();
}

// Helper to format percentage
function formatPercent(numerator, denominator) {
  if (!denominator || isNaN(denominator) || denominator === 0) return '';
  const percent = (parseFloat(numerator) / parseFloat(denominator)) * 100;
  if (isNaN(percent)) return '';
  return percent.toFixed(2) + '%';
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

// Yeni ABI (kısa, sadece staking ve balance için)
const STAKING_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function stake(uint256)",
  "function unstake(uint256)",
  "function totalStaked() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function stakes(address) view returns (uint128 amount, uint64 startTime, uint64 lastClaim)",
  "function getStakingAPY(address) view returns (uint256)",
  "function claimStakingReward()",
  "function getStakeInfo(address) view returns (uint128 amount, uint64 startTime, uint128 pendingReward)"
];
const STAKING_ADDRESS = "0x54e3ffFD370E936323EC75551297b3bA5Fa63330";

// Sabit APY
const FIXED_APY = 5.00;

export default function Staking({ id }) {
  const { connectWallet, userAddress, tokenContract, isConnecting, connectionError } = useWeb3Wallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [status, setStatus] = useState('Please connect your wallet to stake');
  const [walletBalance, setWalletBalance] = useState('0.00');
  const [stakedBalance, setStakedBalance] = useState('0.00');
  const [rewards, setRewards] = useState('0.00');
  const [totalStaked, setTotalStaked] = useState('0 COFFY');
  const [stakeStartTime, setStakeStartTime] = useState(null);
  const [canUnstake, setCanUnstake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalSupply, setTotalSupply] = useState('0 COFFY');
  const [stakeData, setStakeData] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, message: '', onConfirm: null });
  const [apy, setApy] = useState('0');

  useEffect(() => {
    if (tokenContract && userAddress) {
      updateStakeInfo();
    }
    if (connectionError) {
      setStatus(connectionError);
    }
  }, [tokenContract, userAddress, connectionError]);

  // --- Balance'ı periyodik güncelle (her 15 saniye) ---
  useEffect(() => {
    if (!tokenContract || !userAddress) return;
    const interval = setInterval(() => {
      updateStakeInfo();
    }, 15000); // 15 saniye
    return () => clearInterval(interval);
  }, [tokenContract, userAddress]);

  // Token contract fallback (her zaman güncel ABI ile oluştur)
  async function getStakingContract() {
    if (tokenContract && tokenContract.stake && tokenContract.balanceOf) return tokenContract;
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer);
    }
    return null;
  }

  const updateStakeInfo = async () => {
    try {
      const contract = await getStakingContract();
      if (!contract) throw new Error('Staking contract not available');
      const balance = await contract.balanceOf(userAddress);
      const stakeInfo = await contract.getStakeInfo(userAddress); // [amount, startTime, pendingReward]
      const totalStakedAmount = await contract.totalStaked ? await contract.totalStaked() : 0;
      const totalSupplyAmount = await contract.totalSupply ? await contract.totalSupply() : 0;

      setWalletBalance(ethers.formatUnits(balance, 18));
      setTotalSupply(`${ethers.formatUnits(totalSupplyAmount, 18)} COFFY`);
      setTotalStaked(`${ethers.formatUnits(totalStakedAmount, 18)} COFFY`);

      // [0]=stakedAmount, [1]=startTime, [2]=pendingReward
      const stakedAmount = stakeInfo[0] ? ethers.formatUnits(stakeInfo[0], 18) : '0.00';
      const startTime = stakeInfo[1] ? Number(stakeInfo[1]) : 0;
      const pendingReward = stakeInfo[2] ? ethers.formatUnits(stakeInfo[2], 18) : '0.00';
      setStakedBalance(stakedAmount);
      setRewards(pendingReward);

      // Lock/unlock kontrolü
      if (parseFloat(stakedAmount) > 0 && startTime > 0) {
        const currentTime = Math.floor(Date.now() / 1000);
        const lockPeriod = 7 * 24 * 60 * 60;
        setStakeStartTime(startTime);
        setCanUnstake(currentTime >= startTime + lockPeriod);
      } else {
        setCanUnstake(false);
        setStakeStartTime(null);
      }
      setStatus('');
      setStakeData(stakeInfo);
    } catch (error) {
      console.error('Error updating stake info:', error);
      setStatus('Error fetching data');
    }
  };

  // ✅ Helper function for time remaining
  const formatTimeRemaining = () => {
    if (!stakeData?.startTime) return '---';
    
    const currentTimeForDisplay = Math.floor(Date.now() / 1000);
    const stakeStartTime = Number(stakeData.startTime || 0);
    const lockPeriod = 7 * 24 * 60 * 60; // 7 days
    const unlockTime = stakeStartTime + lockPeriod;
    const timeRemaining = unlockTime - currentTimeForDisplay;
    
    if (timeRemaining <= 0) return 'Unlocked ✅';
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  // ✅ Handle all transactions (stake, unstake, claim)
  const handleTransaction = async (action, amount = null) => {
    if (!tokenContract || !userAddress) {
      toast.error('❌ Please connect your wallet first', { autoClose: 4000 });
      return false;
    }

    setIsLoading(true);
    setError(null);
    
    if (action !== 'claim' && (!amount || isNaN(amount) || parseFloat(amount) <= 0)) {
      setError('Please enter a valid amount');
      setIsLoading(false);
      return false;
    }

    try {
      let tx;
      const contract = await getStakingContract();
      if (!contract) throw new Error('Staking contract not available');
      switch (action) {
        case 'stake':
          tx = await contract.stake(ethers.parseUnits(amount, 18));
          break;
        case 'unstake':
          // ✅ YENİ: Early unstake penalty kontrolü
          const stakeInfo = await contract.getStakeInfo(userAddress);
          const stakeStartTime = Number(stakeInfo.startTime || stakeInfo[1] || 0);
          const currentTimeForUnstake = Math.floor(Date.now() / 1000);
          const lockPeriod = 7 * 24 * 60 * 60; // 7 days
          const isEarlyUnstake = currentTimeForUnstake < (stakeStartTime + lockPeriod);
          
          if (isEarlyUnstake) {
            const remainingDays = Math.ceil((stakeStartTime + lockPeriod - currentTimeForUnstake) / (24 * 60 * 60));
            const penaltyPercent = 5;
            // Net miktarı hesapla
            const inputAmount = parseFloat(amount);
            const netAmount = inputAmount * 0.95;
            // window.confirm yerine modal
            return new Promise((resolve) => {
              setConfirmModal({
                open: true,
                message: `⚠️ Early Unstake Warning\n\nYour tokens are locked for ${remainingDays} more days.\nEarly unstaking will result in a ${penaltyPercent}% penalty.\n\nInput: ${inputAmount} COFFY\nNet alacağınız miktar: ${netAmount.toFixed(6)} COFFY\n\nAre you sure you want to continue?`,
                onConfirm: async () => {
                  setConfirmModal({ open: false, message: '', onConfirm: null });
                  console.log(`Early unstake with ${penaltyPercent}% penalty`);
                  try {
                    // inputtaki miktar kadar unstake
                    tx = await contract.unstake(ethers.parseUnits(amount, 18));
                    await updateStakeInfo();
                    setStakeAmount('');
                    setIsLoading(false);
                    resolve(true);
                  } catch (error) {
                    console.error(`unstake error:`, error);
                    setError(error.message || `unstake failed`);
                    setIsLoading(false);
                    resolve(false);
                  }
                }
              });
            });
          }
          // DEĞİŞTİ: inputtaki miktar kadar unstake
          tx = await contract.unstake(ethers.parseUnits(amount, 18));
          break;
        case 'emergency_unstake':
          console.log('Emergency unstaking all tokens...');
          // Emergency unstake - tüm stake'i çek (penalty ile)
          const allStakedAmount = await contract.stakes(userAddress);
          const totalStaked = allStakedAmount[0] || 0;
          
          if (!totalStaked || totalStaked.toString() === '0') {
            setError('No tokens staked for emergency unstake');
            throw new Error('No tokens staked for emergency unstake');
          }
          // Kullanıcıya net çekilecek miktarı göster
          const penaltyPercent = 5;
          const netAmount = typeof totalStaked === 'bigint'
            ? (totalStaked * 95n) / 100n
            : Math.floor(Number(totalStaked) * 0.95);
          const netAmountFormatted = ethers.formatUnits(netAmount.toString(), 18);
          toast.info(`Emergency Unstake: %${penaltyPercent} penalty uygulanacak.\nÇekilecek net miktar: ${netAmountFormatted} COFFY`, { autoClose: 6000 });
          // Kontrata raw BigNumber olarak gönder
          console.log('Unstaking amount (wei):', totalStaked.toString());
          tx = await contract.unstake(totalStaked);
          break;
        case 'claim':
          // window.confirm yerine modal
          return new Promise((resolve) => {
            setConfirmModal({
              open: true,
              message: `💡 Staking Rewards Information\n\nRewards are automatically paid when you unstake.\n\nOptions:\n• OK = Use Emergency Unstake (get all + rewards)\n• Cancel = Normal unstake with your chosen amount\n\nChoose OK for quick reward collection.`,
              onConfirm: async () => {
                setConfirmModal({ open: false, message: '', onConfirm: null });
                try {
                  // DEĞİŞTİ: inputtaki miktar kadar unstake
                  tx = await contract.unstake(ethers.parseUnits(stakeAmount, 18));
                  console.log('✅ Emergency unstake called - all stake + rewards claimed');
                  await updateStakeInfo();
                  setStakeAmount('');
                  setIsLoading(false);
                  resolve(true);
                } catch (error) {
                  console.error(`claim error:`, error);
                  setError(error.message || `claim failed`);
                  setIsLoading(false);
                  resolve(false);
                }
              }
            });
          });
        default:
          throw new Error('Invalid operation');
      }
      
      console.log('Transaction hash:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Status update with transaction hash
      showTransactionStatus(tx.hash);
      
      // Refresh data after transaction
      await updateStakeInfo();
      setStakeAmount(''); // Clear input after successful transaction
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(`${action} error:`, error);
      setError(error.message || `${action} failed`);
      setIsLoading(false);
      return false;
    }
  };

  // ✅ Stake tokens
  const stakeTokens = async () => {
    return await handleTransaction('stake', stakeAmount);
  };

  // ✅ Unstake tokens
  const unstakeTokens = async () => {
    return await handleTransaction('unstake', stakeAmount);
  };

  // ✅ Claim rewards
  const claimRewards = async () => {
    if (!tokenContract || !userAddress) {
      toast.error('❌ Please connect your wallet first', { autoClose: 4000 });
      return false;
    }
    setIsLoading(true);
    setError(null);
    try {
      const contract = await getStakingContract();
      if (!contract) throw new Error('Staking contract not available');
      const tx = await contract.claimStakingReward();
      const receipt = await tx.wait();
      showTransactionStatus(tx.hash);
      await updateStakeInfo();
      setIsLoading(false);
      return true;
    } catch (error) {
      setError(error.message || 'claim failed');
      setIsLoading(false);
      return false;
    }
  };

  const showTransactionStatus = (hash) => {
    const explorerUrl = `https://bscscan.com/tx/${hash}`;
    setStatus(
      <div className="transaction-status">
        Transaction confirmed! 
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
          View on BSCScan
        </a>
      </div>
    );
    setTimeout(() => setStatus(''), 10000);
  };

  // Parse total supply and total staked as numbers for percentage calculation
  const totalSupplyNum = parseFloat((totalSupply || '').toString().replace(/[^\d.\-]/g, ''));
  const totalStakedNum = parseFloat((totalStaked || '').toString().replace(/[^\d.\-]/g, ''));
  const walletBalanceNum = parseFloat((walletBalance || '').toString().replace(/[^\d.\-]/g, '')) || 0;
  const stakedBalanceNum = parseFloat((stakedBalance || '').toString().replace(/[^\d.\-]/g, '')) || 0;
  const rewardsNum = parseFloat((rewards || '').toString().replace(/[^\d.\-]/g, '')) || 0;
  const totalCoffy = walletBalanceNum + stakedBalanceNum + rewardsNum;

  return (
    <section id={id} className="relative py-20 bg-gradient-to-b from-[#1A0F0A] to-[#3A2A1E] min-h-[60vh] scroll-mt-24">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(212,160,23,0.15) 0%, transparent 70%)',
              'radial-gradient(circle at 100% 100%, rgba(212,160,23,0.15) 0%, transparent 70%)',
              'radial-gradient(circle at 0% 0%, rgba(212,160,23,0.15) 0%, transparent 70%)'
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[url('/images/coffee-beans-pattern.png')] opacity-[0.08] animate-slide"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#3A2A1E]/60 via-transparent to-[#2A1810]/60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] via-[#F4C430] to-[#D4A017]">
            Stake COFFY
          </h2>
          <p className="text-lg text-[#E8D5B5] max-w-2xl mx-auto">
            Stake your COFFY tokens and earn rewards. <b>Dynamic APY (based on character multiplier)</b> with enhanced security features.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#D4A017] to-[#A77B06] mx-auto mt-4"></div>
        </motion.div>

        {/* Stake formu ve içerik */}
        <div className="max-w-5xl mx-auto relative">
          {/* Modalı burada, kartın üstünde ve local olarak render et */}
          <ConfirmModal
            open={confirmModal.open}
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal({ open: false, message: '', onConfirm: null })}
            local={true}
          />
          {!userAddress ? (
            // Wallet bağlı değilse Connect Wallet göster
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#3A2A1E] to-[#2A1810] p-8 rounded-2xl shadow-xl border border-[#BFA181]/40 backdrop-blur-sm text-center"
            >
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-[#D4A017]/20 rounded-full flex items-center justify-center">
                  <FaWallet className="text-[#D4A017] text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-[#D4A017] mb-2">Connect Your Wallet</h3>
                <p className="text-[#E8D5B5] mb-6">
                  Connect your wallet to start staking COFFY tokens and earn 5% APY rewards
                </p>
              </div>
              
              {/* Preview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#2A1810]/60 p-4 rounded-lg border border-[#BFA181]/20">
                  <FaChartLine className="text-[#D4A017] text-xl mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">APY</p>
                  <p className="text-lg font-bold text-white">{FIXED_APY}%</p>
                </div>
                <div className="bg-[#2A1810]/60 p-4 rounded-lg border border-[#BFA181]/20">
                  <FaClock className="text-[#D4A017] text-xl mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">Lock Period</p>
                  <p className="text-lg font-bold text-white">7 Days</p>
                </div>
                <div className="bg-[#2A1810]/60 p-4 rounded-lg border border-[#BFA181]/20">
                  <FaCoins className="text-[#D4A017] text-xl mx-auto mb-2" />
                  <p className="text-xs text-gray-400 mb-1">No Min Stake</p>
                  <p className="text-lg font-bold text-white">-</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(212,160,23,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FaWallet className="inline mr-2" />
                    Connect Wallet
                  </>
                )}
              </motion.button>
              
              {connectionError && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-4"
                >
                  {connectionError}
                </motion.p>
              )}
            </motion.div>
          ) : (
            // Wallet bağlıysa normal staking interface
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#3A2A1E] to-[#2A1810] p-6 rounded-2xl shadow-xl border border-[#BFA181]/40 backdrop-blur-sm"
                style={{ fontSize: '0.95rem' }}
              >
                {/* Total Staked Global Stats */}
                <div className="bg-[#3A2A1E]/60 rounded-xl p-4 border border-[#BFA181]/40 mb-4 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-xl"
                    initial={{ opacity: 0.12 }}
                    animate={{ opacity: [0.12, 0.22, 0.12] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ background: 'radial-gradient(circle at 70% 30%, #D4A017 0%, transparent 70%)' }}
                  />
                  <div className="flex items-center justify-center gap-2 mb-1 relative z-10">
                    <i className="fas fa-users text-[#D4A017] text-base"></i>
                    <span className="text-[#D4A017] text-xs font-semibold">Total Staked</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5 relative z-10">{formatNumberShort(totalStaked)} COFFY</div>
                  <div className="text-xs text-gray-400 relative z-10">Locked in V2 staking</div>
                </div>

                {/* Yeni: Toplam Arz, Aylık APY, Wallet Adresi */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 place-items-center">
                  <div className="bg-[#2A1810]/60 p-4 rounded-lg border border-[#BFA181]/20 flex flex-col items-center w-full max-w-xs">
                    <FaCoins className="text-[#D4A017] text-xl mb-1" />
                    <span className="text-xs text-gray-400">Total Supply</span>
                    <span className="text-lg font-bold text-white">{totalSupply}</span>
                  </div>
                  <div className="bg-[#2A1810]/60 p-4 rounded-lg border border-[#BFA181]/20 flex flex-col items-center w-full max-w-xs">
                    <FaChartLine className="text-[#D4A017] text-xl mb-1" />
                    <span className="text-xs text-gray-400">Annual APY</span>
                    <span className="text-lg font-bold text-white">{FIXED_APY}%</span>
                  </div>
                  <div className="bg-[#2A1810]/60 p-4 rounded-lg border border-[#BFA181]/20 flex flex-col items-center w-full max-w-xs">
                    <FaWallet className="text-[#D4A017] text-xl mb-1" />
                    <span className="text-xs text-gray-400">Your Address</span>
                    <span className="text-lg font-bold text-white">{userAddress ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}` : '-'}</span>
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                  {/* Your Balance */}
                  <motion.div 
                    whileHover={{ scale: 1.07, y: -4, boxShadow: `0 8px 32px rgba(212,160,23,0.18)` }}
                    className={`bg-[#3A2A1E]/80 p-2 rounded-lg border border-blue-400/20 hover:border-blue-400/60 transition-all duration-300 flex flex-col justify-center items-center min-h-[90px] h-full relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.18 }}
                      style={{ background: `radial-gradient(circle at 60% 20%, #D4A017 0%, transparent 70%)` }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="flex items-center gap-1 mb-1 justify-center z-10 relative">
                      <i className="fas fa-wallet text-blue-400 text-base"></i>
                      <p className="text-blue-300 text-xs font-medium">Your Balance</p>
                    </div>
                    <p className="text-white font-bold text-base z-10 relative">
                      {Number(walletBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </motion.div>
                  {/* Your Staked */}
                  <motion.div 
                    whileHover={{ scale: 1.07, y: -4, boxShadow: `0 8px 32px rgba(212,160,23,0.18)` }}
                    className={`bg-[#3A2A1E]/80 p-2 rounded-lg border border-green-400/20 hover:border-green-400/60 transition-all duration-300 flex flex-col justify-center items-center min-h-[90px] h-full relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.18 }}
                      style={{ background: `radial-gradient(circle at 60% 20%, #D4A017 0%, transparent 70%)` }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="flex items-center gap-1 mb-1 justify-center z-10 relative">
                      <i className="fas fa-lock text-green-400 text-base"></i>
                      <p className="text-green-300 text-xs font-medium">Your Staked</p>
                    </div>
                    <p className="text-white font-bold text-base z-10 relative">
                      {Number(stakedBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    {/* Stake başlangıç zamanı küçük yazı */}
                    {stakeData && stakeData[1] ? (
                      <span className="text-[10px] text-gray-400 mt-1">Start: {new Date(Number(stakeData[1]) * 1000).toLocaleString()}</span>
                    ) : null}
                  </motion.div>
                  {/* Pending Rewards */}
                  <motion.div 
                    whileHover={{ scale: 1.07, y: -4, boxShadow: `0 8px 32px rgba(212,160,23,0.18)` }}
                    className={`bg-[#3A2A1E]/80 p-2 rounded-lg border border-purple-400/20 hover:border-purple-400/60 transition-all duration-300 flex flex-col justify-center items-center min-h-[90px] h-full relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.18 }}
                      style={{ background: `radial-gradient(circle at 60% 20%, #D4A017 0%, transparent 70%)` }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="flex items-center gap-1 mb-1 justify-center z-10 relative">
                      <i className="fas fa-gift text-purple-400 text-base"></i>
                      <p className="text-purple-300 text-xs font-medium">Pending Rewards</p>
                    </div>
                    <p className="text-white font-bold text-base z-10 relative">
                      {Number(rewards).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </motion.div>
                  {/* Your Total */}
                  <motion.div 
                    whileHover={{ scale: 1.07, y: -4, boxShadow: `0 8px 32px rgba(212,160,23,0.18)` }}
                    className={`bg-[#3A2A1E]/80 p-2 rounded-lg border border-yellow-400/20 hover:border-yellow-400/60 transition-all duration-300 flex flex-col justify-center items-center min-h-[90px] h-full relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 pointer-events-none rounded-lg"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.18 }}
                      style={{ background: `radial-gradient(circle at 60% 20%, #D4A017 0%, transparent 70%)` }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="flex items-center gap-1 mb-1 justify-center z-10 relative">
                      <i className="fas fa-coins text-yellow-400 text-base"></i>
                      <p className="text-yellow-300 text-xs font-medium">Your Total</p>
                    </div>
                    <p className="text-white font-bold text-base z-10 relative">
                      {(parseFloat(walletBalance) + parseFloat(stakedBalance) + parseFloat(rewards)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  </motion.div>
                </div>

                {/* Lock Period Warning */}
                {stakeStartTime && !canUnstake && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-lg p-3 mb-4"
                    style={{ fontSize: '0.92rem' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-clock text-orange-400 text-base"></i>
                      <span className="text-orange-300 font-semibold">
                        Lock Period: {formatTimeRemaining()} remaining
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">7-day security lock prevents immediate unstaking</p>
                  </motion.div>
                )}

                {/* Enhanced Input Section with Quick Actions */}
                <div className="bg-[#3A2A1E]/60 rounded-xl p-4 mb-4 border border-[#BFA181]/40">
                  <label className="block text-[#D4A017] text-xs font-semibold mb-2">
                    <i className="fas fa-coins mr-1"></i>
                    Stake/Unstake Amount
                  </label>
                  
                  {/* Manual Input */}
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter COFFY amount"
                    className="w-full p-3 rounded-lg bg-[#2A1810] text-[#E8D5B5] text-base border border-[#BFA181]/40 focus:border-[#D4A017] focus:outline-none transition-all duration-200 mb-3"
                  />

                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Available: {formatNumberShort(walletBalance)}</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(212,160,23,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={stakeTokens}
                    disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#BFA181] to-[#A77B06] text-white font-bold text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-plus"></i>
                    <span>Stake {stakeAmount ? `${parseFloat(stakeAmount).toFixed(2)}` : ''} COFFY</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(212,160,23,0.25)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={unstakeTokens}
                    disabled={isLoading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                    className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#BFA181] to-[#A77B06] text-white font-bold text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-unlock"></i>
                    <span>Unstake</span>
                    {rewards && parseFloat(rewards) > 0 && (
                      <span className="text-xs bg-[#A77B06]/80 px-2 py-1 rounded">
                        {parseFloat(rewards).toFixed(4)}
                      </span>
                    )}
                  </motion.button>
                </div>

                {/* Additional Info */}
                <div className="mt-3 text-center">
                  <p className="text-xs text-gray-400">
                    <i className="fas fa-shield-alt mr-1"></i>
                    Dynamic APY (character multiplier) • 7-Day Lock Period • V2 Smart Contract
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isLoading && !confirmModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-16 h-16 border-4 border-[#D4A017] border-t-transparent rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-[#A77B06] to-[#8B6914] text-white px-6 py-3 rounded-lg shadow-lg z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animate-slide {
          animation: slide 60s linear infinite;
        }
        @keyframes slide {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-50%, -50%); }
        }
      `}</style>
    </section>
  );
}