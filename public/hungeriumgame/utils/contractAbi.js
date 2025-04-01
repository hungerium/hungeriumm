// Contract address on BSC network
export const COFFY_CONTRACT_ADDRESS = '0x04CD0E3b1009E8ffd9527d0591C7952D92988D0f';

// A minimal ABI array for SSR compatibility
export const COFFY_ABI = [
  // Basic ERC20 functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 value) returns (bool)",
  
  // Custom functions for our game - IMPORTANT: This is the function we need to call
  "function claimGameRewards(uint256 amount) external returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event ClaimRewards(address indexed user, uint256 amount)"
];

// Dynamic import helper for the full ABI
export async function getFullABI() {
  // Only load the full ABI when needed (client-side)
  if (typeof window !== 'undefined') {
    try {
      // Full ABI could be imported from a separate file if needed
      return COFFY_ABI;
    } catch (error) {
      console.error("Error loading full ABI:", error);
      return COFFY_ABI;
    }
  }
  return COFFY_ABI;
}
