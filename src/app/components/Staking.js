'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import useWeb3Wallet from './useWeb3Wallet';

console.log('Ethers library loaded in Staking:', typeof ethers !== 'undefined');

// Format helper
function formatNumberShort(val) {
  if (!val) return '0';
  let num = parseFloat(val.toString().replace(/[^\d.\-]/g, ''));
  if (isNaN(num)) return '0';
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Staking() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [status, setStatus] = useState('Please connect your wallet to stake');
  const [walletBalance, setWalletBalance] = useState('0 COFFY');
  const [stakedBalance, setStakedBalance] = useState('0 COFFY');
  const [rewards, setRewards] = useState('0 COFFY');
  const [totalStaked, setTotalStaked] = useState('0 COFFY');
  const [stakeStartTime, setStakeStartTime] = useState(null);
  const [canUnstake, setCanUnstake] = useState(false);
  const { connectWallet, userAddress, tokenContract, isConnecting, connectionError } = useWeb3Wallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered: tokenContract:', tokenContract, 'userAddress:', userAddress);
    if (tokenContract && userAddress) {
      updateStakeInfo();
    }
    if (connectionError) {
      setStatus(connectionError);
    }
  }, [tokenContract, userAddress, connectionError]);

  const updateStakeInfo = async () => {
    try {
      console.log('Updating stake info for:', userAddress);
      const balance = await tokenContract.balanceOf(userAddress);
      console.log('Balance (raw):', balance.toString());
      const stakeInfo = await tokenContract.getStakeInfo(userAddress);
      const totalStakedAmount = await tokenContract.totalStaked();
      console.log('Stake Info:', stakeInfo);
      console.log('Total Staked:', totalStakedAmount.toString());
      
      setWalletBalance(`${ethers.formatUnits(balance, 18)} COFFY`);
      
      // Fix staked amount - check for different possible property names
      let stakedAmount = '0';
      if (stakeInfo.amount) {
        stakedAmount = ethers.formatUnits(stakeInfo.amount, 18);
      } else if (stakeInfo.stakedAmount) {
        stakedAmount = ethers.formatUnits(stakeInfo.stakedAmount, 18);
      } else if (stakeInfo[0]) {
        stakedAmount = ethers.formatUnits(stakeInfo[0], 18);
      }
      setStakedBalance(`${stakedAmount} COFFY`);
      setTotalStaked(`${ethers.formatUnits(totalStakedAmount, 18)} COFFY`);
      
      // Calculate pending rewards
      const pendingReward = await tokenContract.calculatePendingReward(userAddress);
      setRewards(`${ethers.formatUnits(pendingReward, 18)} COFFY`);
      
      // Check if user can unstake (7 days lock period)
      const startTime = stakeInfo.startTime || stakeInfo[1] || 0;
      if (parseFloat(stakedAmount) > 0 && startTime > 0) {
        const startTimeNum = Number(startTime);
        const currentTime = Math.floor(Date.now() / 1000);
        const lockPeriod = 7 * 24 * 60 * 60; // 7 days in seconds
        setStakeStartTime(startTimeNum);
        setCanUnstake(currentTime >= startTimeNum + lockPeriod);
      } else {
        setCanUnstake(false);
        setStakeStartTime(null);
      }
      
      setStatus('');
    } catch (error) {
      console.error('Error updating stake info:', error);
      setStatus('Error fetching data');
    }
  };

  const handleTransaction = async (operation, amount = null) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`Starting ${operation} transaction...`);
      console.log('Token Contract:', tokenContract ? 'Available' : 'Not Available');
      console.log('User Address:', userAddress);
      console.log('Amount:', amount);

      if (!tokenContract || !userAddress) {
        throw new Error('Wallet not connected or token contract not initialized');
      }

      let tx;
      switch (operation) {
        case 'stake':
          console.log('Staking amount in Wei:', ethers.parseUnits(amount, 18).toString());
          tx = await tokenContract.stake(ethers.parseUnits(amount, 18));
          break;
        case 'unstake':
          console.log('Unstaking amount in Wei:', ethers.parseUnits(amount, 18).toString());
          tx = await tokenContract.unstake(ethers.parseUnits(amount, 18));
          break;
        case 'claim':
          tx = await tokenContract.claimStakingReward();
          break;
        default:
          throw new Error('Invalid operation');
      }
      console.log('Transaction hash:', tx.hash);
      showTransactionStatus(tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');
      updateStakeInfo();
      return true;
    } catch (err) {
      console.error(`${operation} transaction failed:`, err);
      setError(err.message || 'Transaction failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const stakeTokens = () => handleTransaction('stake', stakeAmount);
  const unstakeTokens = () => handleTransaction('unstake', stakeAmount);
  const claimRewards = () => handleTransaction('claim');

  const showTransactionStatus = (hash) => {
    const statusDiv = document.createElement('div');
    statusDiv.innerHTML = `
      <div class="transaction-status">
        <a href="https://bscscan.com/tx/${hash}" target="_blank">
          Transaction pending... (${hash.slice(0, 6)}...${hash.slice(-4)})
        </a>
      </div>
    `;
    document.body.appendChild(statusDiv);
    setTimeout(() => statusDiv.remove(), 15000);
  };

  const formatTimeRemaining = () => {
    if (!stakeStartTime || canUnstake) return null;
    
    const currentTime = Math.floor(Date.now() / 1000);
    const lockPeriod = 7 * 24 * 60 * 60; // 7 days
    const unlockTime = stakeStartTime + lockPeriod;
    const timeRemaining = unlockTime - currentTime;
    
    if (timeRemaining <= 0) return null;
    
    const days = Math.floor(timeRemaining / (24 * 60 * 60));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <section className="py-16 bg-[#3A2A1E] relative overflow-hidden" id="staking">
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
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#BFA181] to-[#D4A017]">
            Stake COFFY
          </h2>
          <div className="w-16 h-1 bg-[#D4A017] mx-auto"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Modern Staking Interface */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#3A2A1E] to-[#2A1810] p-6 rounded-2xl shadow-xl border border-[#BFA181]/40 backdrop-blur-sm"
            style={{ fontSize: '0.95rem' }}
          >
            {/* Total Staked Global Stats */}
            <div className="bg-[#3A2A1E]/60 rounded-xl p-4 border border-[#BFA181]/40 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <i className="fas fa-users text-[#D4A017] text-base"></i>
                <span className="text-[#D4A017] text-xs font-semibold">Total Staked</span>
              </div>
              <div className="text-xl font-bold text-white mb-0.5">{formatNumberShort(totalStaked)} COFFY</div>
              <div className="text-xs text-gray-400">Locked in V2 staking</div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {[
                { label: "Your Balance", value: formatNumberShort(walletBalance), icon: "fas fa-wallet", color: "blue" },
                { label: "Your Staked", value: formatNumberShort(stakedBalance), icon: "fas fa-lock", color: "green" },
                { label: "Pending Rewards", value: formatNumberShort(rewards), icon: "fas fa-gift", color: "purple" },
                { label: "APR", value: "10%", icon: "fas fa-chart-line", color: "orange" }
              ].map((stat) => (
                <motion.div 
                  key={stat.label} 
                  whileHover={{ scale: 1.03, y: -2 }}
                  className={`bg-[#3A2A1E]/80 p-2 rounded-lg border border-${stat.color}-400/20 hover:border-${stat.color}-400/40 transition-all duration-200`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <i className={`${stat.icon} text-${stat.color}-400 text-base`}></i>
                    <p className={`text-${stat.color}-300 text-xs font-medium`}>{stat.label}</p>
                  </div>
                  <p className="text-white font-bold text-base">{stat.value}</p>
                </motion.div>
              ))}
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

            {/* Enhanced Input Section */}
            <div className="bg-[#3A2A1E]/60 rounded-xl p-4 mb-4 border border-[#BFA181]/40">
              <label className="block text-[#D4A017] text-xs font-semibold mb-2">
                <i className="fas fa-coins mr-1"></i>
                Stake/Unstake Amount
              </label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Enter COFFY amount"
                className="w-full p-3 rounded-lg bg-[#2A1810] text-[#E8D5B5] text-base border border-[#BFA181]/40 focus:border-[#D4A017] focus:outline-none transition-all duration-200"
              />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                <span>Min: 1 COFFY</span>
                <span>Available: {formatNumberShort(walletBalance)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(212,160,23,0.18)" }}
                whileTap={{ scale: 0.97 }}
                onClick={stakeTokens}
                disabled={isLoading || !stakeAmount}
                className="py-3 px-4 rounded-lg bg-gradient-to-r from-[#BFA181] to-[#A77B06] text-white font-bold text-base shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i className="fas fa-plus mr-1"></i>
                Stake
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(212,160,23,0.12)" }}
                whileTap={{ scale: 0.97 }}
                onClick={unstakeTokens}
                disabled={isLoading || !stakeAmount || !canUnstake}
                className="py-3 px-4 rounded-lg border border-[#BFA181] text-[#D4A017] font-bold text-base hover:bg-[#BFA181] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i className="fas fa-minus mr-1"></i>
                Unstake
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 6px 18px rgba(34,197,94,0.18)" }}
                whileTap={{ scale: 0.97 }}
                onClick={claimRewards}
                disabled={isLoading}
                className="py-3 px-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i className="fas fa-coins mr-1"></i>
                Claim
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                <i className="fas fa-info-circle mr-1"></i>
                Staking rewards are calculated continuously • 7-day lock period applies • V2 contract security
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isLoading && (
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
            className="fixed bottom-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg z-50"
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