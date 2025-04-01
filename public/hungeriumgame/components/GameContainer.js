import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '../utils/animationUtils';
import Header from './Header';
import SimpleHeader from './SimpleHeader';
import ScenarioContainer from './ScenarioContainer';
import GameOverContainer from './GameOverContainer';
import TutorialOverlay from './TutorialOverlay';
import ConnectWalletOverlay from './ConnectWalletOverlay';
import MetricChangeIndicator from './MetricChangeIndicator';
import ShopBackground from './ShopBackground';
import ClaimTokenModal from './ClaimTokenModal';
import SoundController from './SoundController';
import useNotification from '../hooks/useNotification';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';
import { getCharacterById } from '../utils/characterUtils';
import { initSounds, playSound } from '../utils/soundUtils';

// Check if framer-motion is available
const isFramerMotionAvailable = typeof window !== 'undefined' && 
  typeof AnimatePresence !== 'function' && 
  typeof motion.div === 'function';

export default function GameContainer() {
  // Get game state from Zustand store
  const { 
    metrics, currentScenario, daysPassed, gameOver, gameOverReason, 
    shopLevel, experience, staff, equipmentQuality, customerLoyalty,
    coffyBalance, showTutorial, answeredScenarios,
    answerQuestion, loadNextScenario, restartGame, completeTutorial, initGame
  } = useGameStore();
  
  // Get wallet state from Zustand store
  const { 
    address, connected, connecting, tokenBalance, error: walletError,
    connect, disconnect, claimTokens
  } = useWalletStore();

  // Component state
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const containerRef = useRef(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimableTokens, setClaimableTokens] = useState("5");
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [characterLoading, setCharacterLoading] = useState(true);
  const [recentChanges, setRecentChanges] = useState(null);
  const [animatingChanges, setAnimatingChanges] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const { showNotification, notificationElements } = useNotification();

  useEffect(() => {
    if (!currentScenario) {
      loadNextScenario();
    }
    
    const hasPlayedBefore = localStorage.getItem('coffylapse_played');
    if (hasPlayedBefore) {
      completeTutorial();
    }
    setLibrariesLoaded(true);
  }, []);

  useEffect(() => {
    const updateViewportDimensions = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    
    updateViewportDimensions();
    window.addEventListener('resize', updateViewportDimensions);
    
    const adjustContainerHeight = () => {
      if (containerRef.current) {
        const windowHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const footerHeight = 40; // Estimated footer height
        const idealHeight = windowHeight - containerTop - footerHeight;
        
        containerRef.current.style.height = `${Math.max(550, idealHeight)}px`;
      }
    };
    
    adjustContainerHeight();
    window.addEventListener('resize', adjustContainerHeight);
    
    return () => {
      window.removeEventListener('resize', updateViewportDimensions);
      window.removeEventListener('resize', adjustContainerHeight);
    };
  }, []);

  useEffect(() => {
    if (currentScenario) {
      setCharacterLoading(true);
      const character = getCharacterById(currentScenario.characterId);
      if (character) {
        setCurrentCharacter(character);
      } else {
        console.warn(`Character not found: ${currentScenario.characterId}`);
        setCurrentCharacter({
          id: 'unknown',
          name: 'Coffee Shop Staff',
          image: '/images/placeholder.svg',
          role: 'Staff'
        });
      }
      setCharacterLoading(false);
    }
  }, [currentScenario]);

  useEffect(() => {
    if (gameOver) {
      // Play game over sound when game ends
      playSound('gameOver');
    }
  }, [gameOver]);

  useEffect(() => {
    // Initialize sounds
    initSounds();
    
    // Set up interaction handler to unlock audio
    const unlockAudio = () => {
      // Try to play a sound to ensure audio is working
      playSound('click');
    };
    
    // Add event listeners
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
    
    return () => {
      // Clean up
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const connectWalletHandler = async (skipWallet = false) => {
    if (skipWallet) {
      // Skip wallet connection, just play the game
      showNotification("Starting your coffee shop adventure!", "success");
      setWalletConnected(true);
      initGame();
      
      localStorage.setItem('coffylapse_played', 'true');
      return;
    }
    
    // Try to connect wallet
    const success = await connect();
    
    if (success) {
      showNotification("Wallet connected successfully!", "success");
      setWalletConnected(true);
      initGame();
      
      localStorage.setItem('coffylapse_played', 'true');
    } else {
      showNotification("Failed to connect wallet. Playing without rewards.", "warning");
      setWalletConnected(true);
      initGame();
    }
  };
  
  const handleClaimClick = () => {
    // Calculate claimable tokens based on game progress
    const baseAmount = 5;
    const satisfactionBonus = Math.floor(metrics.satisfaction / 20);
    const levelBonus = shopLevel * 2;
    const calculatedAmount = baseAmount + satisfactionBonus + levelBonus;
    
    setClaimableTokens(calculatedAmount.toString());
    setShowClaimModal(true);
  };
  
  const handleClaimTokens = async (amount) => {
    const result = await claimTokens(amount);
    return result;
  };

  const makeChoice = (choice) => {
    // Play click sound when making a choice
    playSound('click');
    
    const choiceImpact = currentScenario[choice];
    
    // Notify on significant money changes
    if (choiceImpact.money <= -15) {
      showNotification(`Financial setback! -$${-choiceImpact.money}`, 'error');
    } else if (choiceImpact.money >= 15) {
      showNotification(`Financial gain! +$${choiceImpact.money}`, 'success');
    }
    
    // Set changes for animation
    setRecentChanges({
      money: choiceImpact.money,
      popularity: choiceImpact.popularity,
      operations: choiceImpact.operations,
      sustainability: choiceImpact.sustainability,
      staff: choiceImpact.staff || 0,
      equipment: choiceImpact.equipment || 0,
      loyalty: choiceImpact.loyalty || 0
    });
    
    setAnimatingChanges(true);
    
    // Process the answer in the store
    answerQuestion(choice);
    
    // After animation, reset
    setTimeout(() => {
      setAnimatingChanges(false);
      setRecentChanges(null);
    }, 1500);
  };

  const HeaderComponent = librariesLoaded && isFramerMotionAvailable ? Header : SimpleHeader;

  if (!walletConnected) {
    return <ConnectWalletOverlay onConnect={connectWalletHandler} isConnecting={connecting} error={walletError} />;
  }

  const isMobile = viewportWidth < 640;

  return (
    <motion.div 
      ref={containerRef}
      className="w-full max-w-2xl mx-auto bg-gradient-to-b from-white to-coffee-bg rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-coffee-light relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Add sound controller */}
      <SoundController />
      
      {showTutorial && <TutorialOverlay onComplete={completeTutorial} />}
      
      {typeof ShopBackground === 'function' && (
        <ShopBackground 
          popularity={metrics.satisfaction} 
          shopLevel={shopLevel}
        />
      )}
      
      <div className="flex flex-col h-full">
        <HeaderComponent 
          money={metrics.financial}
          popularity={metrics.satisfaction}
          operations={metrics.stock}
          sustainability={metrics.sustainability}
          daysPassed={daysPassed}
          shopLevel={shopLevel}
          staff={staff}
          equipment={equipmentQuality}
          loyalty={customerLoyalty}
          experience={experience}
          isMobile={isMobile}
          isWalletConnected={connected}
          walletAddress={address}
          tokenBalance={tokenBalance}
          onClaimReward={handleClaimClick}
        />
        
        <div className="relative z-10 flex-grow flex justify-center overflow-hidden px-2 sm:px-4">
          <div className="w-full max-w-md flex flex-col">
            <AnimatePresence>
              {animatingChanges && recentChanges && (
                <MetricChangeIndicator key="changes" changes={recentChanges} isMobile={isMobile} />
              )}
            </AnimatePresence>
            
            <div className="flex-grow scrollbar-coffee overflow-y-auto" style={{ 
              maxHeight: isMobile ? 'calc(100% - 20px)' : 'calc(100% - 30px)',
              paddingBottom: isMobile ? '0.5rem' : '1rem'
            }}>
              <AnimatePresence mode="wait">
                {gameOver ? (
                  <GameOverContainer 
                    key="gameover"
                    reason={gameOverReason}
                    stats={{
                      money: metrics.financial,
                      popularity: metrics.satisfaction,
                      operations: metrics.stock,
                      sustainability: metrics.sustainability,
                      daysPassed,
                      shopLevel,
                      decisionsCount: answeredScenarios.length,
                      highestMoney: metrics.financial, // In a real implementation, track high water mark
                      customerServed: Math.round(metrics.satisfaction * daysPassed * 0.5)
                    }}
                    onRestart={restartGame}
                    isMobile={isMobile}
                  />
                ) : (
                  currentScenario && (
                    <ScenarioContainer 
                      key="scenario"
                      character={currentCharacter}
                      scenario={currentScenario}
                      onChoice={makeChoice}
                      shopLevel={shopLevel}
                      money={metrics.financial}
                      isMobile={isMobile}
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-2 sm:p-3 bg-coffee-light/30 backdrop-blur-sm border-t border-coffee-light/50">
          <div className="flex flex-wrap justify-between items-center gap-1 sm:gap-3 text-xs text-coffee-dark">
            <div className="flex items-center">
              <span className="font-semibold mr-1">Staff:</span>
              <span>{staff}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-1">Equipment:</span>
              <span>{equipmentQuality}/10</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-1">Loyalty:</span>
              <span>{customerLoyalty}%</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-1">Next Level:</span>
              <div className="w-16 bg-coffee-light h-1.5 rounded-full ml-1 overflow-hidden">
                <motion.div 
                  className="bg-coffee-medium h-1.5 rounded-full"
                  style={{ width: `${(experience % 20) * 5}%` }}
                  animate={{
                    background: ["hsl(25, 40%, 60%)", "hsl(25, 60%, 50%)", "hsl(25, 40%, 60%)"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {notificationElements}
      
      <ClaimTokenModal 
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onClaim={handleClaimTokens}
        balance={tokenBalance}
        maxClaimable={claimableTokens}
        isMobile={isMobile}
      />
    </motion.div>
  );
}
