import { useState, useEffect, useCallback } from 'react';
import { achievements } from '../data/achievements';
import AchievementNotification from '../components/AchievementNotification';

export default function useAchievements(gameState, stats) {
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  
  // Check for new achievements whenever game state changes
  useEffect(() => {
    checkAchievements();
  }, [gameState, stats]);
  
  const checkAchievements = useCallback(() => {
    achievements.forEach(achievement => {
      // Skip already unlocked achievements
      if (unlockedAchievements.some(a => a.id === achievement.id)) {
        return;
      }
      
      // Check if achievement condition is met
      const conditionMet = achievement.condition(stats, gameState);
      
      if (conditionMet) {
        // Add to unlocked achievements
        setUnlockedAchievements(prev => [...prev, achievement]);
        setNewAchievement(achievement);
        
        // Save to localStorage
        const savedAchievements = JSON.parse(localStorage.getItem('coffylapse_achievements') || '[]');
        if (!savedAchievements.includes(achievement.id)) {
          localStorage.setItem(
            'coffylapse_achievements', 
            JSON.stringify([...savedAchievements, achievement.id])
          );
        }
      }
    });
  }, [gameState, stats, unlockedAchievements]);
  
  // Load unlocked achievements from localStorage on init
  useEffect(() => {
    const savedAchievementIds = JSON.parse(localStorage.getItem('coffylapse_achievements') || '[]');
    if (savedAchievementIds.length > 0) {
      const savedAchievements = achievements.filter(a => savedAchievementIds.includes(a.id));
      setUnlockedAchievements(savedAchievements);
    }
  }, []);
  
  const clearNewAchievement = useCallback(() => {
    setNewAchievement(null);
  }, []);
  
  return {
    allAchievements: achievements,
    unlockedAchievements,
    newAchievementElement: newAchievement ? (
      <AchievementNotification 
        achievement={newAchievement}
        onClose={clearNewAchievement}
      />
    ) : null
  };
}
