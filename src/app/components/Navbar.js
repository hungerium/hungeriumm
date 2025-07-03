"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, 
  Wallet, 
  Gamepad2, 
  Coins, 
  Store, 
  Info, 
  Menu, 
  X, 
  Shield,
  Clock,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { BrowserProvider, Contract } from "ethers";

const COFFY_CONTRACT_ADDRESS = "0xeA44dc95f799D160B1F75cCBfAb34adF0Ef0F25B";
const COFFY_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "profileId", "type": "string" }
    ],
    "name": "linkUserProfile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Wallet states
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  
  // Verification states
  const [verificationTimestamp, setVerificationTimestamp] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timer management
  useEffect(() => {
    localStorage.removeItem('coffy_human_verification_ts');
    setVerificationTimestamp(null);
  }, []);

  useEffect(() => {
    if (!verificationTimestamp) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = verificationTimestamp + 7 * 24 * 60 * 60 * 1000 - now;
      setTimer(diff > 0 ? diff : 0);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [verificationTimestamp]);

  const formatTimer = (ms) => {
    if (ms <= 0) return null;
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  // Wallet connection
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setIsConnected(true);
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    }
  };

  // Human verification
  const handleHumanVerification = async () => {
    setIsVerifying(true);
    try {
      let address = userAddress;
      if (!isConnected) {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          });
          setIsConnected(true);
          setUserAddress(accounts[0]);
          address = accounts[0];
        }
      }
      // Ethers v6 ile kontrata linkUserProfile çağrısı gönder
      if (window.ethereum && address) {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(COFFY_CONTRACT_ADDRESS, COFFY_ABI, signer);
        const profileId = address.slice(2, 10);
        const tx = await contract.linkUserProfile(profileId);
        await tx.wait();
        console.log("✅ linkUserProfile kontrata gönderildi ve onaylandı");
      }

      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const now = Date.now();
      setVerificationTimestamp(now);
      localStorage.setItem('coffy_human_verification_ts', now.toString());
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNavigation = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Get navbar height dynamically
        const navbar = document.querySelector('nav');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navbarHeight - 8;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (isMobileMenuOpen) {
          setTimeout(() => setIsMobileMenuOpen(false), 300);
        }
      }
    }, 50); // Wait for DOM to be ready
  };

  // Add a separate handler for logo click
  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isMobileMenuOpen) {
      setTimeout(() => setIsMobileMenuOpen(false), 300);
    }
  };

  // Navigation items
  const navItems = [
    { id: 'games', label: 'Games', icon: Gamepad2, subtitle: 'Earn COFFY' },
    { id: 'about', label: 'About Coffy', icon: Info, subtitle: 'Learn More' },
    { id: 'staking', label: 'Staking', icon: Coins, subtitle: 'Earn Rewards' },
    { id: 'coffy-marketplace', label: 'Coffy Marketplace', icon: Store, subtitle: 'Trade Assets' }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-amber-950/95 backdrop-blur-xl shadow-2xl border-b border-amber-800/20' 
          : 'bg-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <motion.div 
            className="flex items-center cursor-pointer" 
            whileHover={{ scale: 1.08, rotate: 2 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
          >
            <Image 
              src="/images/coffy-logo.png" 
              alt="Coffy Logo" 
              width={45} 
              height={45} 
              priority 
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 animate-float shadow-lg" 
            />
            <span className="ml-2 text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#D4A017] to-[#A77B06]">
              COFFY
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            
            {/* Main Navigation */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className="group relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-amber-900/30"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
                  <span className="text-sm font-medium text-amber-100 group-hover:text-white transition-colors duration-300">
                    {item.label}
                  </span>
                  <span className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.subtitle}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              ))}
            </div>

            {/* Human Verification */}
            <div className="relative">
              <motion.button
                onClick={timer > 0 || isVerifying ? undefined : handleHumanVerification}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                disabled={timer > 0 || isVerifying}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  timer > 0 
                    ? 'bg-emerald-900/50 text-emerald-300 cursor-default' 
                    : isVerifying
                    ? 'bg-amber-900/50 text-amber-300 cursor-wait'
                    : 'bg-amber-800/50 text-amber-200 hover:bg-amber-700/50 hover:text-amber-100 hover:scale-105'
                }`}
                whileHover={timer > 0 || isVerifying ? {} : { scale: 1.05 }}
                whileTap={timer > 0 || isVerifying ? {} : { scale: 0.95 }}
              >
                {timer > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                    <span className="text-xs text-amber-200 ml-2">{formatTimer(timer)} left</span>
                  </>
                ) : isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Verifying...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span className="text-sm">Verify Human</span>
                  </>
                )}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute left-1/2 top-full mt-2 -translate-x-1/2 px-4 py-2 rounded-lg bg-amber-950/95 text-amber-100 text-xs shadow-lg border border-amber-800/30 z-50"
                  >
                    {timer > 0 
                      ? `Verification expires in ${formatTimer(timer)}`
                      : 'Verify to prevent bots and earn rewards'
                    }
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-950 border-l border-t border-amber-800/30 rotate-45" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Connection */}
            <motion.button
              onClick={connectWallet}
              className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wallet className="w-5 h-5" />
              <div className="flex flex-col items-start">
                <span className="text-sm leading-none">
                  {isConnected ? `${userAddress?.slice(0, 6)}...` : 'Connect'}
                </span>
                <span className="text-xs opacity-90 leading-none">
                  {isConnected ? 'Wallet' : 'Get Started'}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/20 to-amber-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-amber-300 hover:text-amber-200 transition-colors duration-300 rounded-xl hover:bg-amber-900/30 active:scale-95 touch-manipulation"
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle mobile menu"
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden absolute left-0 right-0 top-full bg-amber-950/98 backdrop-blur-xl border-t border-amber-800/30 shadow-2xl z-40"
            >
              <div className="py-6 px-4 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavigation(item.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left text-amber-200 hover:text-white hover:bg-amber-900/40 rounded-xl transition-all duration-300 active:scale-95 touch-manipulation"
                  >
                    <item.icon className="w-6 h-6 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{item.label}</span>
                      <span className="text-sm text-amber-500">{item.subtitle}</span>
                    </div>
                  </motion.button>
                ))}
                
                <div className="pt-4 border-t border-amber-800/30 space-y-3">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={timer > 0 || isVerifying ? undefined : handleHumanVerification}
                    disabled={timer > 0 || isVerifying}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 touch-manipulation ${
                      timer > 0 
                        ? 'bg-emerald-900/40 text-emerald-300' 
                        : 'bg-amber-800/40 text-amber-200 hover:bg-amber-700/40 active:scale-95'
                    }`}
                  >
                    {timer > 0 ? (
                      <>
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-base">Verified Human</span>
                          <span className="text-sm text-emerald-400">{formatTimer(timer)} left</span>
                        </div>
                      </>
                    ) : isVerifying ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin flex-shrink-0" />
                        <span className="font-medium text-base">Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-medium text-base">Verify Human</span>
                          <span className="text-sm text-amber-500">Anti-Bot Protection</span>
                        </div>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={connectWallet}
                    className="w-full flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all duration-300 active:scale-95 touch-manipulation shadow-lg"
                  >
                    <Wallet className="w-6 h-6 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <span className="text-base">{isConnected ? `${userAddress?.slice(0, 6)}...${userAddress?.slice(-4)}` : 'Connect Wallet'}</span>
                      <span className="text-sm opacity-90">{isConnected ? 'Connected' : 'Get Started'}</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}