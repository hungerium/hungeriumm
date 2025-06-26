'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useWeb3Wallet from './useWeb3Wallet';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState({
    canMigrate: false,
    oldBalance: '0',
    migrationEnabled: false
  });

  const { 
    connectWallet, 
    userAddress, 
    isConnected,
    checkMigrationEligibility,
    migrateTokens,
    isMigrating
  } = useWeb3Wallet();

  // Scroll effect
  useEffect(() => {
    const handleScrollEvent = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  // Migration status check
  useEffect(() => {
    if (isConnected && userAddress) {
      checkMigrationStatus();
    }
  }, [isConnected, userAddress]);

  const checkMigrationStatus = async () => {
    try {
      const status = await checkMigrationEligibility();
      setMigrationStatus(status);
    } catch (error) {
      console.error("Migration status check failed:", error);
    }
  };

  // Migration handler
  const handleMigration = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    try {
      await migrateTokens();
    } catch (error) {
      console.error("Navbar migration trigger failed:", error);
      if (
        (error?.reason && error.reason.includes("Already migrated")) ||
        (error?.message && error.message.includes("Already migrated"))
      ) {
        alert("You have already migrated your tokens.");
      } else {
        alert("Migration failed: " + (error?.reason || error?.message || "Unknown error"));
      }
    }
  };

  // Smooth scroll handler
  const handleScroll = useCallback((e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      if (isMobileMenuOpen) setTimeout(() => setIsMobileMenuOpen(false), 300);
    }
  }, [isMobileMenuOpen]);

  // Scroll progress indicator
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScrollProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((window.scrollY / totalScroll) * 100);
    };
    window.addEventListener('scroll', handleScrollProgress);
    return () => window.removeEventListener('scroll', handleScrollProgress);
  }, []);

  // --- Reusable Modern Navigation Button Component (Reference Style) ---
  const ModernNavButton = ({ href, onClick, icon, title, subtitle, variant = 'default', disabled, tooltip }) => {
    const baseClasses = `relative group text-white font-medium text-sm h-13 w-38 px-4 rounded-full transition-all duration-300 shadow-lg overflow-hidden flex flex-row items-center justify-start whitespace-nowrap ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105'}`;
    
    const variants = {
      about: "bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-700 hover:shadow-cyan-400/50 hover:from-sky-500 hover:to-cyan-600",
      staking: "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-700 hover:shadow-emerald-400/50 hover:from-emerald-500 hover:to-green-600",
      nft: "bg-gradient-to-r from-violet-600 via-violet-500 to-purple-700 hover:shadow-violet-400/50 hover:from-violet-500 hover:to-purple-600",
      games: "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-700 hover:shadow-amber-400/50 hover:from-amber-400 hover:to-orange-600",
      migrate: "bg-gradient-to-r from-pink-600 via-rose-500 to-rose-700 hover:shadow-pink-400/50 hover:from-pink-500 hover:to-rose-600",
      wallet: "bg-gradient-to-r from-[#D4A017] via-[#FFD700] to-[#A77B06] hover:shadow-[#FFD700]/60 hover:from-[#FFD700] hover:to-[#D4A017]"
    };

    const hoverOverlays = {
      about: "from-sky-300/30 to-cyan-500/30",
      staking: "from-emerald-300/30 to-green-500/30",
      nft: "from-violet-300/30 to-purple-500/30",
      games: "from-amber-300/30 to-orange-500/30",
      migrate: "from-pink-300/30 to-rose-500/30",
      wallet: "from-[#FFD700]/40 to-[#FFA500]/40"
    };

    const Component = href ? motion.a : motion.button;

    return (
      <Component
        href={href}
        onClick={disabled ? undefined : (onClick || (href ? (e) => handleScroll(e, href.replace('#', '')) : null))}
        className={`${baseClasses} ${variants[variant]}`}
        style={{ height: '3.25rem', width: '9.5rem' }}
        whileHover={disabled ? {} : { 
          scale: 1.05, 
          y: -2,
          transition: { type: "spring", stiffness: 400, damping: 17 }
        }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        title={tooltip || ''}
        disabled={disabled}
      >
        {icon && <i className={`${icon} text-sm mr-2.5 relative z-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}></i>}
        <div className="flex flex-col items-start justify-center relative z-10 min-w-0">
          {variant === 'migrate' ? (
            <>
              <span className="text-xs font-semibold leading-tight truncate group-hover:text-white transition-colors duration-300">Migrate Old Tokens</span>
              <span className="text-[10px] font-medium opacity-90 leading-tight group-hover:opacity-100 transition-opacity duration-300">V1 → V2</span>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold leading-tight truncate group-hover:text-white transition-colors duration-300">{title}</span>
              {subtitle && <span className="text-[10px] font-medium opacity-85 leading-tight truncate group-hover:opacity-95 transition-opacity duration-300">{subtitle}</span>}
            </>
          )}
        </div>
        <div className={`absolute inset-0 bg-gradient-to-r ${hoverOverlays[variant]} opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full`}></div>
        <div className={`absolute -inset-1 bg-gradient-to-r ${variants[variant]} blur-md opacity-0 group-hover:opacity-40 transition-all duration-500 rounded-full animate-pulse`}></div>
        <div className={`absolute inset-0 bg-gradient-to-r ${hoverOverlays[variant]} opacity-0 group-hover:opacity-20 transition-all duration-700 rounded-full animate-ping`}></div>
      </Component>
    );
  };

  // Nav animation variants
  const navAnimations = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } },
  };

  return (
    <motion.nav
      variants={navAnimations}
      initial="hidden"
      animate="visible"
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1A0F0A]/95 backdrop-blur-lg shadow-xl py-2' : 'bg-transparent py-3'}`}
    >
      <motion.div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#D4A017] via-[#A77B06] to-[#D4A017]" style={{ width: `${scrollProgress}%` }} />
      
      <div className="container mx-auto px-4 lg:px-6 max-w-screen-xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div className="flex items-center cursor-pointer" whileHover={{ scale: 1.05 }} onClick={(e) => handleScroll(e, 'hero')}>
            <Image src="/images/coffy-logo.png" alt="Coffy Logo" width={45} height={45} priority className="rounded-full" />
            <span className="ml-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">COFFY</span>
          </motion.div>

          {/* Desktop Navigation - Cüzdan Sağda, Diğerleri Merkez */}
          <div className="hidden lg:flex flex-row items-center flex-1">
            <div className="flex items-center justify-center gap-6 flex-1">
              <ModernNavButton 
                onClick={handleMigration} 
                subtitle="V1 → V2" 
                title="Migrate Old Tokens" 
                variant="migrate" 
                icon={isMigrating ? 'fas fa-spinner fa-spin' : 'fas fa-exchange-alt'} 
              />
              <ModernNavButton href="#games" subtitle="Play to Earn" title="Coffy Games" variant="games" icon="fas fa-gamepad" />
              <ModernNavButton href="#about" subtitle="Learn More" title="About Coffy" variant="about" icon="fas fa-info-circle" />
              <ModernNavButton href="#staking" subtitle="Earn Rewards" title="Staking" variant="staking" icon="fas fa-coins" />
              <ModernNavButton href="#nft-marketplace" subtitle="Trade Assets" title="NFT Marketplace" variant="nft" icon="fas fa-store" />
            </div>
            <div className="ml-6">
              <ModernNavButton onClick={connectWallet} subtitle={isConnected ? "Connected" : "Get Started"} title={isConnected ? `${userAddress?.slice(0, 6)}...` : 'Wallet'} variant="wallet" icon="fas fa-wallet" />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#E8D5B5] focus:outline-none p-2">
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#1A0F0A]/95 backdrop-blur-lg border-t border-[#D4A017]/20"
          >
            <div className="flex flex-col gap-4 p-5">
              <ModernNavButton 
                onClick={handleMigration} 
                subtitle="V1 → V2" 
                title="Migrate Old Tokens" 
                variant="migrate" 
                icon={isMigrating ? 'fas fa-spinner fa-spin' : 'fas fa-exchange-alt'} 
              />
              <ModernNavButton href="#games" subtitle="Play to Earn" title="Coffy Games" variant="games" icon="fas fa-gamepad" />
              <ModernNavButton href="#about" subtitle="Learn More" title="About Coffy" variant="about" icon="fas fa-info-circle" />
              <ModernNavButton href="#staking" subtitle="Earn Rewards" title="Staking" variant="staking" icon="fas fa-coins" />
              <ModernNavButton href="#nft-marketplace" subtitle="Trade Assets" title="NFT Marketplace" variant="nft" icon="fas fa-store" />
              <ModernNavButton onClick={connectWallet} subtitle={isConnected ? "Connected" : "Get Started"} title={isConnected ? `${userAddress?.slice(0, 6)}...` : 'Wallet'} variant="wallet" icon="fas fa-wallet" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
