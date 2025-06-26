'use client';

import { motion } from 'framer-motion';

export default function Roadmap() {
  const roadmapData = [
    {
      quarter: "Q1 2025 - V2 Launch & Migration",
      status: "✅ COMPLETED",
      items: [
        "V2 smart contract deployment & security audit",
        "Migration system launch (1:1 token transfer)",
        "Staking system (10% APR) & Game rewards (5K daily)",
        "NFT Marketplace & Character system (13 characters)",
        "DEX listing with anti-sybil protection"
      ]
    },
    {
      quarter: "Q2 2025 - SocialFi & Partnerships",
      status: "🔄 IN PROGRESS",
      items: [
        "DAO governance implementation (Character price voting)",
        "SocialFi platform development (Coffee community)",
        "Coffee shop partnerships (Real-world integration)",
        "Gaming studio collaborations (P2E partnerships)",
        "Major DEX listings & liquidity expansion"
      ]
    },
    {
      quarter: "Q3 2025 - Ecosystem Expansion",
      status: "📅 PLANNED",
      items: [
        "Character-to-NFT migration (Limited editions)",
        "Cross-chain bridge development (Polygon, Base)",
        "International marketing campaigns",
        "Strategic gaming partnerships (Major P2E projects)",
        "Advanced DAO governance features"
      ]
    },
    {
      quarter: "Q4 2025 - Global Scale",
      status: "📅 FUTURE",
      items: [
        "Full DAO transition (Complete decentralization)",
        "Metaverse integration (Coffyverse expansion)",
        "Major CEX listings (Binance, Coinbase)",
        "Global coffee industry partnerships",
        "Mobile app & cross-chain gaming ecosystem"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#3A2A1E] to-[#1A0F0A] relative overflow-hidden" id="roadmap">
      {/* Arkaplan efektleri */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, #D4A017 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, #D4A017 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, #D4A017 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">Roadmap</h2>
          <div className="w-24 h-1 bg-[#D4A017] mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {roadmapData.map((phase, index) => (
            <motion.div
              key={phase.quarter}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-8 mb-16 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Quarter Circle */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#D4A017] to-[#A77B06] flex items-center justify-center shadow-lg"
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">{phase.quarter.split(' ')[0]}</div>
                  <div className="text-3xl font-bold">{phase.quarter.split(' ')[1]}</div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#2C1B12] p-6 rounded-xl border border-[#D4A017]/20 hover:border-[#D4A017] transition-all duration-300"
                >
                  <h3 className="text-2xl font-bold text-[#D4A017] mb-4">
                    {phase.quarter}
                  </h3>
                  <p className="text-sm text-[#E8D5B5] mb-4">{phase.status}</p>
                  <ul className="space-y-3">
                    {phase.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: itemIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-[#E8D5B5]"
                      >
                        <span className="w-2 h-2 bg-[#D4A017] rounded-full mr-3"></span>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}