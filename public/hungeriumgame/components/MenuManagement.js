import { useState } from 'react';
import { motion } from '../utils/animationUtils';

const COFFEE_ITEMS = [
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Pure coffee intensity in a small cup',
    cost: 0.50,
    price: 2.50,
    popularity: 6,
    sustainability: 8,
    image: '/images/menu/espresso.svg'
  },
  {
    id: 'latte',
    name: 'Latte',
    description: 'Espresso with steamed milk and light foam',
    cost: 1.00,
    price: 4.00,
    popularity: 9,
    sustainability: 6,
    image: '/images/menu/latte.svg'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Equal parts espresso, steamed milk, and foam',
    cost: 1.00,
    price: 3.75,
    popularity: 8,
    sustainability: 6,
    image: '/images/menu/cappuccino.svg'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Espresso with chocolate and steamed milk',
    cost: 1.25,
    price: 4.50,
    popularity: 9,
    sustainability: 5,
    image: '/images/menu/mocha.svg'
  }
];

const FOOD_ITEMS = [
  {
    id: 'croissant',
    name: 'Croissant',
    description: 'Buttery, flaky pastry',
    cost: 1.00,
    price: 3.00,
    popularity: 7,
    sustainability: 5,
    image: '/images/menu/croissant.svg'
  },
  {
    id: 'muffin',
    name: 'Blueberry Muffin',
    description: 'Sweet muffin filled with blueberries',
    cost: 1.20,
    price: 3.25,
    popularity: 6,
    sustainability: 5,
    image: '/images/menu/muffin.svg'
  }
];

export default function MenuManagement({ 
  activeMenu = [], 
  money,
  onUpdateMenu,
  onClose
}) {
  const [selectedCategory, setSelectedCategory] = useState('coffee');
  const [activeItems, setActiveItems] = useState(
    activeMenu.length ? activeMenu : COFFEE_ITEMS.slice(0, 2).map(i => i.id)
  );
  const [priceAdjustments, setPriceAdjustments] = useState({});
  
  const getItemsForCategory = () => {
    return selectedCategory === 'coffee' ? COFFEE_ITEMS : FOOD_ITEMS;
  };
  
  const toggleItemActive = (itemId) => {
    if (activeItems.includes(itemId)) {
      setActiveItems(prev => prev.filter(id => id !== itemId));
    } else {
      setActiveItems(prev => [...prev, itemId]);
    }
  };
  
  const adjustPrice = (itemId, adjustment) => {
    setPriceAdjustments(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + adjustment
    }));
  };
  
  const getEffectivePrice = (item) => {
    const basePrice = item.price;
    const adjustment = priceAdjustments[item.id] || 0;
    return Math.max(item.cost, basePrice + adjustment).toFixed(2);
  };
  
  const getMargin = (item) => {
    const effectivePrice = parseFloat(getEffectivePrice(item));
    return ((effectivePrice - item.cost) / effectivePrice * 100).toFixed(0);
  };
  
  const getPopularityImpact = (item) => {
    const adjustment = priceAdjustments[item.id] || 0;
    // Higher prices reduce popularity
    if (adjustment > 0.5) return -3;
    if (adjustment > 0) return -1;
    // Lower prices increase popularity
    if (adjustment < -0.5) return 3;
    if (adjustment < 0) return 1;
    return 0;
  };
  
  const saveMenu = () => {
    const selectedItems = [];
    
    // Combine coffee and food items
    [...COFFEE_ITEMS, ...FOOD_ITEMS].forEach(item => {
      if (activeItems.includes(item.id)) {
        const effectivePrice = parseFloat(getEffectivePrice(item));
        const popularityImpact = getPopularityImpact(item);
        
        selectedItems.push({
          ...item,
          effectivePrice,
          popularityImpact,
          adjustedPopularity: Math.max(1, item.popularity + popularityImpact)
        });
      }
    });
    
    onUpdateMenu(selectedItems);
    onClose();
  };
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-gradient-to-r from-coffee-dark to-coffee-darker text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Menu Management</h2>
            <p className="text-sm text-coffee-light">Select items and set prices</p>
          </div>
          <button
            onClick={onClose}
            className="bg-coffee-darker hover:bg-black rounded-full p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium ${selectedCategory === 'coffee' ? 'border-b-2 border-coffee-medium text-coffee-dark' : 'text-gray-500'}`}
            onClick={() => setSelectedCategory('coffee')}
          >
            Coffee Drinks
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${selectedCategory === 'food' ? 'border-b-2 border-coffee-medium text-coffee-dark' : 'text-gray-500'}`}
            onClick={() => setSelectedCategory('food')}
          >
            Food Items
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-4">
          {getItemsForCategory().map(item => {
            const isActive = activeItems.includes(item.id);
            const popularityImpact = getPopularityImpact(item);
            
            return (
              <div 
                key={item.id}
                className={`border rounded-lg p-3 transition-colors ${isActive ? 'border-coffee-medium' : 'border-gray-200 opacity-60'}`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 text-2xl">☕</div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={() => toggleItemActive(item.id)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-coffee-medium peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
                
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Cost: ${item.cost.toFixed(2)}</p>
                        <p className="text-sm font-medium">Price: ${getEffectivePrice(item)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <motion.button
                          onClick={() => adjustPrice(item.id, -0.25)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        
                        <motion.button
                          onClick={() => adjustPrice(item.id, 0.25)}
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-gray-700"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span>Margin: {getMargin(item)}%</span>
                      <span className={`${popularityImpact > 0 ? 'text-green-600' : popularityImpact < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        Popularity: {popularityImpact > 0 ? '+' : ''}{popularityImpact}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Active Items: {activeItems.length}/10</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            Cancel
          </button>
          
          <motion.button
            onClick={saveMenu}
            className="px-3 py-1 bg-coffee-dark text-white rounded text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Menu
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
