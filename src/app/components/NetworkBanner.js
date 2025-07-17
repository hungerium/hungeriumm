'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkBanner() {
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (window.ethereum) {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setWrongNetwork(chainId !== '0x2105'); // Base chainId
      }
    };

    checkNetwork();
    window.ethereum?.on('chainChanged', checkNetwork);

    return () => {
      window.ethereum?.removeListener('chainChanged', checkNetwork);
    };
  }, []);

  const switchToBase = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {wrongNetwork && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 bg-[#1e90ff] text-white py-2 px-4 text-center z-50"
        >
          <p className="inline-block mr-4">Please switch to Base Network</p>
          <button
            onClick={switchToBase}
            className="bg-white text-[#1e90ff] px-4 py-1 rounded-full text-sm hover:bg-opacity-90"
          >
            Switch to Base
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
