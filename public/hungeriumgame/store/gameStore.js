// Try to use zustand directly, fallback to our custom implementation
let create, persist;
try {
  const zustand = require('zustand');
  create = zustand.create;
  persist = require('zustand/middleware').persist;
} catch (e) {
  console.warn("Falling back to local implementation of zustand");
  const storeUtils = require('../utils/storeUtils');
  create = storeUtils.create;
  persist = storeUtils.persist;
}

import { scenarios } from '../data/scenarios';
import { getRandomEvent } from '../utils/randomEvents';

const useGameStore = create(
  persist(
    (set, get) => ({
      // Core metrics
      metrics: {
        financial: 50, // Money/Financial Status
        satisfaction: 50, // Customer Satisfaction/Popularity
        stock: 50, // Stock Levels/Operations
        sustainability: 50, // Sustainability
      },
      
      // Game state
      currentScenario: null,
      answeredScenarios: [],
      daysPassed: 1,
      coffyBalance: 0, // Start with 0 tokens
      coffyClaimed: 0,
      managementStyle: null,
      showTutorial: true,
      gameOver: false,
      gameOverReason: '',
      highestMoney: 50, // Add tracking for highest money
      
      // Player progression
      shopLevel: 1,
      experience: 0,
      
      // Shop attributes
      staff: 3,
      equipmentQuality: 1,
      customerLoyalty: 20,
      
      // Initialize game
      initGame: () => {
        // Reset the game state
        set({
          metrics: {
            financial: 50,
            satisfaction: 50,
            stock: 50,
            sustainability: 50,
          },
          currentScenario: null,
          answeredScenarios: [],
          daysPassed: 1,
          gameOver: false,
          gameOverReason: '',
          shopLevel: 1,
          experience: 0,
          staff: 3,
          equipmentQuality: 1,
          customerLoyalty: 20,
          highestMoney: 50,
          coffyBalance: 0, // Explicitly initialize as 0 (number)
          // Keep coffyClaimed untouched to preserve claimed tokens
        });
        
        // Force load the first scenario immediately
        setTimeout(() => {
          const state = get();
          // Only load if not already loaded
          if (!state.currentScenario) {
            get().loadNextScenario();
          }
        }, 100);
      },
      
      // Manually add tokens for testing
      addTestTokens: (amount = 50) => {
        const parsedAmount = parseFloat(amount) || 50;
        set(state => {
          const currentBalance = typeof state.coffyBalance === 'number' ? state.coffyBalance : 0;
          const newBalance = currentBalance + parsedAmount;
          
          console.log(`[GameStore] Adding ${parsedAmount} test tokens:`, {
            currentBalance,
            newBalance,
            type: typeof newBalance
          });
          
          return { coffyBalance: newBalance };
        });
      },
      
      // Answer a scenario question
      answerQuestion: (choice) => {
        const { currentScenario } = get();
        if (!currentScenario || get().gameOver) return;
        
        const impact = currentScenario[choice];
        
        // Update metrics immediately
        set(state => {
          // Map impact fields to state metrics
          const mappings = {
            money: 'financial',
            popularity: 'satisfaction',
            operations: 'stock',
            sustainability: 'sustainability'
          };
          
          const newMetrics = { ...state.metrics };
          
          // Update each metric - Reduce impact by ~25%
          Object.entries(impact).forEach(([key, value]) => {
            if (mappings[key]) {
              // Apply 75% of the original impact to reduce intensity
              const reducedImpact = value * 0.75;
              newMetrics[mappings[key]] = Math.max(0, Math.min(100, newMetrics[mappings[key]] + reducedImpact));
            }
          });
          
          // Track highest money value
          const highestMoney = Math.max(state.highestMoney || 0, newMetrics.financial);
          
          // Fix: Correctly handle coffyBalance as a number
          const currentCoffyBalance = typeof state.coffyBalance === 'number' 
            ? state.coffyBalance 
            : parseFloat(state.coffyBalance || '0');
          
          // Dynamic token reward calculation
          const decisions = state.answeredScenarios.length || 0;
          let tokenReward = 25; // Base reward
          
          // Apply progressive multiplier (5% increase per decision, up to 2.5x)
          const progressMultiplier = Math.min(1 + (decisions * 0.05), 2.5);
          tokenReward = Math.round(tokenReward * progressMultiplier);
          
          // Additional level bonus (10% per level)
          tokenReward = Math.round(tokenReward * (1 + ((state.shopLevel - 1) * 0.1)));
          
          // Ensure reward is at least 25
          tokenReward = Math.max(25, tokenReward);
          
          // New balance with dynamic reward
          const newCoffyBalance = currentCoffyBalance + tokenReward;
          
          console.log("[GameStore] Adding tokens for scenario answer:", {
            decisions: decisions,
            multiplier: progressMultiplier,
            reward: tokenReward,
            before: currentCoffyBalance,
            after: newCoffyBalance
          });
          
          return {
            metrics: newMetrics,
            answeredScenarios: [...state.answeredScenarios, currentScenario.id],
            daysPassed: state.daysPassed + 1,
            coffyBalance: newCoffyBalance,
            experience: state.experience + (impact.experience || 1),
            staff: Math.max(1, state.staff + (impact.staff || 0)),
            equipmentQuality: Math.max(1, Math.min(10, state.equipmentQuality + (impact.equipment || 0))),
            customerLoyalty: Math.max(0, Math.min(100, state.customerLoyalty + (impact.loyalty || 0))),
            highestMoney
          };
        });
        
        // Check for game over conditions
        get().checkGameOver();
        
        // Check for level up
        get().checkLevelUp();
        
        // Load next scenario immediately
        get().loadNextScenario();
      },
      
      // Load next scenario
      loadNextScenario: () => {
        if (get().gameOver) return;
        
        const { answeredScenarios, shopLevel, metrics } = get();
        
        console.log("Loading next scenario, answered so far:", answeredScenarios);
        
        // Use a more deterministic approach for the first scenario to prevent getting stuck
        if (answeredScenarios.length === 0) {
          // Always start with the first scenario for new games
          const firstScenario = scenarios[0];
          console.log("Setting first scenario:", firstScenario);
          set({ currentScenario: firstScenario });
          return;
        }
        
        // Get all available scenarios based on level requirement
        let availableScenarios = scenarios.filter(scenario => 
          (!scenario.requiredLevel || scenario.requiredLevel <= shopLevel)
        );
        
        // Split into new and previously seen scenarios
        const newScenarios = availableScenarios.filter(scenario => 
          !answeredScenarios.includes(scenario.id)
        );
        
        const previouslySeenScenarios = availableScenarios.filter(scenario => 
          answeredScenarios.includes(scenario.id)
        );
        
        // Check if there are any new scenarios left
        if (newScenarios.length === 0) {
          if (previouslySeenScenarios.length === 0) {
            // No more scenarios available
            set({ 
              gameOver: true, 
              gameOverReason: "Congratulations! You've successfully completed all challenges and built a thriving coffee empire!" 
            });
            return;
          }
          
          // If no new scenarios, pick from previously seen ones (with 20% chance)
          // Otherwise, trigger a random event
          const shouldReusePreviousScenario = Math.random() < 0.2;
          
          if (shouldReusePreviousScenario) {
            const randomIndex = Math.floor(Math.random() * previouslySeenScenarios.length);
            const nextScenario = previouslySeenScenarios[randomIndex];
            console.log("Reusing previous scenario:", nextScenario);
            set({ currentScenario: nextScenario });
          } else {
            // Generate a random event instead
            generateRandomEvent(get, set);
          }
          return;
        }
        
        // 75% chance to get a new scenario, 25% chance to get a previously seen one or random event
        const useNewScenario = newScenarios.length > 0 && 
          (previouslySeenScenarios.length === 0 || Math.random() < 0.75);
        
        if (useNewScenario) {
          // Select random new scenario
          const randomIndex = Math.floor(Math.random() * newScenarios.length);
          const nextScenario = newScenarios[randomIndex];
          console.log("Setting new scenario:", nextScenario);
          set({ currentScenario: nextScenario });
        } else if (previouslySeenScenarios.length > 0) {
          // 15% chance for a previously seen scenario
          if (Math.random() < 0.6) {
            const randomIndex = Math.floor(Math.random() * previouslySeenScenarios.length);
            const nextScenario = previouslySeenScenarios[randomIndex];
            console.log("Reusing previous scenario:", nextScenario);
            set({ currentScenario: nextScenario });
          } else {
            // 10% chance for a random event
            generateRandomEvent(get, set);
          }
        } else {
          // Fallback to new scenario if we have no seen scenarios yet
          const randomIndex = Math.floor(Math.random() * newScenarios.length);
          const nextScenario = newScenarios[randomIndex];
          console.log("Setting fallback new scenario:", nextScenario);
          set({ currentScenario: nextScenario });
        }
      },
      
      // Function to generate a random event
      generateRandomEvent: () => {
        const state = get();
        
        // Get game metrics for contextual events
        const gameState = {
          metrics: state.metrics,
          shopLevel: state.shopLevel,
          daysPassed: state.daysPassed,
          staff: state.staff,
          equipmentQuality: state.equipmentQuality,
          customerLoyalty: state.customerLoyalty
        };
        
        // Get a random event based on current game state
        const randomEvent = getRandomEvent(gameState);
        
        // Set the event as current scenario
        console.log("Generating random event:", randomEvent);
        set({ currentScenario: randomEvent });
      },
      
      // Check for game over conditions
      checkGameOver: () => {
        const { metrics } = get();
        
        if (metrics.financial <= 0) {
          set({ 
            gameOver: true, 
            gameOverReason: "CoffyCorp has gone bankrupt! Your financial strategies failed to keep the business afloat." 
          });
        } else if (metrics.satisfaction <= 0) {
          set({ 
            gameOver: true, 
            gameOverReason: "CoffyCorp has lost all customers! Your service decisions drove away the last loyal patrons." 
          });
        } else if (metrics.stock <= 0) {
          set({ 
            gameOver: true, 
            gameOverReason: "CoffyCorp shelves are empty! Your supply chain has completely collapsed." 
          });
        } else if (metrics.sustainability <= 0) {
          set({ 
            gameOver: true, 
            gameOverReason: "CoffyCorp's environmental reputation is destroyed! Boycotts have shut down all locations." 
          });
        }
      },
      
      // Check level up
      checkLevelUp: () => {
        const { experience, shopLevel } = get();
        const experienceRequired = 20;
        
        if (shopLevel < 5 && Math.floor(experience / experienceRequired) > Math.floor((experience - 1) / experienceRequired)) {
          const newLevel = Math.min(5, shopLevel + 1);
          set({ shopLevel: newLevel });
        }
      },
      
      // Claim COFFY tokens
      claimCoffyTokens: (amount) => {
        try {
          // Ensure amount is a valid number
          const claimAmount = typeof amount === 'number' 
            ? amount 
            : typeof amount === 'string' 
              ? parseFloat(amount) 
              : 0;
          
          console.log("[GameStore] Claiming tokens:", {
            input: amount,
            parsed: claimAmount
          });
          
          if (isNaN(claimAmount) || claimAmount <= 0) {
            console.error("[GameStore] Invalid claim amount:", amount);
            return false;
          }
          
          set(state => {
            // Get current balance as number
            const currentBalance = typeof state.coffyBalance === 'number' 
              ? state.coffyBalance 
              : parseFloat(state.coffyBalance || '0');
            
            // Get current claimed amount as number
            const currentClaimed = typeof state.coffyClaimed === 'number' 
              ? state.coffyClaimed 
              : parseFloat(state.coffyClaimed || '0');
            
            // IMPORTANT: Only claim what's available
            const actualClaimAmount = Math.min(claimAmount, currentBalance);
            
            if (actualClaimAmount < claimAmount) {
              console.warn(`[GameStore] Attempted to claim ${claimAmount} but only ${actualClaimAmount} available`);
            }
            
            if (actualClaimAmount <= 0) {
              console.error(`[GameStore] Cannot claim tokens. Only ${currentBalance} available.`);
              return state;
            }
            
            // Calculate new values
            const newBalance = currentBalance - actualClaimAmount;
            const newClaimed = currentClaimed + actualClaimAmount;
            
            console.log("[GameStore] Claim successful:", {
              previousBalance: currentBalance,
              claimAmount: actualClaimAmount,
              newBalance: newBalance,
              previousClaimed: currentClaimed,
              newClaimed: newClaimed
            });
            
            // Return updated state with reduced balance and increased claimed amount
            return {
              coffyBalance: newBalance,
              coffyClaimed: newClaimed
            };
          });
          
          return true;
        } catch (error) {
          console.error("[GameStore] Error claiming tokens:", error);
          return false;
        }
      },
      
      // Complete tutorial
      completeTutorial: () => set({ showTutorial: false }),
      
      // Restart game
      restartGame: () => get().initGame(),
    }),
    {
      name: 'coffylapse-game-storage',
      // Store crucial data
      partialize: (state) => ({
        coffyBalance: typeof state.coffyBalance === 'number' ? state.coffyBalance : 0,
        coffyClaimed: typeof state.coffyClaimed === 'number' ? state.coffyClaimed : 0,
        showTutorial: state.showTutorial,
      }),
    }
  )
);

// Helper function for generating random events
const generateRandomEvent = (get, set) => {
  const state = get();
  
  // Get game metrics for contextual events
  const gameState = {
    metrics: state.metrics,
    shopLevel: state.shopLevel,
    daysPassed: state.daysPassed,
    staff: state.staff,
    equipmentQuality: state.equipmentQuality,
    customerLoyalty: state.customerLoyalty
  };
  
  // Get a random event based on current game state
  const randomEvent = getRandomEvent(gameState);
  
  // Set the event as current scenario
  console.log("Generating random event:", randomEvent);
  set({ currentScenario: randomEvent });
};

// Add debug helpers
if (typeof window !== 'undefined') {
  window.debugCoffyStore = {
    getState: () => useGameStore.getState(),
    addTestTokens: (amount = 50) => useGameStore.getState().addTestTokens(amount),
    resetTokens: () => useGameStore.setState({ coffyBalance: 0 }),
    claimTokens: (amount) => useGameStore.getState().claimCoffyTokens(amount)
  };
}

export default useGameStore;
