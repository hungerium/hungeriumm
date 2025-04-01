import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';

export default function TokenAnalysisPage() {
  const [isClient, setIsClient] = useState(false);
  const gameStore = useGameStore();
  const walletStore = useWalletStore();
  
  // Analysis data state
  const [gameData, setGameData] = useState({});
  const [walletData, setWalletData] = useState({});
  const [activityLog, setActivityLog] = useState([]);
  
  useEffect(() => {
    setIsClient(true);
    
    // Collect game store data
    setGameData({
      coffyBalance: gameStore.coffyBalance,
      coffyBalanceType: typeof gameStore.coffyBalance,
      coffyClaimed: gameStore.coffyClaimed,
      daysPassed: gameStore.daysPassed,
      shopLevel: gameStore.shopLevel,
      answerCount: gameStore.answeredScenarios?.length || 0,
    });
    
    // Collect wallet store data
    setWalletData({
      connected: walletStore.connected,
      address: walletStore.address,
      tokenBalance: walletStore.tokenBalance,
      tokenBalanceType: typeof walletStore.tokenBalance,
    });
    
    // Add timestamp to activity log
    setActivityLog(prev => [
      { 
        time: new Date().toLocaleTimeString(),
        event: "Page Loaded",
        coffyBalance: gameStore.coffyBalance,
        tokenBalance: walletStore.tokenBalance
      },
      ...prev
    ]);
  }, []);
  
  // Record activity on store changes
  useEffect(() => {
    if (!isClient) return;
    
    const gameUnsubscribe = useGameStore.subscribe(
      state => state.coffyBalance,
      (coffyBalance) => {
        setActivityLog(prev => [
          {
            time: new Date().toLocaleTimeString(),
            event: "Game Balance Changed",
            coffyBalance: coffyBalance
          },
          ...prev
        ]);
        
        setGameData(prev => ({
          ...prev,
          coffyBalance: coffyBalance,
          coffyBalanceType: typeof coffyBalance
        }));
      }
    );
    
    const walletUnsubscribe = useWalletStore.subscribe(
      state => state.tokenBalance,
      (tokenBalance) => {
        setActivityLog(prev => [
          {
            time: new Date().toLocaleTimeString(),
            event: "Wallet Balance Changed",
            tokenBalance: tokenBalance
          },
          ...prev
        ]);
        
        setWalletData(prev => ({
          ...prev,
          tokenBalance: tokenBalance,
          tokenBalanceType: typeof tokenBalance
        }));
      }
    );
    
    return () => {
      gameUnsubscribe();
      walletUnsubscribe();
    };
  }, [isClient]);
  
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">COFFY Token Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-3">Game Store Data</h2>
            <div className="space-y-2">
              {Object.entries(gameData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className="font-mono">{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-3">Wallet Store Data</h2>
            <div className="space-y-2">
              {Object.entries(walletData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span className="font-mono">{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-3">Activity Log</h2>
          <div className="space-y-2 max-h-96 overflow-auto">
            {activityLog.map((entry, index) => (
              <div key={index} className="text-sm border-b border-gray-100 pb-1">
                <span className="font-mono text-gray-500">{entry.time}</span>
                <span className="mx-2">|</span>
                <span className="font-medium">{entry.event}</span>
                {entry.coffyBalance !== undefined && (
                  <span className="ml-2 text-amber-600">
                    COFFY: {entry.coffyBalance}
                  </span>
                )}
                {entry.tokenBalance !== undefined && (
                  <span className="ml-2 text-blue-600">
                    Wallet: {entry.tokenBalance}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => {
              // Add 50 tokens
              const current = gameStore.coffyBalance || 0;
              useGameStore.setState({ coffyBalance: current + 50 });
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Add 50 COFFY
          </button>
          
          <button
            onClick={() => {
              // Reset tokens
              useGameStore.setState({ coffyBalance: 0 });
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Reset COFFY
          </button>
          
          <button
            onClick={() => {
              window.location.href = '/debug-claim';
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Debug Claim
          </button>
        </div>
      </div>
    </div>
  );
}
