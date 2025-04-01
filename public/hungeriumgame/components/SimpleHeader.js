// This is a simplified version of the Header without framer-motion dependencies
export default function SimpleHeader({ 
  money, 
  popularity, 
  operations, 
  sustainability, 
  daysPassed = 1, 
  coffeeTokens = 0, 
  tokenValue = 1.0,
  tokenTrend = 0,
  shopLevel = 1,
  onClaimReward,
  onOpenMarket,
  onOpenUpgrades
}) {
  const getTrendColor = () => {
    if (tokenTrend > 0) return 'text-green-500';
    if (tokenTrend < 0) return 'text-red-500';
    return 'text-gray-500';
  };
  
  const getTrendIcon = () => {
    if (tokenTrend > 0) return '↑';
    if (tokenTrend < 0) return '↓';
    return '→';
  };
  
  const renderChangeIndicator = (change) => {
    if (change > 0) return <span className="text-green-500 ml-1">↑</span>;
    if (change < 0) return <span className="text-red-500 ml-1">↓</span>;
    return null;
  };

  return (
    <div className="flex flex-col justify-between items-center mb-2 pb-2 border-b border-coffee-medium relative z-10">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold text-amber-700">CoffyLapse</h1>
            <div className="flex items-center">
              <span className="text-xs text-coffee-medium mr-2">Level {shopLevel}</span>
              <span className="text-xs text-coffee-medium">Day {daysPassed}</span>
            </div>
          </div>
          
          {/* Bean rating stars based on shop level */}
          <div className="ml-2 flex">
            {[...Array(shopLevel)].map((_, i) => (
              <span key={i} className="text-amber-500">☕</span>
            ))}
            {[...Array(5 - shopLevel)].map((_, i) => (
              <span key={i + shopLevel} className="text-gray-300">☕</span>
            ))}
          </div>
        </div>
        
        {/* POWERED BY COFFY COIN TEAM text */}
        <div className="text-center">
          <span className="text-xs font-bold text-coffee-dark">
            POWERED BY COFFY COIN TEAM
          </span>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={onOpenUpgrades}
            className="bg-gradient-to-br from-coffee-medium to-coffee-dark text-white text-xs font-medium py-1 px-2 rounded-full flex items-center shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="hidden sm:inline">Upgrades</span>
          </button>
          
          <button
            onClick={onOpenMarket}
            className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xs font-medium py-1 px-2 rounded-full flex items-center shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="hidden sm:inline">Market</span>
          </button>

          <button 
            onClick={onClaimReward}
            className="bg-gradient-to-br from-amber-500 to-amber-700 text-white text-xs font-medium py-1 px-3 rounded-full flex items-center shadow-sm"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 118 0v2m-8 0H5.2A2.2 2.2 0 003 8.2v10.6A2.2 2.2 0 005.2 21h13.6a2.2 2.2 0 002.2-2.2V8.2A2.2 2.2 0 0018.8 6H14" />
            </svg>
            <span>Mint</span>
          </button>
        </div>
      </div>
      
      {/* Token value display */}
      <div className="flex items-center justify-between w-full my-1 pb-1 border-b border-gray-200">
        <div className="flex items-center">
          <span className="bg-yellow-500 text-xs text-white font-bold px-1 py-0.5 rounded mr-1">$COFFEE</span>
          <span className="text-sm font-medium">${tokenValue.toFixed(2)}</span>
          <span className={`ml-1 text-xs ${getTrendColor()}`}>{getTrendIcon()}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-sm font-medium">{coffeeTokens}</span>
          <span className="ml-1 text-yellow-600">☕</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full mt-2">
        <div className="bg-gradient-to-r from-coffee-bg to-white p-1 rounded text-center">
          <div className="flex items-center justify-center text-sm font-medium">
            <span>${money}</span>
          </div>
          <div className="text-xs">Cash</div>
        </div>
        
        <div className="bg-gradient-to-r from-coffee-bg to-white p-1 rounded text-center">
          <div className="flex items-center justify-center text-sm font-medium">
            <span>{popularity}%</span>
          </div>
          <div className="text-xs">Popular</div>
        </div>
        
        <div className="bg-gradient-to-r from-coffee-bg to-white p-1 rounded text-center">
          <div className="flex items-center justify-center text-sm font-medium">
            <span>{operations}%</span>
          </div>
          <div className="text-xs">Ops</div>
        </div>
        
        <div className="bg-gradient-to-r from-coffee-bg to-white p-1 rounded text-center">
          <div className="flex items-center justify-center text-sm font-medium">
            <span>{sustainability}%</span>
          </div>
          <div className="text-xs">Sustain</div>
        </div>
      </div>
    </div>
  );
}
