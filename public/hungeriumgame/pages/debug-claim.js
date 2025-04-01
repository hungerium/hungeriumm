import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';
import Header from '../components/Header';
import ClaimTokenModal from '../components/ClaimTokenModal';

export default function DebugClaimPage() {
  const [isClient, setIsClient] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [localBalance, setLocalBalance] = useState("0");
  
  // Get game store state
  const { coffyBalance, claimCoffyTokens } = useGameStore();
  
  // Get wallet store state
  const { connect, connected, address, claimTokens } = useWalletStore();
  
  // Update local balance whenever coffyBalance changes
  useEffect(() => {
    if (typeof coffyBalance === 'number') {
      setLocalBalance(coffyBalance.toString());
    } else {
      setLocalBalance("0");
    }
    
    console.log("COFFY Balance Updated:", {
      coffyBalance, 
      type: typeof coffyBalance,
      localBalance: coffyBalance?.toString()
    });
  }, [coffyBalance]);
  
  // Check if we're client-side
  useEffect(() => {
    setIsClient(true);
    
    // Immediately check coffyBalance when component loads
    const balance = useGameStore.getState().coffyBalance;
    console.log("Initial COFFY Balance:", balance, typeof balance);
  }, []);
  
  // Add tokens for testing - with extensive logging
  const addTokens = () => {
    const currentBalance = typeof coffyBalance === 'number' ? coffyBalance : 0;
    const newBalance = currentBalance + 50;
    
    console.log("Adding tokens:", {
      before: currentBalance,
      adding: 50,
      after: newBalance
    });
    
    // Update the store directly
    useGameStore.setState({ coffyBalance: newBalance });
    
    // Force refresh local state
    setLocalBalance(newBalance.toString());
    
    console.log("After adding tokens:", {
      storeBalance: useGameStore.getState().coffyBalance,
      localBalance: newBalance.toString()
    });
  };
  
  // Reset tokens for testing
  const resetTokens = () => {
    useGameStore.setState({ coffyBalance: 0 });
    setLocalBalance("0");
    console.log("Reset token balance to 0");
  };
  
  // Handle claim button click
  const handleClaimClick = () => {
    console.log("Opening claim modal with balance:", coffyBalance);
    setShowClaimModal(true);
  };
  
  // Handle claiming tokens
  const handleClaimTokens = async (amount) => {
    console.log("Claiming tokens:", amount);
    
    try {
      // For debugging, simulate successful claim
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the store's claimCoffyTokens method
      claimCoffyTokens(parseFloat(amount));
      
      // Reset local balance after claiming
      setLocalBalance("0");
      
      // Return success
      return {
        success: true,
        txHash: "0x" + Math.random().toString(16).slice(2)
      };
    } catch (error) {
      console.error("Error claiming:", error);
      return {
        success: false,
        error: error.message || "Unknown error"
      };
    }
  };
  
  // Add real wallet claim test
  const testRealClaim = async () => {
    try {
      // First ensure wallet is connected
      if (!connected) {
        await connect();
        // Wait for connection to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (!connected) {
        alert("Gerçek cüzdan testi için lütfen önce cüzdanınızı bağlayın.");
        return;
      }
      
      // Open modal with real wallet integration
      handleClaimClick();
    } catch (error) {
      console.error("Real wallet test error:", error);
      alert("Cüzdan testi hatası: " + error.message);
    }
  };
  
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4">COFFY Claim Test Page</h1>
        
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <Header 
            daysPassed={1}
            shopLevel={1}
            isWalletConnected={connected}
            walletAddress={address}
            tokenBalance={localBalance}
            onClaimReward={handleClaimClick}
          />
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-2">Current State:</h2>
          <div className="mb-2">
            <span className="font-medium">COFFY Balance (Store):</span> 
            <span className="ml-2">{coffyBalance}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">COFFY Balance (Local):</span> 
            <span className="ml-2">{localBalance}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">COFFY Type:</span> 
            <span className="ml-2">{typeof coffyBalance}</span>
          </div>
          <div className="mb-2">
            <span className="font-medium">Wallet Connected:</span> 
            <span className="ml-2">{connected ? 'Yes' : 'No'}</span>
          </div>
          {connected && (
            <div className="mb-2">
              <span className="font-medium">Wallet Address:</span> 
              <span className="ml-2">{address}</span>
            </div>
          )}
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
            disabled={parseFloat(localBalance) <= 0}
          >
            Open Claim Modal
          </button>
          
          <button
            onClick={connected ? null : connect}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            disabled={connected}
          >
            Connect Wallet
          </button>
          
          <button
            onClick={testRealClaim}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded col-span-2"
            disabled={parseFloat(localBalance) <= 0}
          >
            Gerçek Cüzdan Testi
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Bu sayfa, COFFY token sistemini test etmenize olanak tanır. Simülasyon oyunumuzda kazanılan tokenları claim etme özelliğini test edebilirsiniz.</p>
        </div>
      </div>
      
      {/* Claim Modal */}
      {showClaimModal && (
        <ClaimTokenModal 
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          onClaim={handleClaimTokens}
          balance={localBalance}
          maxClaimable={localBalance}
        />
      )}
    </div>
  );
}
