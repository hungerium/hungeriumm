'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import useWeb3Wallet from './useWeb3Wallet';

console.log('Ethers library loaded in Staking:', typeof ethers !== 'undefined');

export default function Staking() {
  const [stakeAmount, setStakeAmount] = useState('');
  const [status, setStatus] = useState('Please connect your wallet to stake');
  const [walletBalance, setWalletBalance] = useState('0 COFFY');
  const [stakedBalance, setStakedBalance] = useState('0 COFFY');
  const [rewards, setRewards] = useState('0 COFFY');
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
      console.log('Stake Info:', stakeInfo);
      setWalletBalance(`${ethers.formatUnits(balance, 18)} COFFY`);
      setStakedBalance(`${ethers.formatUnits(stakeInfo.stakedAmount, 18)} COFFY`);
      setRewards(`${ethers.formatUnits(stakeInfo.pendingReward, 18)} COFFY`);
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

  return (
    <section className="py-16 bg-[#1A0F0A] relative overflow-hidden" id="staking">
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F0A]/50 via-transparent to-[#1A0F0A]/50"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">
            Stake COFFY
          </h2>
          <div className="w-20 h-1 bg-[#D4A017] mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto bg-[#3A2A1E] p-6 rounded-xl shadow-lg border border-[#D4A017]"
        >
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: "Balance", value: walletBalance },
              { label: "Staked", value: stakedBalance },
              { label: "Rewards", value: rewards },
              { label: "APR", value: "7%" }
            ].map((stat) => (
              <div key={stat.label} className="bg-[#1A0F0A] p-3 rounded-lg">
                <p className="text-[#D4A017] text-xs">{stat.label}</p>
                <p className="text-[#E8D5B5] font-bold text-sm">{stat.value}</p>
              </div>
            ))}
          </div>

          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Amount to stake"
            className="w-full p-3 mb-4 rounded-lg bg-[#1A0F0A] text-[#E8D5B5] border border-[#D4A017]/30"
          />

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={stakeTokens}
              className="py-2 px-4 rounded-lg bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white"
            >
              Stake
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={unstakeTokens}
              className="py-2 px-4 rounded-lg border border-[#D4A017] text-[#D4A017]"
            >
              Unstake
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={claimRewards}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-white"
          >
            Claim Rewards
          </motion.button>
        </motion.div>
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