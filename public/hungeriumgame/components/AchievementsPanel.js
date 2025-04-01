export default function AchievementsPanel({ unlockedAchievements, allAchievements }) {
  const achievementCount = unlockedAchievements.length;
  const totalAchievements = allAchievements.length;
  const progress = Math.round((achievementCount / totalAchievements) * 100);
  
  return (
    <div className="bg-white p-5 rounded-lg mb-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-coffee-dark">Achievements</h2>
        <span className="text-sm bg-coffee-bg px-2 py-1 rounded">
          {achievementCount}/{totalAchievements}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-yellow-400 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {allAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
          
          return (
            <div 
              key={achievement.id}
              className={`
                p-3 rounded border flex flex-col items-center text-center
                ${isUnlocked ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-100 border-gray-300 opacity-75'}
              `}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3 className="font-bold text-sm">{achievement.title}</h3>
              <p className="text-xs mt-1">{achievement.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
