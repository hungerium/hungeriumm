import { useEffect } from 'react';
import { Web3Provider } from '../components/Web3Provider';
import Layout from '../components/Layout';
import useGameStore from '../store/gameStore';
import { initMobileOptimizations } from '../utils/mobileUtils';
import { initGlobalErrorHandlers } from '../utils/errorHandler';
import { checkCharacterImages } from '../utils/imageDebugger';
import { preloadCharacterImages } from '../utils/preloadAssets';
import { initSounds } from '../utils/soundUtils';
import '../styles/globals.css';
import '../styles/custom.css';

function MyApp({ Component, pageProps }) {
  // Initialize optimizations and error handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize error handlers first
      initGlobalErrorHandlers();
      
      // Initialize mobile optimizations
      initMobileOptimizations();
      
      // Preload character images including SVGs
      preloadCharacterImages().then(() => {
        console.log('Character assets preloaded');
      });
      
      // Check character images in development mode only
      if (process.env.NODE_ENV === 'development') {
        checkCharacterImages().then(results => {
          if (results.missing?.length > 0) {
            console.warn('⚠️ Some character images are missing. Check the console for details.');
          }
        });
      }
    }
  }, []);

  // Fix coffyBalance data type issue
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get gameStore and check coffyBalance type
      const storeState = useGameStore.getState();
      
      // If coffyBalance is not a number, fix it
      if (typeof storeState.coffyBalance !== 'number') {
        const fixedValue = parseFloat(storeState.coffyBalance || '0');
        useGameStore.setState({ coffyBalance: fixedValue });
      }
    }
  }, []);

  // Initialize audio on first interaction
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initialize sound system
    initSounds();
    
    // Setup interaction handler to unlock audio
    const handleUserInteraction = () => {
      // Create and immediately play a silent sound to unlock audio
      try {
        // Try to play a sound to unlock audio context
        const audio = new Audio();
        audio.src = '/sounds/click.mp3';
        audio.volume = 0.01; // Very quiet
        audio.play().catch(err => {
          console.log('Auto-play prevented initially. This is normal.');
          
          // Try with audio context as backup
          try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Make it silent
            gainNode.gain.value = 0.01;
            
            // Connect and start for a brief moment
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            oscillator.stop(0.1);
          } catch (e) {
            console.warn('Could not initialize audio context:', e);
          }
        });
        
        console.log('Audio context initialized');
      } catch (err) {
        console.warn('Failed to initialize audio', err);
      }
      
      // Clean up initial click listener after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    
    // Add interaction listeners for different input types
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    
    return () => {
      // Clean up listeners if component unmounts before interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);
  
  return (
    <Web3Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Web3Provider>
  );
}

export default MyApp;
