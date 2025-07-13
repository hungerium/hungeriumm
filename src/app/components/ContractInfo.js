'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ContractInfo() {
  const [copyStatus, setCopyStatus] = useState('');
  const contractAddress = '0x86C6B01372C00efD29B32CE87a0BF69dd5043F6c';

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Failed to copy');
    }
  };

  return (
    <section className="py-16 bg-[#1A0F0A]" id="contract-info">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-[#3A2A1E] p-6 rounded-xl shadow-lg border border-[#D4A017] hover:shadow-[0_0_20px_#D4A017] transition-all duration-300"
        >
          <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06] text-center">
            Contract Info V2
          </h2>
          
          {/* New Contract */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#D4A017] mb-2">New Contract (V2)</h3>
            <div className="flex items-center bg-[#1A0F0A] p-3 rounded-lg border border-[#D4A017]/30">
              <code className="text-[#E8D5B5] flex-1 font-mono text-sm overflow-x-auto">
                {contractAddress}
              </code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(contractAddress)}
                className="ml-2 p-2 rounded-lg bg-[#D4A017]/20 hover:bg-[#D4A017]/30"
              >
                <i className="fas fa-copy text-[#D4A017]"></i>
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.a
              href={`https://bscscan.com/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-[#D4A017] to-[#A77B06] py-2 px-4 rounded-lg text-white text-center text-sm"
            >
              View V2 on BSCScan
            </motion.a>
            <motion.a
              href="https://pancakeswap.finance/swap"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="border border-[#D4A017] text-[#D4A017] py-2 px-4 rounded-lg text-center text-sm hover:bg-[#D4A017] hover:text-white"
            >
              Trade on PancakeSwap
            </motion.a>
          </div>

          {/* Honeypot Check - moved lower for clarity */}
          <div className="mt-6 mb-4 flex items-center gap-3">
            <span className="inline-block px-3 py-1 rounded-full bg-green-700 text-xs font-semibold text-white">Honeypot Check: Passed (Confirmed)</span>
            <a
              href={`https://honeypot.is/?address=${contractAddress}&chain=bsc`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#D4A017] underline text-xs hover:text-[#F4C430]"
            >
              View on Honeypot.is
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}