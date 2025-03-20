'use client';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Staking from './components/Staking';
import Tokenomics from './components/Tokenomics';
import ContractInfo from './components/ContractInfo';
import Community from './components/Community';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import NetworkBanner from './components/NetworkBanner';
import Loading from './components/Loading';
import dynamic from 'next/dynamic';

const Roadmap = dynamic(() => import('./components/Roadmap'));
const Partners = dynamic(() => import('./components/Partners'));
const Whitepaper = dynamic(() => import('./components/Whitepaper'));

export default function Home() {
  return (
    <div className="relative">
      <NetworkBanner />
      <Navbar />
      <Hero />
      <Staking />
      <About />
      <Tokenomics />
      <ContractInfo />
      <Roadmap />
      <Partners />
      <Whitepaper />
      <Community />
      <Footer />
      <ScrollToTop />
    </div>
  );
}