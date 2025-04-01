import { ENDGAME } from './balanceConfig';

/**
 * Manages endgame progression and rewards
 */
export class EndgameManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.endgameUnlocked = false;
    this.endgameCompleted = false;
    this.endgameProgress = 0;
    this.endgameGoals = [];
    
    // Initialize with current game state
    this.checkEndgameUnlock();
  }
  
  // Check if endgame should be unlocked
  checkEndgameUnlock() {
    const { shopLevel, daysPassed } = this.gameState;
    
    // Basic criteria: shop level and days played
    if (shopLevel >= ENDGAME.UNLOCK_LEVEL && daysPassed >= ENDGAME.DAYS_REQUIRED) {
      this.endgameUnlocked = true;
      this.generateEndgameGoals();
      return true;
    }
    
    return false;
  }
  
  // Generate endgame goals based on current game state
  generateEndgameGoals() {
    const { metrics } = this.gameState;
    
    // Create challenging but achievable goals
    this.endgameGoals = [
      {
        id: 'financial_mastery',
        title: 'Financial Mastery',
        description: 'Reach $1,000 in cash reserves',
        targetValue: 1000,
        currentValue: metrics.financial,
        type: 'financial',
        completed: metrics.financial >= 1000
      },
      {
        id: 'customer_loyalty',
        title: 'Customer Loyalty',
        description: 'Maintain 90% customer satisfaction for 5 consecutive days',
        targetValue: 5,
        currentValue: 0, // Days with 90%+ satisfaction
        type: 'satisfaction',
        completed: false
      },
      {
        id: 'sustainability_champion',
        title: 'Sustainability Champion',
        description: 'Reach 95% sustainability rating',
        targetValue: 95,
        currentValue: metrics.sustainability,
        type: 'sustainability',
        completed: metrics.sustainability >= 95
      },
      {
        id: 'coffee_empire',
        title: 'Coffee Empire',
        description: 'Successfully operate for 50 days',
        targetValue: 50,
        currentValue: this.gameState.daysPassed,
        type: 'longevity',
        completed: this.gameState.daysPassed >= 50
      }
    ];
  }
  
  // Update endgame progress based on current game state
  updateEndgameProgress(gameState) {
    if (!this.endgameUnlocked) {
      // Check if we should unlock endgame now
      if (this.checkEndgameUnlock()) {
        return {
          endgameUnlocked: true,
          goals: this.endgameGoals
        };
      }
      return null;
    }
    
    // Update current game state
    this.gameState = gameState;
    
    // Update goals progress
    this.endgameGoals.forEach(goal => {
      switch (goal.type) {
        case 'financial':
          goal.currentValue = this.gameState.metrics.financial;
          goal.completed = goal.currentValue >= goal.targetValue;
          break;
        case 'satisfaction':
          if (this.gameState.metrics.satisfaction >= 90) {
            goal.currentValue++;
          } else {
            goal.currentValue = 0; // Reset streak if satisfaction drops
          }
          goal.completed = goal.currentValue >= goal.targetValue;
          break;
        case 'sustainability':
          goal.currentValue = this.gameState.metrics.sustainability;
          goal.completed = goal.currentValue >= goal.targetValue;
          break;
        case 'longevity':
          goal.currentValue = this.gameState.daysPassed;
          goal.completed = goal.currentValue >= goal.targetValue;
          break;
      }
    });
    
    // Calculate overall progress
    const completedGoals = this.endgameGoals.filter(g => g.completed).length;
    this.endgameProgress = completedGoals / this.endgameGoals.length;
    
    // Check if all goals are completed
    const allCompleted = this.endgameGoals.every(g => g.completed);
    if (allCompleted && !this.endgameCompleted) {
      this.endgameCompleted = true;
      return {
        endgameCompleted: true,
        tokenReward: this.calculateEndgameReward(),
        goals: this.endgameGoals
      };
    }
    
    return {
      progress: this.endgameProgress,
      goals: this.endgameGoals
    };
  }
  
  // Calculate reward for completing endgame
  calculateEndgameReward() {
    // Base reward is 1000 tokens
    let reward = 1000;
    
    // Add bonus based on how efficiently goals were completed
    const efficiency = Math.max(0, 60 - (this.gameState.daysPassed - ENDGAME.DAYS_REQUIRED));
    reward += efficiency * 10;
    
    // Add bonus for each metric above minimum
    Object.entries(ENDGAME.MIN_METRICS).forEach(([metric, minValue]) => {
      const currentValue = this.gameState.metrics[metric.toLowerCase()];
      if (currentValue > minValue) {
        reward += (currentValue - minValue) * 2;
      }
    });
    
    // Apply endgame reward multiplier
    reward *= ENDGAME.REWARD_MULTIPLIER;
    
    // Round to nearest 50
    return Math.round(reward / 50) * 50;
  }
  
  // Get current endgame status
  getStatus() {
    return {
      unlocked: this.endgameUnlocked,
      completed: this.endgameCompleted,
      progress: this.endgameProgress,
      goals: this.endgameGoals
    };
  }
}

export default EndgameManager;
