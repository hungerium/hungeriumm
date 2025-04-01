/**
 * This provides a simple mock implementation of ethers.js for SSR environments
 * It will be used automatically during server-side rendering 
 */

// Mock Contract class
class Contract {
  constructor() {
    // Empty constructor
  }
  
  // Mock methods
  balanceOf() {
    return Promise.resolve("0");
  }
  
  decimals() {
    return Promise.resolve(18);
  }
  
  claimGameRewards() {
    return Promise.resolve({ hash: "0x" });
  }
  
  // Add other contract methods as needed
}

// Mock Web3Provider
class Web3Provider {
  constructor() {
    // Empty constructor
  }
  
  getSigner() {
    return {
      getAddress: () => Promise.resolve("0x0000000000000000000000000000000000000000"),
      // Add other signer methods as needed
    };
  }
  
  // Add other provider methods as needed
}

// Export a mock ethers object
export default {
  Contract,
  providers: {
    Web3Provider,
    // Add other provider types as needed
  },
  utils: {
    parseUnits: () => "0",
    formatUnits: () => "0",
    // Add other utility functions as needed
  },
  // Add other ethers components as needed
};

// For CommonJS compatibility
module.exports = {
  Contract,
  providers: {
    Web3Provider,
  },
  utils: {
    parseUnits: () => "0",
    formatUnits: () => "0",
  },
};
