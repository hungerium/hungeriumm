import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import ClaimTokenModal from '../components/ClaimTokenModal';
import Header from '../components/Header';

export default function TestPage() {
  const [isClient, setIsClient] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  
  // Get game store state
  const { 
    coffyBalance, 
    claimCoffyTokens
  } = useGameStore();
  
  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Add tokens for testing
  const addTokens = () => {
    const currentBalance = typeof coffyBalance === 'number' ? coffyBalance : 0;
    const newBalance = currentBalance + 50;
    useGameStore.setState({ coffyBalance: newBalance });
    console.log("Added tokens, new balance:", newBalance);
  };
  
  // Handle claim click
  const handleClaimClick = () => {
    console.log("Opening claim modal");
    setShowClaimModal(true);
  };
  
  // Handle claim tokens
  const handleClaimTokens = async (amount) => {
    console.log("Claiming tokens:", amount);
    
    try {
      // Simulate successful claim for testing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update game state
      const claimAmount = parseFloat(amount);
      claimCoffyTokens(claimAmount);
      
      // Return success
      return {
        success: true,
        txHash: "0x" + Math.random().toString(16).slice(2)
      };
    } catch (error) {
      console.error("Error during claim:", error);
      return {
        success: false,
        error: error.message || "Unknown error"
      };
    }
  };
  
  // Check component rendering
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen p-4 bg-coffee-dark flex flex-col">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Token Claim Test Page</h1>
        
        {/* Test Header component */}
        <div className="mb-6 border rounded overflow-hidden">
          <Header 
            daysPassed={1}
            shopLevel={1}
            tokenBalance={coffyBalance.toString()}
            onClaimReward={handleClaimClick}
          />
        </div>
        
        <div className="mb-6 border p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Current State:</h2>
          <div>
            <label className="font-medium">COFFY Balance:</label> 
            <span className="ml-2 font-mono">{coffyBalance}</span>
          </div>
        </div>
        
        <div className="flex justify-between mb-6">
          <button
            onClick={addTokens}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add 50 Tokens
          </button>
          
          <button
            onClick={handleClaimClick}
            className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={!coffyBalance || coffyBalance <= 0}
          >
            Test Claim
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>This page is for testing token claiming functionality. The Header component and ClaimTokenModal component should be visible and working.</p>
        </div>
      </div>
      
      {/* Claim token modal */}
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
