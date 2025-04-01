import { useState, useEffect } from 'react';
import { motion } from '../utils/animationUtils';
import TouchFeedback from './TouchFeedback';
import { enablePowerSaving } from '../utils/batteryUtils';
import { formatAddress } from '../utils/walletUtils';
import { toggleSound, toggleBackgroundMusic, isSoundEnabled } from '../utils/soundUtils';

export default function SettingsMenu({ 
  isOpen, 
  onClose,
  walletAddress = null,
  isWalletConnected = false,
  isMobileDevice = false,
  onDisconnectWallet,
  onResetGame,
  onResetTutorial
}) {
  const [powerSavingEnabled, setPowerSavingEnabled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  
  // Load settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPowerSaving = localStorage.getItem('coffylapse_power_saving') === 'true';
      setPowerSavingEnabled(savedPowerSaving);
      
      // Load sound settings
      setSoundEnabled(isSoundEnabled());
      
      // Check if music is currently playing
      const musicState = localStorage.getItem('coffylapse_music_enabled') === 'true';
      setMusicEnabled(musicState);
    }
  }, []);
  
  // Handle power saving toggle
  const handlePowerSavingToggle = () => {
    const newValue = !powerSavingEnabled;
    setPowerSavingEnabled(newValue);
    enablePowerSaving(newValue);
  };
  
  // Handle sound toggle
  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
    
    // If sound is disabled, music should also be disabled
    if (!newState && musicEnabled) {
      toggleBackgroundMusic(false);
      setMusicEnabled(false);
      localStorage.setItem('coffylapse_music_enabled', 'false');
    }
  };
  
  // Handle music toggle
  const handleMusicToggle = () => {
    const newState = !musicEnabled;
    setMusicEnabled(newState);
    
    // If enabling music, make sure sound is enabled too
    if (newState && !soundEnabled) {
      const soundState = toggleSound(true);
      setSoundEnabled(soundState);
    }
    
    toggleBackgroundMusic(newState);
    localStorage.setItem('coffylapse_music_enabled', newState.toString());
  };
  
  // Handle reset confirmation
  const handleConfirmAction = () => {
    if (confirmationType === 'reset-game') {
      onResetGame?.();
    } else if (confirmationType === 'reset-tutorial') {
      onResetTutorial?.();
    } else if (confirmationType === 'disconnect-wallet') {
      onDisconnectWallet?.();
    }
    
    setShowConfirmation(false);
    setConfirmationType(null);
  };
  
  // Request confirmation
  const requestConfirmation = (type) => {
    setConfirmationType(type);
    setShowConfirmation(true);
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-xl w-full max-w-md"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-coffee-dark to-coffee-darker text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Settings</h2>
          <TouchFeedback>
            <button 
              className="rounded-full p-1 hover:bg-black/20"
              onClick={onClose}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </TouchFeedback>
        </div>
        
        {/* Settings Content */}
        <div className="p-5">
          {/* General Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">General</h3>
            
            <div className="space-y-4">
              {/* Power Saving Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Power Saving Mode</p>
                  <p className="text-sm text-gray-500">Reduces animations and effects</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={powerSavingEnabled}
                    onChange={handlePowerSavingToggle}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-coffee-medium"></div>
                </label>
              </div>
              
              {/* Sound Options */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Sound Effects</p>
                  <p className="text-sm text-gray-500">Button clicks and game sounds</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={soundEnabled}
                    onChange={handleSoundToggle}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-coffee-medium"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Background Music</p>
                  <p className="text-sm text-gray-500">Ambient coffee shop sounds</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={musicEnabled}
                    onChange={handleMusicToggle}
                    disabled={!soundEnabled}
                  />
                  <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-coffee-medium ${!soundEnabled ? 'opacity-50' : ''}`}></div>
                </label>
              </div>
              
              {/* Reset Tutorial */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-700">Tutorial</p>
                  <p className="text-sm text-gray-500">Show game instructions again</p>
                </div>
                <TouchFeedback>
                  <button 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-sm"
                    onClick={() => requestConfirmation('reset-tutorial')}
                  >
                    Reset Tutorial
                  </button>
                </TouchFeedback>
              </div>
            </div>
          </div>
          
          {/* Wallet Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Wallet</h3>
            
            {isWalletConnected ? (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-700">Connected Wallet</p>
                  <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {formatAddress(walletAddress || '')}
                  </span>
                </div>
                <TouchFeedback>
                  <button 
                    className="w-full mt-2 bg-red-50 hover:bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium"
                    onClick={() => requestConfirmation('disconnect-wallet')}
                  >
                    Disconnect Wallet
                  </button>
                </TouchFeedback>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-gray-500 mb-2">No wallet connected</p>
                <p className="text-xs text-gray-400 mb-3">Connect a wallet to claim COFFY tokens</p>
              </div>
            )}
          </div>
          
          {/* Game Data Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Game Data</h3>
            
            <div className="space-y-2">
              <TouchFeedback>
                <button 
                  className="w-full bg-red-50 hover:bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium"
                  onClick={() => requestConfirmation('reset-game')}
                >
                  Reset Game Progress
                </button>
              </TouchFeedback>
              
              <p className="text-xs text-gray-500 text-center mt-1">
                This will erase your current game progress
              </p>
            </div>
          </div>
        </div>
        
        {/* Game Version */}
        <div className="bg-gray-50 p-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">CoffyLapse v1.0.0</p>
          <p className="text-xs text-gray-400">Made with ☕ by Coffy Coin Team</p>
        </div>
      </motion.div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-xl w-full max-w-sm"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-5">
              <div className="text-center mb-4">
                <div className="text-2xl mb-2">⚠️</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {confirmationType === 'reset-game' && "Reset Game Progress?"}
                  {confirmationType === 'reset-tutorial' && "Reset Tutorial?"}
                  {confirmationType === 'disconnect-wallet' && "Disconnect Wallet?"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {confirmationType === 'reset-game' && "This will erase all your progress. This action cannot be undone."}
                  {confirmationType === 'reset-tutorial' && "Tutorial instructions will be shown again when you restart the game."}
                  {confirmationType === 'disconnect-wallet' && "You'll need to reconnect your wallet to claim COFFY tokens."}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <TouchFeedback className="flex-1">
                  <button 
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                </TouchFeedback>
                
                <TouchFeedback className="flex-1">
                  <button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
                    onClick={handleConfirmAction}
                  >
                    Confirm
                  </button>
                </TouchFeedback>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
