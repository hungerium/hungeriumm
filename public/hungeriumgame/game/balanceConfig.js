/**
 * Game balance configuration
 * Controls difficulty progression, rewards, and metric impact
 */

// Token reward configuration - Reduced base and made progressive
export const TOKEN_REWARDS = {
  BASE_DECISION_REWARD: 25,        // Reduced from 50 to 25 tokens per decision
  PROGRESSIVE_MULTIPLIER: 0.05,    // Each decision increases reward by 5%
  MAX_MULTIPLIER: 2.5,             // Maximum 2.5x multiplier (25 → 62.5)
  STREAK_BONUS: 5,                 // Reduced from 10 to 5
  LEVEL_MULTIPLIER: 1.2,           // Multiplier based on shop level
  MAX_DAILY_TOKENS: 300,           // Reduced from 500 to 300 maximum
  SUSTAINABILITY_BONUS: 0.1,       // % bonus for high sustainability
  LEVEL_UP_BONUS: 200,             // Bonus tokens for leveling up
};

// Difficulty progression
export const DIFFICULTY = {
  BASE_SCENARIO_IMPACT: 8,         // Starting impact value
  SCALING_FACTOR: 0.15,            // How much impact increases per level
  MAX_IMPACT: 25,                  // Maximum impact value
  CRITICAL_THRESHOLD: 20,          // Impact value where choices become critical
  DAYS_BETWEEN_CRITICAL: 5,        // Minimum days between critical scenarios
  // Difficulty curve adjustments
  EARLY_GAME_THRESHOLD: 10,        // Days considered "early game"
  MID_GAME_THRESHOLD: 25,          // Days considered "mid game"
  EARLY_GAME_MODIFIER: 0.7,        // Reduce difficulty in early game
  LATE_GAME_MODIFIER: 1.3,         // Increase difficulty in late game
};

// Metric balance configuration - Reduced impact intensity
export const METRICS = {
  // Starting values
  INITIAL: {
    FINANCIAL: 120,                
    SATISFACTION: 70,
    STOCK: 80,
    SUSTAINABILITY: 60,
  },
  
  // Daily change rates - Reduced intensity
  DAILY_CHANGE: {
    FINANCIAL: -3,                // Reduced from -5 to -3
    SATISFACTION: -2,             // Reduced from -3 to -2
    STOCK: -3,                    // Reduced from -4 to -3
    SUSTAINABILITY: -1,           // No change (was already -2)
  },
  
  // Recovery rates - Slightly reduced
  RECOVERY_RATE: {
    FINANCIAL: 1.3,               // Reduced from 1.5 to 1.3
    SATISFACTION: 1.2,            // Reduced from 1.3 to 1.2
    STOCK: 1.1,                   // Reduced from 1.2 to 1.1
    SUSTAINABILITY: 1.0,          // Reduced from 1.1 to 1.0
  },
  
  // Dependency factors - Reduced for less amplification
  DEPENDENCIES: {
    // How satisfaction affects financial
    SATISFACTION_TO_FINANCIAL: 0.2,   // Reduced from 0.3 to 0.2
    // How sustainability affects satisfaction
    SUSTAINABILITY_TO_SATISFACTION: 0.15, // Reduced from 0.2 to 0.15
    // How stock affects satisfaction
    STOCK_TO_SATISFACTION: 0.15,     // Reduced from 0.25 to 0.15
    // How financial affects stock
    FINANCIAL_TO_STOCK: 0.1,         // Reduced from 0.15 to 0.1
  },
  
  // Metric boundaries
  MIN: 0,
  MAX: 100,
  
  // Critical thresholds where warnings should be shown
  CRITICAL_THRESHOLD: 20,
};

