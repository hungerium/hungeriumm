import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import Header from '../components/Header';
import ClaimTokenModal from '../components/ClaimTokenModal';

export default function CoffyDebugPage() {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [localTokenBalance, setLocalTokenBalance] = useState("0");
  
  // Get game store state directly
  const coffyBalance = useGameStore(state => state.coffyBalance);
  const claimCoffyTokens = useGameStore(state => state.claimCoffyTokens);
  
  // Update local token balance whenever coffyBalance changes
  useEffect(() => {
    console.log("CoffyDebug: Balance changed:", coffyBalance, typeof coffyBalance);
    // Always convert to string for consistency
    const balanceStr = typeof coffyBalance === 'number' 
      ? coffyBalance.toString() 
      : typeof coffyBalance === 'string' 
        ? coffyBalance 
        : "0";
    
    setLocalTokenBalance(balanceStr);
  }, [coffyBalance]);
  
  // Test function to add tokens
  const addTokens = () => {
    // Get current balance as number
    const currentBalance = typeof coffyBalance === 'number' 
      ? coffyBalance 
      : parseFloat(coffyBalance) || 0;
    
    // Add 50 tokens
    const newBalance = currentBalance + 50;
    console.log("Adding tokens:", currentBalance, "+", 50, "=", newBalance);
    
    // Update store with new balance
    useGameStore.setState({ coffyBalance: newBalance });
  };
  
  // Reset tokens
  const resetTokens = () => {
    useGameStore.setState({ coffyBalance: 0 });
  };
  
  // Handle claim button click
  const handleClaimClick = () => {
    console.log("Opening claim modal with balance:", coffyBalance);
    setShowClaimModal(true);
  };
  
  // Handle token claiming
  const handleClaimTokens = async (amount) => {
    console.log("Claiming tokens:", amount);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      // Call the game store function to claim tokens
      claimCoffyTokens(parseFloat(amount));
      
      return {
        success: true,
        txHash: "0x" + Math.random().toString(16).slice(2)
      };
    } catch (error) {
      console.error("Error claiming tokens:", error);
      return {
        success: false,
        error: error.message || "Unknown error"
      };
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-amber-700">COFFY Token Debugger</h1>
        
        {/* Display the Header component with claim button */}
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <Header 
            daysPassed={1}
            shopLevel={1}
            tokenBalance={localTokenBalance}
            onClaimReward={handleClaimClick}
          />
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Game Store Balance:</span>
            <span>{coffyBalance} ({typeof coffyBalance})</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="font-medium">Local Display Balance:</span>
            <span>{localTokenBalance} ({typeof localTokenBalance})</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Has Tokens to Claim:</span>
            <span>{parseFloat(coffyBalance) > 0 ? "Yes" : "No"}</span>
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
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded col-span-2"
            disabled={parseFloat(coffyBalance) <= 0}
          >
            Test Claim Button
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg text-sm">
          <p className="font-medium mb-2">How To Test:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click "Add 50 Tokens" to add test tokens</li>
            <li>Verify that the Header shows the token count</li>
            <li>Click the Claim button in the Header</li>
            <li>Complete the claim process in the modal</li>
            <li>Verify balance returns to 0 after claiming</li>
          </ol>
        </div>
      </div>
      
      {/* Claim Modal */}
      {showClaimModal && (
        <ClaimTokenModal 
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onClaim={handleClaimTokens}
          balance={localTokenBalance}
          maxClaimable={localTokenBalance}
        />
      )}
    </div>
  );
}
