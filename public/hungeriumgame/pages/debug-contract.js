import { useState, useEffect } from 'react';
import { COFFY_CONTRACT_ADDRESS, COFFY_ABI } from '../utils/contractAbi';
import useWalletStore from '../store/walletStore';

export default function DebugContractPage() {
  const [isClient, setIsClient] = useState(false);
  const [functions, setFunctions] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [amount, setAmount] = useState('50');
  const [logs, setLogs] = useState([]);
  
  const { connected, address, connect } = useWalletStore();
  
  useEffect(() => {
    setIsClient(true);
    
    // Extract contract functions from ABI
    const contractFunctions = COFFY_ABI
      .filter(item => item.startsWith('function'))
      .map(item => {
        const match = item.match(/function\s+([^\s(]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);
    
    setFunctions(contractFunctions);
    
    // Set default selected function
    if (contractFunctions.includes('claimGameRewards')) {
      setSelectedFunction('claimGameRewards');
    }
  }, []);
  
  // Add log entry
  const addLog = (message) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };
  
  // Test contract interaction
  const testContractCall = async () => {
    if (!selectedFunction) {
      addLog("ERROR: No function selected");
      return;
    }
    
    if (!connected) {
      addLog("Connecting wallet first...");
      await connect();
      if (!connected) {
        addLog("ERROR: Failed to connect wallet");
        return;
      }
    }
    
    addLog(`Testing contract function: ${selectedFunction}`);
    
    try {
      // Import ethers dynamically
      const { loadEthers } = await import('../utils/ethersLoader');
      const ethers = await loadEthers();
      
      if (!ethers) {
        addLog("ERROR: Failed to load ethers library");
        return;
      }
      
      // Get wallet provider
      const provider = new ethers.providers.Web3Provider(window.ethereum || window.BinanceChain);
      const signer = provider.getSigner();
      
      // Create contract interface
      const iface = new ethers.utils.Interface(COFFY_ABI);
      
      // Encode function call data based on selected function
      let data;
      if (selectedFunction === 'claimGameRewards') {
        const parsedAmount = ethers.utils.parseUnits(amount, 18); // Assuming 18 decimals
        data = iface.encodeFunctionData(selectedFunction, [parsedAmount]);
        addLog(`Encoded claimGameRewards(${amount}) = ${data}`);
      } else if (selectedFunction.includes('balanceOf')) {
        data = iface.encodeFunctionData(selectedFunction, [address]);
        addLog(`Encoded balanceOf(${address}) = ${data}`);
      } else {
        data = iface.encodeFunctionData(selectedFunction, []);
        addLog(`Encoded ${selectedFunction}() = ${data}`);
      }
      
      // Display transaction parameters
      addLog(`Contract address: ${COFFY_CONTRACT_ADDRESS}`);
      addLog(`From address: ${address}`);
      addLog(`Data: ${data}`);
      
      // Ask for confirmation before sending real transaction
      const confirmation = confirm("Do you want to send this transaction to the blockchain?");
      
      if (confirmation) {
        const tx = await signer.sendTransaction({
          to: COFFY_CONTRACT_ADDRESS,
          data: data,
          gasLimit: 300000
        });
        
        addLog(`Transaction sent: ${tx.hash}`);
        addLog(`View on BSCScan: https://bscscan.com/tx/${tx.hash}`);
      } else {
        addLog("Transaction cancelled by user");
      }
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
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-5">
        <h1 className="text-2xl font-bold mb-4">Contract Function Debug</h1>
        
        <div className="mb-6">
          <div className="mb-4">
            <p className="font-medium mb-1">Contract Address:</p>
            <div className="bg-gray-100 p-2 rounded font-mono text-sm break-all">
              {COFFY_CONTRACT_ADDRESS}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="font-medium mb-1">Available Functions:</p>
            <select
              className="w-full p-2 border rounded"
              value={selectedFunction || ''}
              onChange={(e) => setSelectedFunction(e.target.value)}
            >
              <option value="">Select a function</option>
              {functions.map(fn => (
                <option key={fn} value={fn}>{fn}()</option>
              ))}
            </select>
          </div>
          
          {selectedFunction === 'claimGameRewards' && (
            <div className="mb-4">
              <p className="font-medium mb-1">Amount to claim:</p>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          )}
          
          <div className="mb-4">
            <p className="font-medium mb-1">Wallet Status:</p>
            <div className="bg-gray-100 p-2 rounded">
              {connected ? (
                <div>
                  <p className="text-green-600 font-medium">✓ Connected</p>
                  <p className="text-sm font-mono truncate">{address}</p>
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-red-600 mr-2">✗ Not Connected</p>
                  <button
                    onClick={connect}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={testContractCall}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded font-medium"
            disabled={!selectedFunction}
          >
            Test Contract Call
          </button>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Logs</h2>
          <div className="bg-black text-green-400 p-3 rounded h-64 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? 
              <p className="text-gray-500">No logs yet. Run a test to see output.</p> :
              logs.map((log, i) => <div key={i}>{log}</div>)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