// Endgame configuration
export const ENDGAME = {
  UNLOCK_LEVEL: 5,                       // Level to unlock endgame
  DAYS_REQUIRED: 30,                     // Days needed to reach endgame
  MIN_METRICS: {                         // Minimum metrics needed
    FINANCIAL: 500,
    SATISFACTION: 85,
    STOCK: 80,
    SUSTAINABILITY: 75,
  },
  REWARD_MULTIPLIER: 2.5,                // Token reward multiplier for endgame
  // Add endgame goals
  GOALS: [
    {
      id: 'financial_master',
      title: 'Financial Master',
      description: 'Reach $1000 in cash reserves',
      metric: 'financial',
      target: 1000,
      reward: 500
    },
    {
      id: 'customer_favorite',
      title: 'Customer Favorite',
      description: 'Maintain 90% satisfaction for 5 days',
      metric: 'satisfaction', 
      target: 90,
      duration: 5,
      reward: 300
    },
    {
      id: 'eco_champion',
      title: 'Eco Champion',
      description: 'Reach 95% sustainability',
      metric: 'sustainability',
      target: 95,
      reward: 400
    },
    {
      id: 'coffee_empire',
      title: 'Coffee Empire',
      description: 'Run your shop for 50 days',
      metric: 'days',
      target: 50,
      reward: 1000
    }
  ]
};

// Experience points needed for each level
export const EXPERIENCE_LEVELS = {
  1: 0,
  2: 20,
  3: 50,
  4: 100,
  5: 200
};

// Helper function to calculate scenario impact based on day and shop level
export const calculateScenarioImpact = (day, shopLevel) => {
  // Reduce overall impact by ~25%
  let baseImpact = (DIFFICULTY.BASE_SCENARIO_IMPACT + 
    (day * DIFFICULTY.SCALING_FACTOR) + 
    (shopLevel * DIFFICULTY.SCALING_FACTOR * 2)) * 0.75;
  
  // Apply early/late game modifiers
  if (day <= DIFFICULTY.EARLY_GAME_THRESHOLD) {
    baseImpact *= DIFFICULTY.EARLY_GAME_MODIFIER;
  } else if (day >= DIFFICULTY.MID_GAME_THRESHOLD) {
    baseImpact *= DIFFICULTY.LATE_GAME_MODIFIER;
  }
    
  // Cap at maximum impact
  return Math.min(baseImpact, DIFFICULTY.MAX_IMPACT);
};

// Helper function to calculate token rewards - Updated for progressive reward
export const calculateTokenReward = (day, shopLevel, sustainability, decisions = 0) => {
  // Base reward
  let reward = TOKEN_REWARDS.BASE_DECISION_REWARD;
  
  // Progressive multiplier based on decisions made (5% increase per decision)
  const progressiveMultiplier = Math.min(
    1 + (decisions * TOKEN_REWARDS.PROGRESSIVE_MULTIPLIER),
    TOKEN_REWARDS.MAX_MULTIPLIER
  );
  reward *= progressiveMultiplier;
  
  // Apply level multiplier
  reward *= (1 + ((shopLevel - 1) * TOKEN_REWARDS.LEVEL_MULTIPLIER / 10));
  
  // Apply sustainability bonus
  const sustainabilityBonus = Math.max(0, sustainability - 50) / 100 * TOKEN_REWARDS.SUSTAINABILITY_BONUS;
  reward *= (1 + sustainabilityBonus);
  
  // Round to the nearest 5
  reward = Math.round(reward / 5) * 5;
  
  // Cap at maximum
  return Math.min(reward, TOKEN_REWARDS.MAX_DAILY_TOKENS);
};

// Helper to calculate experience based on actions and metrics
export const calculateExperience = (choice, metrics) => {
  // Base XP for making a decision
  let xp = 5;
  
  // Bonus XP for balanced metrics (all above threshold)
  const allMetricsHealthy = Object.values(metrics).every(value => value > METRICS.CRITICAL_THRESHOLD);
  if (allMetricsHealthy) {
    xp += 2;
  }
  
  // Bonus XP for high sustainability choices
  if (choice.sustainability > 5) {
    xp += 1;
  }
  
  return xp;
};

export default {
  TOKEN_REWARDS,
  DIFFICULTY,
  METRICS,
  ENDGAME,
  EXPERIENCE_LEVELS,
  calculateScenarioImpact,
  calculateTokenReward,
  calculateExperience
};
