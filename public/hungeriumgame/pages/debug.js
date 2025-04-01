import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';
import Header from '../components/Header';
import ClaimTokenModal from '../components/ClaimTokenModal';

export default function DebugPage() {
  const [isClient, setIsClient] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  
  // Game store state
  const { 
    coffyBalance, 
    coffyClaimed, 
    claimCoffyTokens, 
    daysPassed,
    shopLevel
  } = useGameStore();
  
  // Wallet store state
  const { 
    address, 
    connected, 
    connecting, 
    tokenBalance, 
    connect, 
    disconnect, 
    claimTokens 
  } = useWalletStore();
  
  // Check if we're client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Add tokens for testing
  const addTokens = () => {
    const newBalance = parseFloat(coffyBalance || 0) + 50;
    useGameStore.setState({ coffyBalance: newBalance });
    console.log("Added 50 tokens, new balance:", newBalance);
  };
  
  // Reset tokens for testing
  const resetTokens = () => {
    useGameStore.setState({ coffyBalance: 0 });
    console.log("Reset token balance to 0");
  };
  
  // Handle claim button click
  const handleClaimClick = () => {
    console.log("Opening claim modal with balance:", coffyBalance);
    setShowClaimModal(true);
  };
  
  // Handle claiming tokens
  const handleClaimTokens = async (amount) => {
    console.log("Attempting to claim tokens:", amount);
    
    if (connected) {
      try {
        const result = await claimTokens(amount);
        console.log("Claim result:", result);
        
        if (result.success) {
          // Update game state
          claimCoffyTokens(parseFloat(amount));
          return result;
        }
        return result;
      } catch (error) {
        console.error("Error claiming tokens:", error);
        return { success: false, error: error.message };
      }
    } else {
      // Try to connect wallet first
      console.log("Wallet not connected, attempting to connect");
      const connectResult = await connect();
      
      if (connectResult) {
        // Try claiming again
        return handleClaimTokens(amount);
      }
      
      return { success: false, error: "Wallet not connected" };
    }
  };
  
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4">Debug Console</h1>
        
        <div className="mb-6">
          <Header 
            daysPassed={daysPassed || 1}
            shopLevel={shopLevel || 1}
            isWalletConnected={connected}
            walletAddress={address}
            tokenBalance={coffyBalance.toString()}
            onClaimReward={handleClaimClick}
          />
        </div>
        
        <div className="mb-4 space-y-2">
          <h2 className="text-lg font-semibold">Game State</h2>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span>COFFY Balance:</span>
              <span className="font-mono">{coffyBalance}</span>
            </div>
            <div className="flex justify-between">
              <span>COFFY Claimed:</span>
              <span className="font-mono">{coffyClaimed}</span>
            </div>
            <div className="flex justify-between">
              <span>Day Passed:</span>
              <span className="font-mono">{daysPassed}</span>
            </div>
            <div className="flex justify-between">
              <span>Shop Level:</span>
              <span className="font-mono">{shopLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4 space-y-2">
          <h2 className="text-lg font-semibold">Wallet State</h2>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span>Connected:</span>
              <span className={`font-mono ${connected ? 'text-green-600' : 'text-red-600'}`}>
                {connected ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Connecting:</span>
              <span className="font-mono">{connecting ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Address:</span>
              <span className="font-mono text-xs truncate max-w-[200px]">{address || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>Wallet Balance:</span>
              <span className="font-mono">{tokenBalance}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={addTokens}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Add 50 Tokens
          </button>
          
          <button
            onClick={resetTokens}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          >
            Reset Tokens
          </button>
          
          <button
            onClick={handleClaimClick}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded"
            disabled={parseFloat(coffyBalance) <= 0}
          >
            Open Claim Modal
          </button>
          
          <button
            onClick={connected ? disconnect : connect}
            className={`${connected ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 px-4 rounded`}
          >
            {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
          </button>
        </div>
        
        <div className="p-4 bg-gray-100 rounded text-xs font-mono overflow-auto max-h-40">
          <div>Store variables type inspection:</div>
          <div>coffyBalance: {typeof coffyBalance} = {coffyBalance}</div>
          <div>tokenBalance: {typeof tokenBalance} = {tokenBalance}</div>
        </div>
        
        {/* Claim Modal */}
        {showClaimModal && (
          <ClaimTokenModal 
            isOpen={showClaimModal}
            onClose={() => setShowClaimModal(false)}
            onClaim={handleClaimTokens}
            balance={connected ? tokenBalance : coffyBalance.toString()}
            maxClaimable={coffyBalance.toString()}
          />
        )}
      </div>
    </div>
  );
}
