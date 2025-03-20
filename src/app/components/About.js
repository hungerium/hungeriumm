'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section className="py-20 bg-[#3A2A1E]/90 relative overflow-hidden" id="about">
      {/* Subtle Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(212,160,23,0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, rgba(212,160,23,0.03) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Modern Header with Subtitle */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-[#D4A017] text-sm uppercase tracking-[0.3em] mb-4 inline-block"
          >
            Discover Our Vision
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]"
          >
            Meet Coffy
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D4A017] to-transparent mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Enhanced Content Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="space-y-6">
              <p className="text-xl text-[#E8D5B5] leading-relaxed font-light">
                Meet Coffy, bridging coffee lovers, gamers, and social enthusiasts through{' '}
                <motion.span
                  whileHover={{ scale: 1.05, color: '#FFD700' }}
                  className="text-[#D4A017] font-medium inline-block"
                >
                  Drink-to-Earn
                </motion.span>,{' '}
                <motion.span
                  whileHover={{ scale: 1.05, color: '#FFD700' }}
                  className="text-[#D4A017] font-medium inline-block"
                >
                  Play-to-Earn
                </motion.span>, and{' '}
                <motion.span
                  whileHover={{ scale: 1.05, color: '#FFD700' }}
                  className="text-[#D4A017] font-medium inline-block"
                >
                  SocialFi
                </motion.span> rewards.
              </p>
            </div>

            {/* Enhanced Feature Grid */}
            <div className="grid grid-cols-2 gap-4">
              {['Drink-to-Earn', 'Play-to-Earn', 'Social Engagement', 'NFT Integration'].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="group bg-[#1A0F0A]/30 p-4 rounded-xl border border-[#D4A017]/10 hover:border-[#D4A017]/30 hover:bg-[#1A0F0A]/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-2 h-2 bg-[#D4A017] rounded-full group-hover:scale-150 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-[#D4A017]/20 rounded-full blur-md group-hover:blur-xl transition-all duration-300" />
                    </div>
                    <p className="text-[#E8D5B5] text-sm font-light group-hover:text-[#D4A017] group-hover:font-normal transition-all duration-300">
                      {feature}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-64 h-64 mx-auto">
              {/* Animated Background Glow */}
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#D4A017]/10 rounded-full blur-3xl"
              />
              
              {/* Main Image with Enhanced Container */}
              <div className="relative w-full h-full p-4">
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/coffy-logo.png" 
                    alt="Coffy Character" 
                    width={256}
                    height={256}
                    className="object-contain drop-shadow-[0_0_25px_rgba(212,160,23,0.3)] animate-float"
                    style={{ width: 'auto', height: 'auto' }}
                    priority
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#D4A017]/0 via-[#D4A017]/10 to-[#D4A017]/0 rounded-full animate-spin-slow" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}