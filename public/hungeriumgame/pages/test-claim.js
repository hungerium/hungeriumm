import { useState, useEffect } from 'react';
import useGameStore from '../store/gameStore';
import useWalletStore from '../store/walletStore';
import Header from '../components/Header';

export default function TestClaimPage() {
  const [isClient, setIsClient] = useState(false);
  const { coffyBalance, claimCoffyTokens } = useGameStore();
  const { connect, connected, address, claimTokens } = useWalletStore();
  const [debugInfo, setDebugInfo] = useState({});
  
  // Simulate adding tokens
  const addTokens = () => {
    useGameStore.setState(state => ({
      coffyBalance: parseFloat(state.coffyBalance || 0) + 50
    }));
    console.log("Added 50 tokens, new balance:", useGameStore.getState().coffyBalance);
  };
  
  // Test claim function
  const testClaim = async () => {
    console.log("Test claiming tokens:", coffyBalance);
    
    if (connected) {
      try {
        const result = await claimTokens(coffyBalance.toString());
        console.log("Claim result:", result);
        
        if (result.success) {
          // Update game state
          claimCoffyTokens(parseFloat(coffyBalance));
          alert(`Successfully claimed ${coffyBalance} COFFY tokens!`);
        } else {
          alert(`Failed to claim: ${result.error}`);
        }
      } catch (error) {
        console.error("Error during claim:", error);
        alert(`Error: ${error.message}`);
      }
    } else {
      alert("Wallet not connected. Connecting now...");
      connect();
    }
  };
  
  // Get debug info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
      
      // Gather debug info periodically
      const interval = setInterval(() => {
        setDebugInfo({
          coffyBalance,
          hasGameStore: !!useGameStore,
          gameStoreKeys: Object.keys(useGameStore.getState()),
          connected,
          address,
          hasWalletStore: !!useWalletStore,
          walletStoreKeys: Object.keys(useWalletStore.getState()),
          tokenType: typeof coffyBalance,
          tokenValue: coffyBalance
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [coffyBalance, connected, address]);
  
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4">COFFY Token Claim Test</h1>
        
        <Header 
          daysPassed={1}
          shopLevel={1}
          isWalletConnected={connected}
          walletAddress={address}
          tokenBalance={coffyBalance.toString()}
          onClaimReward={testClaim}
        />
        
        <div className="mt-6 space-y-4">
          <div className="bg-gray-100 p-3 rounded-md">
            <h2 className="font-medium">Current State:</h2>
            <p>COFFY Balance: {coffyBalance}</p>
            <p>Wallet Connected: {connected ? 'Yes' : 'No'}</p>
            {connected && <p>Address: {address}</p>}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={addTokens}
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Add 50 Tokens
            </button>
            
            <button
              onClick={testClaim}
              className="px-4 py-2 bg-amber-600 text-white rounded-md"
              disabled={parseFloat(coffyBalance) <= 0}
            >
              Test Claim
            </button>
            
            <button
              onClick={connect}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={connected}
            >
              Connect Wallet
            </button>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-3">
          <h2 className="font-medium mb-2">Debug Information:</h2>
          <pre className="bg-gray-100 p-3 rounded-md text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
