export const achievements = [
  {
    id: 'first_day',
    title: 'First Day',
    description: 'Complete your first day at the coffee shop',
    condition: (stats) => stats.daysPlayed >= 1,
    icon: '☕️'
  },
  {
    id: 'coffee_mogul',
    title: 'Coffee Mogul',
    description: 'Accumulate $200 in your coffee shop',
    condition: (stats) => stats.highestMoney >= 200,
    icon: '💰'
  },
  {
    id: 'people_person',
    title: 'People Person',
    description: 'Reach 75% popularity',
    condition: (gameState) => gameState.popularity >= 75,
    icon: '👥'
  },
  {
    id: 'efficiency_expert',
    title: 'Efficiency Expert',
    description: 'Reach 80% in operations',
    condition: (gameState) => gameState.operations >= 80,
    icon: '⚙️'
  },
  {
    id: 'green_thumb',
    title: 'Green Thumb',
    description: 'Make 5 sustainable choices',
    condition: (stats) => stats.sustainabilityDecisions >= 5,
    icon: '🌱'
  },
  {
    id: 'decision_maker',
    title: 'Decision Maker',
    description: 'Make 10 decisions',
    condition: (stats) => stats.decisionsCount >= 10,
    icon: '🤔'
  },
  {
    id: 'survivor',
    title: 'Survivor',
    description: 'Survive for 15 days',
    condition: (stats) => stats.daysPlayed >= 15,
    icon: '🏆'
  }
];
