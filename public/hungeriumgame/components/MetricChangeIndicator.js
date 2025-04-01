import { motion } from '../utils/animationUtils';

export default function MetricChangeIndicator({ changes, isMobile = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.08
      }
    },
    exit: { opacity: 0 }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 400, damping: 20 }
    }
  };

  const getChangeIcon = (value) => {
    if (value > 0) return '↑';
    if (value < 0) return '↓';
    return '−';
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-400';
  };

  const getBackgroundGlow = (value) => {
    if (value > 0) return 'bg-gradient-to-r from-green-900/70 to-green-800/40';
    if (value < 0) return 'bg-gradient-to-r from-red-900/70 to-red-800/40';
    return 'bg-gradient-to-r from-gray-800/70 to-gray-700/40';
  };

  // Map keys to more user-friendly labels
  const metricLabels = {
    money: 'Economy',
    popularity: 'Customer',
    operations: 'Production',
    sustainability: 'Environment'
  };

  // Filter out metrics with no change
  const changedMetrics = Object.entries(changes).filter(([_, value]) => value !== 0);

  return (
    <motion.div 
      className="absolute inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.div 
        className="flex justify-center gap-2 p-2 bg-coffee-darker/90 rounded-lg shadow-xl border border-coffee-medium/30 max-w-[90%]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        {changedMetrics.map(([key, value]) => {
          // Only show the 4 main metrics
          if (!['money', 'popularity', 'operations', 'sustainability'].includes(key)) {
            return null;
          }
          
          // Format display text
          let label = metricLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
          let displayValue = value;
          if (key === 'money') {
            displayValue = value > 0 ? `+${value}` : value;
          } else {
            displayValue = `${value > 0 ? '+' : ''}${value}%`;
          }
          
          return (
            <motion.div 
              key={key} 
              className={`${getBackgroundGlow(value)} p-2 rounded-lg border border-gray-700 relative overflow-hidden`}
              variants={itemVariants}
            >
              {/* Animated glow effect */}
              <motion.div 
                className="absolute inset-0 opacity-30"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
                style={{
                  backgroundSize: '200% 200%',
                  backgroundImage: 'radial-gradient(circle, white, transparent)'
                }}
              />
              
              <div className="text-xs uppercase text-coffee-light/70 mb-1 relative z-10">{label}</div>
              <motion.div 
                className={`text-base font-bold ${getChangeColor(value)} relative z-10`}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative">
                  {displayValue}
                  <motion.span 
                    className="absolute top-0 left-0 right-0 bottom-0 bg-white mix-blend-overlay opacity-0"
                    animate={{ opacity: [0, 0.7, 0] }}
                    transition={{ duration: 1, repeat: 1 }}
                  />
                </span>
                <motion.span 
                  className="inline-block ml-1"
                  initial={{ y: 0, opacity: 1 }}
                  animate={{ 
                    y: value > 0 ? -10 : value < 0 ? 10 : 0, 
                    opacity: 0,
                    scale: 1.5
                  }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {getChangeIcon(value)}
                </motion.span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
