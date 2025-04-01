export const dailyChallenges = [
  {
    id: 1,
    title: "Eco-friendly Day",
    description: "Make at least 2 sustainable choices today",
    reward: {
      money: 20,
      sustainability: 10
    },
    checkCompletion: (stats, previousStats) => {
      return stats.sustainabilityDecisions - previousStats.sustainabilityDecisions >= 2;
    }
  },
  {
    id: 2,
    title: "Customer Focus",
    description: "Increase popularity by at least 15 points",
    reward: {
      money: 15,
      popularity: 5
    },
    checkCompletion: (gameState, previousState) => {
      return gameState.popularity - previousState.popularity >= 15;
    }
  },
  {
    id: 3,
    title: "Efficiency Drive",
    description: "Improve operations by at least 10 points",
    reward: {
      money: 10,
      operations: 10
    },
    checkCompletion: (gameState, previousState) => {
      return gameState.operations - previousState.operations >= 10;
    }
  },
  {
    id: 4,
    title: "Profit Margins",
    description: "Earn at least 30 money in a single day",
    reward: {
      money: 15,
      operations: 5
    },
    checkCompletion: (gameState, previousState) => {
      return gameState.money - previousState.money >= 30;
    }
  }
];
