/**
 * Browser-side debug script for COFFY tokens
 * Include this script in HTML to debug token issues directly in the browser console
 * 
 * Usage in console:
 * coffyDebug.getBalance() - Check current COFFY balance
 * coffyDebug.addTokens(50) - Add 50 tokens
 * coffyDebug.reset() - Reset token balance
 * coffyDebug.claim() - Test token claiming
 * coffyDebug.diagnose() - Run full diagnostics
 */

(function() {
  console.log('COFFY Token Debug Tool loaded');
  
  // Helper to access state safely
  function safeAccess(object, path) {
    return path.split('.').reduce((o, p) => o && o[p] ? o[p] : null, object);
  }
  
  const coffyDebug = {
    // Check if gameStore exists
    hasGameStore: function() {
      return window.useGameStore || safeAccess(window, '__NEXT_DATA__.props.pageProps.gameStore');
    },
    
    // Get game store state
    getGameStore: function() {
      return window.useGameStore ? 
        window.useGameStore.getState() : 
        null;
    },
    
    // Get COFFY balance
    getBalance: function() {
      const store = this.getGameStore();
      if (!store) {
        console.error("Game store not found");
        return null;
      }
      
      const balance = store.coffyBalance;
      console.log("Current COFFY balance:", balance, "(" + typeof balance + ")");
      return balance;
    },
    
    // Add tokens
    addTokens: function(amount = 50) {
      const store = this.getGameStore();
      if (!store) {
        console.error("Game store not found");
        return false;
      }
      
      // Ensure amount is a number
      amount = parseInt(amount) || 50;
      
      // Get current balance
      const currentBalance = typeof store.coffyBalance === 'number' ? 
        store.coffyBalance : parseFloat(store.coffyBalance || 0);
      
      // Calculate new balance
      const newBalance = currentBalance + amount;
      
      // Update store
      window.useGameStore.setState({ coffyBalance: newBalance });
      
      console.log(`Added ${amount} tokens. New balance:`, newBalance);
      return true;
    },
    
    // Reset token balance
    reset: function() {
      const store = this.getGameStore();
      if (!store) {
        console.error("Game store not found");
        return false;
      }
      
      window.useGameStore.setState({ coffyBalance: 0 });
      console.log("Reset COFFY balance to 0");
      return true;
    },
    
    // Test claiming tokens
    claim: function() {
      const store = this.getGameStore();
      if (!store) {
        console.error("Game store not found");
        return false;
      }
      
      // Ensure we have tokens to claim
      const balance = typeof store.coffyBalance === 'number' ? 
        store.coffyBalance : parseFloat(store.coffyBalance || 0);
      
      if (balance <= 0) {
        console.error("No tokens to claim. Add tokens first.");
        return false;
      }
      
      // Get claim function
      const claimFunction = store.claimCoffyTokens;
      if (typeof claimFunction !== 'function') {
        console.error("Claim function not found in store");
        return false;
      }
      
      // Test claim
      try {
        console.log(`Claiming ${balance} tokens...`);
        const result = claimFunction(balance);
        console.log("Claim result:", result);
        
        // Check balance after claim
        const newBalance = this.getGameStore().coffyBalance;
        console.log("New balance after claim:", newBalance);
        
        return result;
      } catch (error) {
        console.error("Error during claim test:", error);
        return false;
      }
    },
    
    // Run full diagnostics
    diagnose: function() {
      console.log("=== COFFY Token System Diagnostics ===");
      
      // Check window globals
      console.log("\n1. Checking global objects:");
      console.log("useGameStore defined:", !!window.useGameStore);
      console.log("useWalletStore defined:", !!window.useWalletStore);
      console.log("Web3 environment:", {
        ethereum: !!window.ethereum,
        binanceChain: !!window.BinanceChain,
        web3: !!window.web3
      });
      
      // Check game store
      console.log("\n2. Game Store check:");
      const gameStore = this.getGameStore();
      if (gameStore) {
        console.log("Game store found with keys:", Object.keys(gameStore));
        console.log("coffyBalance:", gameStore.coffyBalance, "(" + typeof gameStore.coffyBalance + ")");
        console.log("coffyClaimed:", gameStore.coffyClaimed, "(" + typeof gameStore.coffyClaimed + ")");
        console.log("claimCoffyTokens is function:", typeof gameStore.claimCoffyTokens === 'function');
      } else {
        console.error("Game store not found!");
      }
      
      // Check local storage
      console.log("\n3. Local Storage check:");
      try {
        const gameStorageKey = 'coffylapse-game-storage';
        const storedData = localStorage.getItem(gameStorageKey);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log("Game data in localStorage:", parsedData);
          
          // Check if parsedData has state property
          if (parsedData.state && typeof parsedData.state === 'object') {
            console.log("coffyBalance in localStorage:", parsedData.state.coffyBalance);
            console.log("coffyClaimed in localStorage:", parsedData.state.coffyClaimed);
          } else {
            console.log("Unexpected localStorage format:", parsedData);
          }
        } else {
          console.log("No game data found in localStorage");
        }
      } catch (error) {
        console.error("Error checking localStorage:", error);
      }
      
      // Overall system status
      console.log("\n4. Overall system status:");
      const status = {
        hasGameStore: !!this.getGameStore(),
        hasClaimFunction: !!safeAccess(this.getGameStore(), 'claimCoffyTokens'),
        coffyBalanceType: typeof safeAccess(this.getGameStore(), 'coffyBalance'),
        currentBalance: safeAccess(this.getGameStore(), 'coffyBalance'),
        hasClaimed: safeAccess(this.getGameStore(), 'coffyClaimed') > 0,
        hasWalletSupport: !!(window.ethereum || window.BinanceChain)
      };
      
      console.log(status);
      
      // Recommendations
      console.log("\n5. Recommendations:");
      if (!status.hasGameStore) {
        console.log("- Game store is missing. Check Zustand initialization");
      }
      
      if (!status.hasClaimFunction) {
        console.log("- Claim function is missing from game store");
      }
      
      if (status.coffyBalanceType !== 'number') {
        console.log("- coffyBalance has incorrect type. Should be number, is", status.coffyBalanceType);
        console.log("  Try running: window.useGameStore.setState({ coffyBalance: parseFloat(window.useGameStore.getState().coffyBalance || 0) })");
      }
      
      if (status.currentBalance <= 0) {
        console.log("- No tokens to claim. Try adding tokens with coffyDebug.addTokens(50)");
      }
      
      if (!status.hasWalletSupport) {
        console.log("- No wallet support detected. Consider using a browser with MetaMask installed");
      }
      
      return status;
    }
  };
  
  // Expose to window
  window.coffyDebug = coffyDebug;
  
  // Auto-run diagnostics on load
  setTimeout(() => {
    console.log("Running automatic COFFY diagnostics...");
    coffyDebug.diagnose();
    console.log("\nUse coffyDebug methods to interact with the COFFY token system:");
    console.log("- coffyDebug.getBalance() - Check current balance");
    console.log("- coffyDebug.addTokens(50) - Add 50 tokens");
    console.log("- coffyDebug.reset() - Reset balance to 0");
    console.log("- coffyDebug.claim() - Test claiming tokens");
    console.log("- coffyDebug.diagnose() - Run full diagnostics");
  }, 2000);
})();
