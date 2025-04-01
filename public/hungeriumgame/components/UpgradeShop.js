import { motion } from 'framer-motion';
import { useState } from 'react';

const UPGRADES = [
  {
    id: 'better-machines',
    name: 'Better Coffee Machines',
    description: 'Upgrade your equipment to improve operations',
    cost: 10,
    effect: { operations: 10 },
    icon: '⚙️'
  },
  {
    id: 'marketing',
    name: 'Social Media Marketing',
    description: 'Launch a targeted campaign to attract new customers',
    cost: 15,
    effect: { popularity: 15 },
    icon: '📱'
  },
  {
    id: 'eco-friendly',
    name: 'Eco-Friendly Packaging',
    description: 'Switch to sustainable materials for all your needs',
    cost: 12,
    effect: { sustainability: 12 },
    icon: '🌱'
  },
  {
    id: 'staff-training',
    name: 'Barista Training Program',
    description: 'Invest in your staff to improve both operations and popularity',
    cost: 20,
    effect: { operations: 8, popularity: 8 },
    icon: '👨‍🍳'
  }
];

export default function UpgradeShop({ tokens, onPurchase, onClose }) {
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [purchaseAnimation, setPurchaseAnimation] = useState(null);
  
  const handlePurchase = (upgrade) => {
    if (tokens < upgrade.cost) return;
    
    setPurchaseAnimation(upgrade.id);
    setTimeout(() => {
      onPurchase(upgrade);
      setPurchaseAnimation(null);
    }, 800);
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" }
    }
  };

  return (
    <motion.div
      className="absolute inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 max-h-[80vh] overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b">
          <div>
            <h2 className="text-xl font-bold text-coffee-dark">Coffee Shop Upgrades</h2>
            <p className="text-sm text-gray-500">Use your COFFEE tokens to improve your shop</p>
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">☕ {tokens}</span>
            <button 
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {UPGRADES.map(upgrade => {
            const canAfford = tokens >= upgrade.cost;
            const isPurchasing = purchaseAnimation === upgrade.id;
            
            return (
              <motion.div 
                key={upgrade.id}
                className={`border rounded-lg p-3 ${
                  selectedUpgrade?.id === upgrade.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                } ${canAfford ? 'hover:border-indigo-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                onClick={() => canAfford && setSelectedUpgrade(upgrade)}
                variants={itemVariants}
                whileHover={canAfford ? { scale: 1.02 } : {}}
                whileTap={canAfford ? { scale: 0.98 } : {}}
                animate={isPurchasing ? {
                  scale: [1, 1.05, 0],
                  opacity: [1, 1, 0],
                  transition: { duration: 0.8 }
                } : {}}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{upgrade.icon}</span>
                    <div>
                      <h3 className="font-medium text-coffee-dark">{upgrade.name}</h3>
                      <p className="text-sm text-gray-600">{upgrade.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <div className={`text-sm font-medium flex items-center ${canAfford ? 'text-indigo-600' : 'text-gray-400'}`}>
                      <span>☕ {upgrade.cost}</span>
                    </div>
                    
                    <div className="flex flex-wrap mt-1 text-xs">
                      {Object.entries(upgrade.effect).map(([stat, value]) => (
                        <span key={stat} className="bg-green-100 text-green-800 px-1 rounded mr-1 mt-1">
                          {stat.charAt(0).toUpperCase() + stat.slice(1)} +{value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {selectedUpgrade && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-3">
              <h3 className="font-medium">Selected Upgrade</h3>
              <span className="text-indigo-600 font-medium">☕ {selectedUpgrade.cost}</span>
            </div>
            
            <h4 className="font-medium">{selectedUpgrade.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{selectedUpgrade.description}</p>
            
            <div className="flex justify-between">
              <button 
                onClick={() => setSelectedUpgrade(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              
              <motion.button 
                onClick={() => handlePurchase(selectedUpgrade)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={tokens < selectedUpgrade.cost}
              >
                Purchase Upgrade
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
