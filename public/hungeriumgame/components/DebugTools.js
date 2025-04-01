import { useState } from 'react';
import { addCoffyTokens } from '../utils/addCoffy';
import { tokenSync } from '../store/tokenMiddleware';
import useGameStore from '../store/gameStore';
import { validateAllSvgCharacters } from '../utils/svgDebugger';

export default function DebugTools() {
  const [expanded, setExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});
  
  // Get current balance
  const coffyBalance = useGameStore(state => state.coffyBalance);
  
  const addTokens = () => {
    addCoffyTokens(50);
  };
  
  const resetTokens = () => {
    useGameStore.setState({ coffyBalance: 0 });
  };
  
  const syncTokens = () => {
    tokenSync();
  };
  
  const getDebugInfo = () => {
    const gameState = useGameStore.getState();
    setDebugInfo({
      coffyBalance: gameState.coffyBalance,
      coffyBalanceType: typeof gameState.coffyBalance,
      coffyClaimed: gameState.coffyClaimed,
      daysPassed: gameState.daysPassed,
      shopLevel: gameState.shopLevel
    });
  };
  
  const handleValidateSvgs = async () => {
    const results = await validateAllSvgCharacters();
    alert(`SVG Validation: ${results.valid.length} valid, ${results.invalid.length} invalid`);
  };
  
  if (!expanded) {
    return (
      <button 
        className="fixed bottom-2 right-2 bg-gray-800 text-white px-2 py-1 rounded opacity-30 hover:opacity-100 text-xs z-50"
        onClick={() => setExpanded(true)}
      >
        Debug
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-0 right-0 bg-gray-800 text-white p-2 rounded-tl-lg z-50 text-xs w-48">
      <div className="flex justify-between mb-2">
        <span className="font-bold">Debug Tools</span>
        <button onClick={() => setExpanded(false)}>×</button>
      </div>
      
      <div className="mb-2">
        <div>COFFY: {coffyBalance}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-1 mb-2">
        <button 
          className="bg-green-700 hover:bg-green-600 px-2 py-1 rounded"
          onClick={addTokens}
        >
          +50 COFFY
        </button>
        <button 
          className="bg-red-700 hover:bg-red-600 px-2 py-1 rounded"
          onClick={resetTokens}
        >
          Reset
        </button>
        <button 
          className="bg-blue-700 hover:bg-blue-600 px-2 py-1 rounded"
          onClick={syncTokens}
        >
          Sync
        </button>
        <button 
          className="bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded"
          onClick={getDebugInfo}
        >
          Info
        </button>
      </div>
      
      <div className="mt-2">
        <button 
          onClick={handleValidateSvgs}
          className="w-full bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded"
        >
          Validate SVGs
        </button>
      </div>
      
      {Object.keys(debugInfo).length > 0 && (
        <div className="text-[8px] bg-gray-700 p-1 rounded overflow-auto max-h-32">
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key}>
              <span className="text-gray-400">{key}:</span> {JSON.stringify(value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
