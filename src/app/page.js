'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import GamesSection from './components/GamesSection';
import Staking from './components/Staking';
import NFTMarketplace from './components/NFTMarketplace';
import Tokenomics from './components/Tokenomics';
import ContractInfo from './components/ContractInfo';
import Community from './components/Community';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import NetworkBanner from './components/NetworkBanner';
import Loading from './components/Loading';
import dynamic from 'next/dynamic';
import Migration from './components/Migration';
import CoffeeAnimation from './components/CoffeeAnimation';

// Performans için geç yükleme
const Roadmap = dynamic(() => import('./components/Roadmap'), { ssr: false });
const Partners = dynamic(() => import('./components/Partners'), { ssr: false });
const Whitepaper = dynamic(() => import('./components/Whitepaper'), { ssr: false });

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Sayfa yükleme performans izlemesi
  useEffect(() => {
    // Sayfa yüklendiğinde yükleme ekranını kaldır
    if (document.readyState === 'complete') {
      setTimeout(() => setIsLoading(false), 500);
    } else {
      window.addEventListener('load', () => setTimeout(() => setIsLoading(false), 500));
      return () => window.removeEventListener('load', () => setIsLoading(false));
    }
  }, []);
  
  // Kaydırma animasyonları için gözlemci
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Tüm reveal-on-scroll sınıfına sahip elementleri izle
      document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        observer.observe(element);
      });
      
      return () => observer.disconnect();
    }
  }, [isLoading]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative">
      <NetworkBanner />
      <Navbar />
      <main id="main-content" className="optimize-gpu">
        <Hero />
        <GamesSection />
        <About />
        <Features />
        <Migration />
        <Staking />
        <NFTMarketplace />
        <Tokenomics />
        <ContractInfo />
        <Roadmap />
        <Partners />
        <Whitepaper />
        <Community />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}