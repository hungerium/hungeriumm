import { useState, useEffect } from 'react';
import useWalletStore from '../store/walletStore';

export default function DebugWalletPage() {
  const [isClient, setIsClient] = useState(false);
  const [walletStatus, setWalletStatus] = useState({});
  const [contractStatus, setContractStatus] = useState({});
  const [logs, setLogs] = useState([]);
  
  // Get wallet store values
  const { 
    address, 
    connected, 
    connecting, 
    tokenBalance, 
    error,
    connect, 
    disconnect, 
    claimTokens 
  } = useWalletStore();
  
  // Add log entry
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp}: ${message}`, ...prev]);
  };
  
  // Test wallet environments
  useEffect(() => {
    setIsClient(true);
    
    // Check wallet status
    if (typeof window !== 'undefined') {
      const walletInfo = {
        hasEthereum: !!window.ethereum,
        hasBinanceChain: !!window.BinanceChain,
        isMetaMask: window.ethereum?.isMetaMask,
        isTrust: window.ethereum?.isTrust,
        chainId: window.ethereum?.chainId,
      };
      
      setWalletStatus(walletInfo);
      addLog(`Wallet environment detected: ${JSON.stringify(walletInfo)}`);
    }
  }, []);
  
  // Test contract initialization
  const testContractInit = async () => {
    try {
      addLog("Testing contract initialization...");
      
      // Get contract ABI
      const contractAbi = await import('../utils/contractAbi');
      addLog(`Contract address loaded: ${contractAbi.COFFY_CONTRACT_ADDRESS.substring(0, 10)}...`);
      addLog(`ABI loaded with ${contractAbi.COFFY_ABI.length} functions`);
      
      // Test ethers loader
      const ethersLoader = await import('../utils/ethersLoader');
      const ethers = await ethersLoader.loadEthers();
      
      if (ethers) {
        addLog("Ethers library loaded successfully");
        setContractStatus(prev => ({ ...prev, ethersLoaded: true }));
      } else {
        addLog("ERROR: Ethers library failed to load");
        setContractStatus(prev => ({ ...prev, ethersLoaded: false }));
      }
      
      // Show success
      addLog("Contract initialization test complete");
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
      console.error(error);
    }
  };
  
  // Test wallet connection
  const testWalletConnection = async () => {
    try {
      addLog("Testing wallet connection...");
      
      const result = await connect();
      
      if (result) {
        addLog(`Wallet connected: ${address}`);
      } else {
        addLog(`Wallet connection failed: ${error || "Unknown error"}`);
      }
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
      console.error(error);
    }
  };
  
  // Test token balance fetching
  const testTokenBalance = async () => {
    try {
      if (!connected) {
        addLog("ERROR: Wallet not connected");
        return;
      }
      
      addLog("Fetching token balance...");
      
      // Refreshing wallet store forces balance update
      await useWalletStore.getState().refreshBalance();
      
      // Get updated balance
      const updatedBalance = useWalletStore.getState().tokenBalance;
      
      addLog(`Token balance: ${updatedBalance}`);
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
      console.error(error);
    }
  };
  
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Wallet & Contract Diagnostics</h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Wallet Status</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="mb-1">
              <span className="font-medium">Connected:</span> 
              <span className={connected ? "text-green-600" : "text-red-600"}>
                {connected ? "Yes" : "No"}
              </span>
            </div>
            <div className="mb-1">
              <span className="font-medium">Address:</span> 
              <span className="font-mono text-sm">{address || "Not connected"}</span>
            </div>
            <div className="mb-1">
              <span className="font-medium">Token Balance:</span> 
              <span>{tokenBalance}</span>
            </div>
            {error && (
              <div className="text-red-600 mt-2">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Environment Detection</h3>
            {Object.entries(walletStatus).map(([key, value]) => (
              <div key={key} className="mb-1 text-sm">
                <span className="font-medium">{key}:</span> {String(value)}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Diagnostic Tools</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={testContractInit}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded"
            >
              Test Contract Setup
            </button>
            
            <button
              onClick={testWalletConnection}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded"
            >
              Test Wallet Connection
            </button>
            
            <button
              onClick={testTokenBalance}
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-3 rounded"
              disabled={!connected}
            >
              Test Token Balance
            </button>
            
            <button
              onClick={disconnect}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded"
              disabled={!connected}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">Logs</h2>
          <div className="bg-black text-green-400 p-3 rounded-lg h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Run tests to see output.</p>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
