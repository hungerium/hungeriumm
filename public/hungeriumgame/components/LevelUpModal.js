import { motion } from '../utils/animationUtils';
import TouchFeedback from './TouchFeedback';

export default function LevelUpModal({ level, rewards, newFeatures = [], onClose }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-xl max-w-sm w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          transition: { type: 'spring', damping: 20 }
        }}
      >
        <motion.div 
          className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-5 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="text-3xl mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: 1
            }}
            transition={{ 
              delay: 0.4,
              duration: 0.7
            }}
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold">Level Up!</h2>
          <p className="text-amber-200">Your coffee shop is now level {level}</p>
        </motion.div>
        
        <div className="p-5">
          {/* Level benefits */}
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-bold text-gray-800 mb-2">Level {level} Benefits:</h3>
            <ul className="space-y-2">
              {rewards.map((reward, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1) }}
                >
                  <span className="text-green-500 mr-2 pt-0.5">✓</span>
                  <span>{reward}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Token reward */}
          <motion.div 
            className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-amber-800 font-medium mb-1">Level Up Bonus</div>
            <div className="flex items-center justify-center">
              <span className="text-amber-500 text-xl mr-2">☕</span>
              <span className="text-2xl font-bold text-amber-700">+200 COFFY</span>
            </div>
          </motion.div>
          
          {/* New features (if any) */}
          {newFeatures.length > 0 && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="font-bold text-gray-800 mb-2">New Features Unlocked:</h3>
              <ul className="space-y-2">
                {newFeatures.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4 + (index * 0.1) }}
                  >
                    <span className="text-blue-500 mr-2">🔓</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
        
        <motion.div
          className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <TouchFeedback>
            <button 
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
              onClick={onClose}
            >
              Continue
            </button>
          </TouchFeedback>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
