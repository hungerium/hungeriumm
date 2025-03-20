'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export default function Tokenomics() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  const tokenomicsData = [
    { title: "Treasury", percent: "50%", amount: "7.5B COFFY", desc: "Game & Staking Rewards", icon: "trophy" },
    { title: "Liquidity Pool", percent: "20%", amount: "3B COFFY", desc: "Initial DEX Liquidity", icon: "lock" },
    { title: "Marketing", percent: "15%", amount: "2.25B COFFY", desc: "Marketing & Partnerships", icon: "bullhorn" },
    { title: "Team & Dev", percent: "15%", amount: "2.25B COFFY", desc: "Locked & Vested", icon: "users" }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#1A0F0A] to-[#3A2A1E]" id="tokenomics">
      <motion.div style={{ opacity }} className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">
            Tokenomics
          </h2>
          <div className="w-24 h-1 bg-[#D4A017] mx-auto rounded-full"></div>
          <p className="text-xl text-[#E8D5B5] mt-6">
            Total Supply: <span className="text-[#D4A017] font-bold">15,000,000,000 COFFY</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tokenomicsData.map((item, i) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              custom={i}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-[#1A0F0A] p-6 rounded-xl shadow-xl border border-[#D4A017]/20 hover:border-[#D4A017] group transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A017] to-[#A77B06] flex items-center justify-center">
                  <i className={`fas fa-${item.icon} text-white text-2xl group-hover:scale-110 transition-transform duration-300`}></i>
                </div>
                <h3 className="text-2xl font-bold text-[#D4A017]">{item.title}</h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-[#E8D5B5]">{item.percent}</p>
                  <p className="text-[#E8D5B5]">{item.amount}</p>
                  <p className="text-sm text-[#E8D5B5]/80">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}