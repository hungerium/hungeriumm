import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '../utils/animationUtils';
import Header from './Header';
import ScenarioContainer from './ScenarioContainer';
import GameOverContainer from './GameOverContainer';
import SimpleDashboard from './SimpleDashboard';
import TutorialOverlay from './TutorialOverlay';
import ProgressTracker from './ProgressTracker';
import LoadingSpinner from './LoadingSpinner';
import ClaimTokenModal from './ClaimTokenModal';
import useWalletStore from '../store/walletStore';
import useGameStore from '../store/gameStore';
import { characters } from '../data/characters';
import useNotification from '../hooks/useNotification';
import useSwipe from '../hooks/useSwipe';

export default function GameScreen() {
  // Get game state from stores
  const { 
    metrics, currentScenario, daysPassed, gameOver, gameOverReason, 
    shopLevel, experience, answeredScenarios,
    answerQuestion, loadNextScenario, restartGame, completeTutorial, initGame,
    claimCoffyTokens, coffyBalance, showTutorial
  } = useGameStore();
  
  const { 
    address, connected, connecting, tokenBalance, error: walletError,
    connect, disconnect, claimTokens
  } = useWalletStore();

  // Component state
  const [viewportHeight, setViewportHeight] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const containerRef = useRef(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Notification system
  const { showNotification, notificationElements } = useNotification();

  // Handle viewport dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    // Initialize the game
    setTimeout(() => {
      if (answeredScenarios.length === 0) {
        initGame();
      }
      setIsLoading(false);
    }, 800);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update character when scenario changes
  useEffect(() => {
    if (currentScenario && characters) {
      const character = characters.find(c => c.id === currentScenario.characterId);
      setCurrentCharacter(character || null);
    }
  }, [currentScenario]);

  // Add effect to check for pending claims
  useEffect(() => {
    const pendingClaim = localStorage.getItem('coffylapse_pending_claim');
    
    if (pendingClaim === 'true' && connected) {
      // Clear the pending claim flag
      localStorage.removeItem('coffylapse_pending_claim');
      
      // Open claim modal
      setTimeout(() => {
        setShowClaimModal(true);
      }, 1000);
    }
  }, [connected]);

  // Remove debug logging for token balance
  useEffect(() => {
    // No console.log here
  }, [coffyBalance]);

  // Add effect to initialize wallet connection
  useEffect(() => {
    const checkWalletStatus = async () => {
      if (connected) {
        // No console.log here
        return;
      }
      
      // Check if previously connected
      const shouldConnect = localStorage.getItem('coffylapse_wallet_connected') === 'true';
      
      if (shouldConnect) {
        // No console.log here
        try {
          await connect();
        } catch (error) {
          // Silent error handling
        }
      }
    };
    
    // Call the wallet check function
    checkWalletStatus();
  }, []);

  // Handle claim button click
  const handleClaimClick = () => {
    // Convert balance to number and check if we have tokens to claim
    const balance = typeof coffyBalance === 'number' 
      ? coffyBalance 
      : parseFloat(coffyBalance || '0');
    
    // No console.log here
    
    if (balance > 0) {
      localStorage.setItem('coffylapse_pending_claim', 'true');
      setShowClaimModal(true);
    } else {
      showNotification("Complete questions to earn COFFY tokens!", 'info');
    }
  };

  // Handle claiming tokens - improved error handling
  const handleClaimTokens = async (amount) => {
    // No console.log here
    
    try {
      // Parse amount to number
      const claimAmount = parseFloat(amount);
      
      if (isNaN(claimAmount) || claimAmount <= 0) {
        throw new Error("Invalid token amount");
      }
      
      // Connect wallet if needed
      if (!connected) {
        showNotification("Connecting to wallet...", 'info');
        
        try {
          const connectSuccess = await connect();
          
          if (!connectSuccess) {
            throw new Error("Failed to connect wallet");
          }
          
          // Wait a moment for wallet to fully connect before proceeding
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (connError) {
          throw new Error("Wallet connection failed: " + connError.message);
        }
      }
      
      // Now proceed with the transaction
      showNotification("Preparing your transaction...", 'info');
      
      // Additional safeguard to avoid parallel transactions
      localStorage.removeItem('coffylapse_pending_claim');
      localStorage.removeItem('coffylapse_pending_amount');
      
      // Perform the actual transaction
      const result = await claimTokens(claimAmount.toString());
      
      if (result.success) {
        // Only update game state AFTER blockchain success
        const gameUpdateSuccess = claimCoffyTokens(claimAmount);
        
        if (gameUpdateSuccess) {
          showNotification(`${claimAmount} COFFY tokens successfully transferred!`, 'success');
          return result;
        } else {
          showNotification("Blockchain transaction successful but game state update failed.", 'warning');
          return result;
        }
      } else {
        throw new Error(result.error || "Transaction failed");
      }
    } catch (error) {
      // Keep error in console for debugging but make it less verbose
      showNotification(error.message || "Token transfer error", 'error');
      return { success: false, error: error.message || "Unknown error" };
    }
  };

  // Handle scenario choice
  const makeChoice = (choice) => {
    // Determine the impact of this choice
    const impact = currentScenario ? currentScenario[choice] : null;
    
    if (impact) {
      // Skip showing numerical changes and directly update game state
      answerQuestion(choice);
      
      // Flash the dashboard briefly to indicate change
      const dashboardElement = document.querySelector('.dashboard-container');  
      if (dashboardElement) {
        dashboardElement.classList.add('flash-update');
        setTimeout(() => {
          dashboardElement.classList.remove('flash-update');
        }, 700);
      }
    }
  };

  const isMobile = viewportWidth < 640;
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-coffee-darker coffee-dark-texture">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <div className="mt-4 text-coffee-light font-medium">
            Brewing your coffee shop...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col bg-coffee-darker coffee-dark-texture"
    >
      {/* Header with game metrics and COFFY counter */}
      <Header 
        money={metrics.financial}
        popularity={metrics.satisfaction}
        operations={metrics.stock}
        sustainability={metrics.sustainability}
        daysPassed={daysPassed}
        shopLevel={shopLevel}
        experience={experience}
        isMobile={isMobile}
        isWalletConnected={connected}
        walletAddress={address}
        tokenBalance={coffyBalance.toString()}
        onClaimReward={handleClaimClick}
      />
      {/* Show wallet connect button if not connected and tokens are available */}
      {!connected && parseFloat(coffyBalance) > 0 && (
        <div className="mx-auto mt-2 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center text-xs">
          <span className="text-amber-700 mr-2">You have {coffyBalance} COFFY tokens to claim!</span>
          <button 
            onClick={connect}
            className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-0.5 rounded-full text-xs"
          >
            Connect Wallet
          </button>
        </div>
      )}
      
      {/* Main game area - optimized for wider but shorter screens */}
      <main className="flex-grow flex flex-col gap-3 p-2 sm:p-3 overflow-hidden">
        {/* Game over screen */}
        {gameOver ? (
          <GameOverContainer 
            reason={gameOverReason}
            stats={{
              money: metrics.financial,
              popularity: metrics.satisfaction,
              operations: metrics.stock,
              sustainability: metrics.sustainability,
              daysPassed,
              decisionsCount: answeredScenarios.length
            }}
            onRestart={restartGame}
            onClaimReward={handleClaimClick}
            coffyBalance={coffyBalance}
            isMobile={isMobile}
          /> 
        ) : (
          <> 
            {/* Main layout */}
            <div className="flex flex-col gap-3 h-full">
              {/* Progress tracker at the top */}
              <div className="mb-2">
                <ProgressTracker 
                  shopLevel={shopLevel}
                  experience={experience}
                  isMobile={isMobile}
                />
              </div>
              
              {/* Metrics dashboard - now above the scenario */}
              <div className="w-full">
                <SimpleDashboard 
                  money={metrics.financial}
                  popularity={metrics.satisfaction}
                  operations={metrics.stock}
                  sustainability={metrics.sustainability}
                  isMobile={isMobile}
                />
              </div>
              
              {/* Current scenario */}
              <div className="relative flex-grow">
                <ScenarioContainer 
                  character={currentCharacter}
                  scenario={currentScenario}
                  shopLevel={shopLevel}
                  money={metrics.financial}
                  experience={experience}
                  isMobile={isMobile}
                  onChoice={makeChoice}
                />
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Tutorial overlay */}
      {showTutorial && !gameOver && (
        <TutorialOverlay onComplete={completeTutorial} />
      )}
      
      {/* Token claim modal */}
      {showClaimModal && (
        <AnimatePresence>
          <ClaimTokenModal 
            isOpen={showClaimModal}
            onClose={() => setShowClaimModal(false)}
            onClaim={handleClaimTokens}
            balance={coffyBalance.toString()}
            maxClaimable={coffyBalance.toString()}
            isMobile={isMobile}
          />
        </AnimatePresence>
      )}
      
      {/* Notifications */}
      {notificationElements}
    </div>
  );
}
