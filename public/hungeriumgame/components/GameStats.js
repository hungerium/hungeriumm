export default function GameStats({ stats }) {
  return (
    <div className="bg-white p-5 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-coffee-dark">Game Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-coffee-bg rounded">
          <p className="font-medium">Days Played</p>
          <p className="text-2xl font-bold">{stats.daysPlayed}</p>
        </div>
        
        <div className="p-3 bg-coffee-bg rounded">
          <p className="font-medium">Highest Money</p>
          <p className="text-2xl font-bold">${stats.highestMoney}</p>
        </div>
        
        <div className="p-3 bg-coffee-bg rounded">
          <p className="font-medium">Decisions Made</p>
          <p className="text-2xl font-bold">{stats.decisionsCount}</p>
        </div>
        
        <div className="p-3 bg-coffee-bg rounded">
          <p className="font-medium">Sustainable Choices</p>
          <p className="text-2xl font-bold">{stats.sustainablilityDecisions}</p>
        </div>
      </div>
    </div>
  );
}
