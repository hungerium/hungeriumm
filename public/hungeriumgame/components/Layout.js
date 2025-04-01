import Head from 'next/head';
import { useEffect, useState } from 'react';
import CharacterPreloader from './CharacterPreloader';

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-coffee-darker coffee-texture">
      <Head>
        <title>CoffyLapse - Coffee Shop Management Game</title>
        <meta name="description" content="Manage your coffee shop, make strategic decisions, and grow your business in this addictive simulation game." />
        <meta name="theme-color" content="#2d1a0f" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Character preloader component */}
      {mounted && <CharacterPreloader />}
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </div>
    </div>
  );
}
