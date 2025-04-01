import { motion } from '../utils/animationUtils';

export default function SimpleDashboard({ 
  money,
  popularity,
  operations,
  sustainability,
  isMobile = false
}) {
  // Get color based on value
  const getColor = (value) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get emoji for each metric
  const getEmoji = (metric) => {
    switch(metric) {
      case 'money': return '💰';
      case 'popularity': return '😊';
      case 'operations': return '⚙️';
      case 'sustainability': return '🌱';
      default: return '📊';
    }
  };

  // Format metrics for display
  const metrics = [
    { name: 'Economy', value: money, key: 'money', color: getColor(money) },
    { name: 'Customer', value: popularity, key: 'popularity', color: getColor(popularity) },
    { name: 'Production', value: operations, key: 'operations', color: getColor(operations) },
    { name: 'Environment', value: sustainability, key: 'sustainability', color: getColor(sustainability) }
  ];

  return (
    <motion.div 
      className="dashboard-container bg-coffee-dark/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-coffee-medium/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Horizontal layout for all screens */}
      <div className="p-2 grid grid-cols-4 gap-2">
        {metrics.map((metric) => (
          <div key={metric.key} className="text-center">
            <div className="flex items-center justify-center mb-1">
              <span className="mr-1">{getEmoji(metric.key)}</span>
              <span className="text-xs font-medium text-coffee-light">{metric.name}</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-2 bg-coffee-darker rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${metric.color}`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
