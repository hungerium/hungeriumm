'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const baseScale = useTransform(scrollY, [0, 300], [1, 0.8]); // İlk scale'i baseScale olarak yeniden adlandırdık
  
  // Client-side state for particles
  const [particles, setParticles] = useState([]);
  const [beans, setBeans] = useState([]);

  // İyileştirilmiş parçacık sistemi
  const generateParticles = useCallback(() => {
    return Array.from({ length: 80 }, (_, i) => ({  // Parçacık sayısını artırdık
      id: `particle-${i}`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 30 + 5, // Daha çeşitli boyutlar
      delay: Math.random() * 8, // Daha uzun delay
      duration: Math.random() * 5 + 2, // Daha uzun animasyon
      x: Math.random() * 300 - 150, // Daha geniş x hareketi
      type: Math.random() > 0.7 ? 'steam' : 'bean', // Daha az steam parçacığı
      opacity: Math.random() * 0.5 + 0.1 // Rastgele opaklık
    }));
  }, []);

  useEffect(() => {
    const newParticles = generateParticles();
    setParticles(newParticles);

    // Auto regenerate particles
    const interval = setInterval(() => {
      setParticles(generateParticles());
    }, 10000);

    return () => clearInterval(interval);
  }, [generateParticles]);

  // Parallax efektleri için daha smooth değerler
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const titleY = useTransform(scrollY, [0, 500], [0, 100]);
  const logoY = useTransform(scrollY, [0, 500], [0, -80]);
  const logoRotate = useTransform(scrollY, [0, 500], [0, 15]);
  const contentScale = useTransform(scrollY, [0, 500], [1, 0.9]); // İkinci scale'i contentScale olarak yeniden adlandırdık

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1A0F0A]" id="hero">
      {/* Geliştirilmiş arka plan efektleri */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale: contentScale }} // scale yerine contentScale kullanıyoruz
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#D4A017]/15 via-transparent to-transparent"></div>
        {/* Noise texture'ı kaldırıldı */}
      </motion.div>

      {/* Geliştirilmiş parçacık sistemi */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute ${
              particle.type === 'steam' 
                ? 'bg-gradient-to-t from-[#D4A017]/40 to-transparent' 
                : 'bg-gradient-to-br from-[#D4A017]/50 to-[#A77B06]/30'
            } rounded-full`}
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              bottom: '-20px',
              opacity: particle.opacity
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{
              y: '-180vh',
              opacity: [0, particle.opacity, 0],
              scale: [0, 1, 0],
              x: particle.x,
              rotate: particle.type === 'bean' ? 360 : 0
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Responsive grid yapısı ve animasyonlar */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 1,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            style={{ y }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] via-[#A77B06] to-[#A0522D] leading-tight">
              COFFY COIN
            </h1>
            <p className="text-lg sm:text-xl text-[#E8D5B5] mb-6 sm:mb-8 max-w-xl">
              "Brewing the Future of Coffee with Blockchain! The First{' '}
              <mark className="bg-transparent text-[#D4A017] font-semibold">Drink-to-Earn</mark>,{' '}
              <mark className="bg-transparent text-[#D4A017] font-semibold">Play-to-Earn</mark>, and{' '}
              <mark className="bg-transparent text-[#D4A017] font-semibold">SocialFi</mark> Coin on Binance Smart Chain. Coffy Coin merges DeFi, GameFi, and social engagement into a revolutionary coffee ecosystem!"
            </p>
            


            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-6 w-full sm:w-auto mb-8 sm:mb-12">
              <motion.a
                href="https://pancakeswap.finance/swap?outputCurrency=0x7071271057e4b116e7a650F7011FFE2De7C3d14b"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-[#D4A017] to-[#A77B06] text-white font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-[#D4A017]/50 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center group"
              >
                <span>Trade Now</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.a>
              <motion.a
                href="#tokenomics"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#3A2A1E] hover:bg-[#2C1B12] border-2 border-[#D4A017]/50 hover:border-[#D4A017] text-[#E8D5B5] font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-center backdrop-blur-sm"
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 1,
              type: "spring",
              stiffness: 100,
              damping: 20
            }}
            style={{ y: logoY }}
            className="flex justify-center lg:justify-end order-1 lg:order-2 pt-6 md:pt-0"
          >
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72">
              <motion.div className="absolute inset-0 bg-[#A0522D]/20 rounded-full blur-2xl animate-pulse" />
              <Image 
                src="/images/coffy-logo.png" 
                alt="Coffy Logo" 
                width={256} 
                height={256} 
                className="relative animate-float shadow-[0_0_30px_#D4A017]"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
              <motion.div className="absolute top-0 left-1/2 w-4 h-8 bg-[#D4A017]/50 rounded-r-full animate-steam" initial={{ y: 0 }} animate={{ y: -80, opacity: 0 }} transition={{ duration: 4, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>


      </div>

      {/* Responsive padding ve margin ayarlamaları */}
      <style jsx>{`
        @media (max-width: 640px) {
          section {
            padding-top: 3.5rem;
            padding-bottom: 2.5rem;
            min-height: 95vh;
          }
          h1 {
            font-size: 2rem;
            line-height: 1.1;
            margin-top: 0;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          section {
            padding-top: 5rem;
            padding-bottom: 3.5rem;
          }
          h1 {
            font-size: 2.75rem;
            line-height: 1.1;
          }
        }
      `}</style>
    </section>
  );
}