import { useEffect } from 'react';
import { motion } from '../utils/animationUtils';
import { playSound } from '../utils/soundUtils';

export default function GameOverContainer({ reason, stats, onRestart, onClaimReward, coffyBalance, isMobile = false }) {
  // Play game over sound when component mounts
  useEffect(() => {
    playSound('gameOver');
  }, []);

  // Get the failure reason based on which metric hit zero
  const getFailureReason = () => {
    if (stats.money <= 0) return "CoffyCorp has gone bankrupt! You couldn't manage your finances properly.";
    if (stats.popularity <= 0) return "CoffyCorp has lost all its customers! Your service decisions drove away your patrons.";
    if (stats.operations <= 0) return "CoffyCorp operations have collapsed! Your supply chain management failed.";
    if (stats.sustainability <= 0) return "CoffyCorp's reputation is destroyed! Your environmental practices led to boycotts.";
    return reason || "Game over! Your coffee shop journey has ended.";
  };

  // Use COFFY tokens earned as the final score
  const coffyEarned = (stats.decisionsCount || 0) * 50;

  return (
    <motion.div 
      className="bg-coffee-dark rounded-xl shadow-lg overflow-hidden max-w-md mx-auto text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-3 flex justify-between items-center">
        <h2 className="text-lg font-bold">Game Over</h2>
        {coffyBalance > 0 && (
          <button 
            onClick={onClaimReward}
            className="bg-amber-600 text-white text-xs py-1 px-2 rounded-full flex items-center"
          >
            <span>☕ Claim {coffyBalance}</span>
          </button>
        )}
      </div>
      
      <div className="p-4">
        {/* COFFY Earned Display */}
        <div className="mb-4 bg-amber-900/50 p-3 rounded-lg text-center">
          <div className="text-amber-300 text-xs uppercase font-bold tracking-wide">COFFY Earned</div>
          <div className="text-2xl font-bold text-amber-300 mt-1">☕ {coffyEarned}</div>
        </div>
        
        {/* Game over reason */}
        <div className="mb-4 bg-black/30 p-3 rounded-lg text-sm">
          <p>{getFailureReason()}</p>
        </div>
        
        {/* Stats display */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 p-2 rounded-lg text-center">
            <div className="text-amber-200/80 text-xs">Days Managed</div>
            <div className="font-bold text-lg">{stats.daysPassed}</div>
          </div>
          
          <div className="bg-black/20 p-2 rounded-lg text-center">
            <div className="text-amber-200/80 text-xs">Decisions Made</div>
            <div className="font-bold text-lg">{stats.decisionsCount}</div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col space-y-2">
          {coffyBalance > 0 && (
            <button
              onClick={onClaimReward}
              className="bg-amber-600 hover:bg-amber-700 text-white w-full py-2 rounded"
            >
              Claim {coffyBalance} COFFY Tokens
            </button>
          )}
          
          <button
            onClick={onRestart}
            className="bg-coffee-medium hover:bg-coffee-dark text-white w-full py-2 rounded"
          >
            Start New Game
          </button>
        </div>
      </div>
    </motion.div>
  );
}
