import { motion } from '../utils/animationUtils';
import { useState, useEffect } from 'react';

export default function TokenMarket({ tokenValue, tokens, cash, trend, marketData = [], onTrade, onClose }) {
  const [tradeAmount, setTradeAmount] = useState(1);
  const [tradeType, setTradeType] = useState('buy');
  const [priceHistory, setPriceHistory] = useState([]);
  const [chartVisible, setChartVisible] = useState(false);
  
  useEffect(() => {
    // Generate simulated price history
    const history = [];
    let baseValue = tokenValue * 0.8;
    for (let i = 0; i < 24; i++) {
      history.push({
        time: `${23-i}h ago`,
        price: baseValue + (Math.random() * tokenValue * 0.4)
      });
    }
    setPriceHistory(history.reverse());
  }, [tokenValue]);
  
  const maxBuy = Math.floor(cash / tokenValue);
  const maxSell = tokens;
  
  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      if (tradeType === 'buy' && value <= maxBuy) {
        setTradeAmount(value);
      } else if (tradeType === 'sell' && value <= maxSell) {
        setTradeAmount(value);
      }
    }
  };
  
  const handleTrade = () => {
    if (tradeType === 'buy' && tradeAmount <= maxBuy) {
      onTrade('buy', tradeAmount);
      setTradeAmount(1); // Reset after trade
    } else if (tradeType === 'sell' && tradeAmount <= maxSell) {
      onTrade('sell', tradeAmount);
      setTradeAmount(1); // Reset after trade
    }
  };
  
  const getTrendColor = () => {
    if (trend > 0) return 'text-green-500';
    if (trend < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  const getTrendIcon = () => {
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };
  
  const chartHeight = 100; // Chart height in pixels
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              CoffeeFi Exchange
            </h2>
            <p className="text-indigo-200 text-sm">Trade $COFFEE tokens</p>
          </div>
          <button 
            onClick={onClose}
            className="bg-indigo-700 hover:bg-indigo-800 rounded-full p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Token price card */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">Current $COFFEE Price</div>
            <div className="text-2xl font-bold flex items-center">
              ${tokenValue.toFixed(2)}
              <span className={`ml-2 ${getTrendColor()}`}>
                {getTrendIcon()}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 text-right">
              <div className="text-xs text-gray-500">Your Balance</div>
              <div className="font-bold">{tokens} <span className="text-yellow-600">☕</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Cash</div>
              <div className="font-bold">${cash.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Price chart toggle */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setChartVisible(!chartVisible)}
          className="w-full p-2 flex items-center justify-center text-sm text-gray-600 hover:bg-gray-50"
        >
          {chartVisible ? 'Hide Price Chart' : 'Show Price Chart'} 
          <svg 
            className={`w-4 h-4 ml-1 transition-transform ${chartVisible ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Price chart */}
      <motion.div 
        className="px-4 pt-2 overflow-hidden"
        initial={{ height: 0 }}
        animate={{ height: chartVisible ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-32 relative">
          <div className="absolute inset-0 flex items-end">
            {priceHistory.map((point, index) => {
              const maxPrice = Math.max(...priceHistory.map(p => p.price));
              const minPrice = Math.min(...priceHistory.map(p => p.price));
              const range = maxPrice - minPrice;
              const heightPercent = ((point.price - minPrice) / range) * 100;
              
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center justify-end"
                >
                  <div 
                    className={`w-full rounded-t ${point.price > tokenValue ? 'bg-green-400' : 'bg-red-400'}`}
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  {index % 4 === 0 && (
                    <div className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-top-left">
                      {point.time}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-xs text-center text-gray-500 mt-6 mb-2">
          Past 24 hours price activity
        </div>
      </motion.div>
      
      {/* Trading interface */}
      <div className="p-4">
        <div className="flex justify-center space-x-2 mb-4">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium 
              ${tradeType === 'buy' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            onClick={() => setTradeType('buy')}
          >
            Buy
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium 
              ${tradeType === 'sell' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
            onClick={() => setTradeType('sell')}
          >
            Sell
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount {tradeType === 'buy' ? 'to buy' : 'to sell'}:
          </label>
          <div className="flex items-center">
            <input
              type="number"
              value={tradeAmount}
              onChange={handleAmountChange}
              min="1"
              max={tradeType === 'buy' ? maxBuy : maxSell}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <span className="ml-2 text-yellow-600">☕</span>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Min: 1</span>
            <span>Max: {tradeType === 'buy' ? maxBuy : maxSell}</span>
          </div>
        </div>
        
        <div className="mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Price per token:</span>
            <span>${tokenValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Total {tradeType === 'buy' ? 'cost' : 'return'}:</span>
            <span className="font-medium">${(tradeAmount * tokenValue).toFixed(2)}</span>
          </div>
        </div>
        
        <button
          className={`w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white 
            ${tradeType === 'buy' 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'} 
            ${(tradeType === 'buy' && tradeAmount > maxBuy) || 
              (tradeType === 'sell' && tradeAmount > maxSell) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''}`}
          onClick={handleTrade}
          disabled={(tradeType === 'buy' && tradeAmount > maxBuy) || 
                   (tradeType === 'sell' && tradeAmount > maxSell)}
        >
          {tradeType === 'buy' ? `Buy ${tradeAmount} $COFFEE` : `Sell ${tradeAmount} $COFFEE`}
        </button>
      </div>
      
      <div className="bg-indigo-50 p-3 text-xs text-center text-indigo-800">
        <p>Market fee: 2% • Trading affects token price • Price updates every 10 seconds</p>
      </div>
    </motion.div>
  );
}
