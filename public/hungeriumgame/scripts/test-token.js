/**
 * Run this script with Node.js to test token functionality
 * 
 * Usage:
 * node scripts/test-token.js add 50
 * node scripts/test-token.js reset
 * node scripts/test-token.js check
 */

const fs = require('fs');
const path = require('path');

const LOCAL_STORAGE_FILE = path.join(__dirname, '..', 'localStorage.json');

// Read localStorage content
function getLocalStorage() {
  if (!fs.existsSync(LOCAL_STORAGE_FILE)) {
    return {};
  }
  
  try {
    return JSON.parse(fs.readFileSync(LOCAL_STORAGE_FILE, 'utf8'));
  } catch (error) {
    console.error('Error reading localStorage file:', error);
    return {};
  }
}

// Write to localStorage file
function saveLocalStorage(data) {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing localStorage file:', error);
  }
}

// Get and modify game state
function getGameState() {
  const localStorage = getLocalStorage();
  const gameDataKey = 'coffylapse-game-storage';
  
  if (!localStorage[gameDataKey]) {
    return null;
  }
  
  try {
    return JSON.parse(localStorage[gameDataKey]);
  } catch (error) {
    console.error('Error parsing game data:', error);
    return null;
  }
}

// Save modified game state
function saveGameState(state) {
  const localStorage = getLocalStorage();
  const gameDataKey = 'coffylapse-game-storage';
  
  localStorage[gameDataKey] = JSON.stringify(state);
  saveLocalStorage(localStorage);
}

// Process command line arguments
const command = process.argv[2];
const amount = process.argv[3];

if (!command) {
  console.log('Please specify a command: add, reset, or check');
  process.exit(1);
}

const gameState = getGameState();

if (!gameState) {
  console.log('No game state found in localStorage. Start the game first.');
  process.exit(1);
}

switch (command) {
  case 'add':
    const tokenAmount = parseFloat(amount) || 50;
    console.log(`Current COFFY balance: ${gameState.state.coffyBalance || 0}`);
    
    // Ensure coffyBalance is a number
    const currentBalance = typeof gameState.state.coffyBalance === 'number' 
      ? gameState.state.coffyBalance 
      : parseFloat(gameState.state.coffyBalance) || 0;
    
    const newBalance = currentBalance + tokenAmount;
    gameState.state.coffyBalance = newBalance;
    
    saveGameState(gameState);
    console.log(`Added ${tokenAmount} tokens. New balance: ${newBalance}`);
    break;
    
  case 'reset':
    gameState.state.coffyBalance = 0;
    saveGameState(gameState);
    console.log('Reset COFFY balance to 0');
    break;
    
  case 'check':
    console.log('Game state:');
    console.log(`- COFFY balance: ${gameState.state.coffyBalance || 0} (${typeof gameState.state.coffyBalance})`);
    console.log(`- COFFY claimed: ${gameState.state.coffyClaimed || 0} (${typeof gameState.state.coffyClaimed})`);
    console.log(`- Shop level: ${gameState.state.shopLevel || 1}`);
    console.log(`- Days passed: ${gameState.state.daysPassed || 1}`);
    break;
    
  default:
    console.log(`Unknown command: ${command}`);
    console.log('Available commands: add, reset, check');
}
