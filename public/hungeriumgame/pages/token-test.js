import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import Header from '../components/Header';
import ClaimTokenModal from '../components/ClaimTokenModal';

export default function TokenTestPage() {
  const [isClient, setIsClient] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [testLog, setTestLog] = useState([]);
  
  // Get store state directly
  const { coffyBalance, claimCoffyTokens, addTestTokens } = useGameStore();
  
  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
    
    // Add initial log entry
    addLog("Page loaded", {
      coffyBalance,
      coffyBalanceType: typeof coffyBalance
    });
  }, []);
  
  // Helper to add log entries
  const addLog = (action, data) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLog(prev => [
      { timestamp, action, data },
      ...prev
    ]);
  };
  
  // Add test tokens
  const handleAddTokens = () => {
    addTestTokens(50);
    addLog("Added tokens", {
      amount: 50,
      newBalance: useGameStore.getState().coffyBalance
    });
  };
  
  // Reset tokens
  const handleResetTokens = () => {
    useGameStore.setState({ coffyBalance: 0 });
    addLog("Reset tokens", {
      newBalance: 0
    });
  };
  
  // Open claim modal
  const handleClaimClick = () => {
    if (coffyBalance > 0) {
      addLog("Opened claim modal", {
        availableBalance: coffyBalance
      });
      setShowClaimModal(true);
    } else {
      addLog("Attempted to claim with zero balance", {
        availableBalance: coffyBalance
      });
      alert("No tokens to claim!");
    }
  };
  
  // Handle claim tokens
  const handleClaimTokens = async (amount) => {
    addLog("Claiming tokens", {
      amount
    });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = claimCoffyTokens(parseFloat(amount));
      
      if (success) {
        addLog("Claim successful", {
          amount,
          newBalance: useGameStore.getState().coffyBalance,
          newClaimed: useGameStore.getState().coffyClaimed
        });
        
        return {
          success: true,
          txHash: "0x" + Math.random().toString(16).slice(2)
        };
      } else {
        addLog("Claim failed", {
          reason: "claimCoffyTokens returned false"
        });
        
        return {
          success: false,
          error: "Failed to claim tokens"
        };
      }
    } catch (error) {
      addLog("Claim error", {
        error: error.message
      });
      
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Handle direct check of token balance
  const checkTokens = () => {
    const storeState = useGameStore.getState();
    
    addLog("State inspection", {
      coffyBalance: storeState.coffyBalance,
      coffyBalanceType: typeof storeState.coffyBalance,
      coffyClaimed: storeState.coffyClaimed,
      coffyClaimedType: typeof storeState.coffyClaimed
    });
  };
  
  // Show loading state until client-side
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-amber-700">COFFY Token Tester</h1>
        
        <div className="bg-gray-100 p-3 rounded-lg mb-4">
          <h2 className="font-medium mb-2">Current Token Status:</h2>
          <div className="flex justify-between mb-1">
            <span>Balance:</span>
            <span className="font-medium">{coffyBalance} ({typeof coffyBalance})</span>
          </div>
          <div className="flex justify-between">
            <span>Claimed:</span>
            <span className="font-medium">{useGameStore.getState().coffyClaimed} ({typeof useGameStore.getState().coffyClaimed})</span>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden mb-6">
          <h2 className="bg-gray-50 p-2 border-b font-medium">Header Component Test:</h2>
          <div className="block w-full">
            <Header 
              daysPassed={1}
              shopLevel={1}
              tokenBalance={coffyBalance.toString()}
              onClaimReward={handleClaimClick}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            className="bg-green-600 text-white py-2 px-3 rounded-lg"
            onClick={handleAddTokens}
          >
            Add 50 Tokens
          </button>
          
          <button
            className="bg-red-600 text-white py-2 px-3 rounded-lg"
            onClick={handleResetTokens}
          >
            Reset Tokens
          </button>
          
          <button
            className="bg-amber-600 text-white py-2 px-3 rounded-lg"
            onClick={handleClaimClick}
            disabled={coffyBalance <= 0}
          >
            Open Claim Modal
          </button>
          
          <button
            className="bg-blue-600 text-white py-2 px-3 rounded-lg"
            onClick={checkTokens}
          >
            Inspect State
          </button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <h2 className="bg-gray-50 p-2 border-b font-medium">Test Log:</h2>
          <div className="p-2 max-h-60 overflow-y-auto">
            {testLog.length === 0 ? (
              <div className="text-gray-500 text-sm text-center p-4">No actions logged yet</div>
            ) : (
              <ul className="space-y-2">
                {testLog.map((log, index) => (
                  <li key={index} className="text-xs border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-gray-500">{log.timestamp}</span>
                    </div>
                    <pre className="mt-1 bg-gray-50 p-1 rounded overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Claim Modal */}
      {showClaimModal && (
        <ClaimTokenModal 
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onClaim={handleClaimTokens}
          balance={coffyBalance.toString()}
          maxClaimable={coffyBalance.toString()}
        />
      )}
    </div>
  );
}
