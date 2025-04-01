import { useEffect, useState } from 'react';

export default function StatsTracker({ gameState, daysPassed = 0 }) {
  const [stats, setStats] = useState({
    highestMoney: 100,
    daysPlayed: 0,
    decisionsCount: 0,
    sustainablilityDecisions: 0,
  });
  
  // Track days played and decisions made
  useEffect(() => {
    setStats(prevStats => ({
      ...prevStats,
      daysPlayed: daysPassed
    }));
  }, [daysPassed]);
  
  // Track highest money achieved
  useEffect(() => {
    if (gameState.money > stats.highestMoney) {
      setStats(prevStats => ({
        ...prevStats,
        highestMoney: gameState.money
      }));
    }
  }, [gameState.money, stats.highestMoney]);
  
  // This would be called from the GameContainer when a decision is made
  const trackDecision = (choice) => {
    setStats(prevStats => {
      const newStats = {
        ...prevStats,
        decisionsCount: prevStats.decisionsCount + 1
      };
      
      if (choice.sustainability > 0) {
        newStats.sustainablilityDecisions = prevStats.sustainablilityDecisions + 1;
      }
      
      return newStats;
    });
  };
  
  return { stats, trackDecision };
}
