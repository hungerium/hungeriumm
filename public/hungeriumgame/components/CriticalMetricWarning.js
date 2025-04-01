import { motion } from '../utils/animationUtils';
import TouchFeedback from './TouchFeedback';

export default function CriticalMetricWarning({ metric, value, threshold = 20, onClose, onAction }) {
  // Map metric keys to user-friendly names and icons
  const metricInfo = {
    financial: { name: 'Economy', icon: '💰', color: 'red-600', action: 'Adjust your pricing' },
    satisfaction: { name: 'Customer Satisfaction', icon: '😢', color: 'orange-600', action: 'Improve your service' },
    stock: { name: 'Operations', icon: '⚙️', color: 'amber-600', action: 'Optimize your supply chain' },
    sustainability: { name: 'Sustainability', icon: '🌱', color: 'green-600', action: 'Make eco-friendly choices' }
  };
  
  const info = metricInfo[metric] || { 
    name: 'Critical Metric', 
    icon: '⚠️', 
    color: 'red-600',
    action: 'Take action now'
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-xl max-w-sm w-full"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className={`bg-${info.color} bg-opacity-90 p-4 text-white`}>
          <div className="flex items-center">
            <span className="text-2xl mr-3">{info.icon}</span>
            <h2 className="text-lg font-bold">Critical Warning</h2>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-bold mb-1 text-gray-800">
              Low {info.name}: {value}%
            </h3>
            <p className="text-gray-600">
              Your {info.name.toLowerCase()} is dangerously low and could lead to business failure.
            </p>
          </div>
          
          <div className="mb-5">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${info.color} rounded-full`}
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-red-600">Critical</span>
              <span className="text-amber-600">Warning</span>
              <span className="text-green-600">Good</span>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="font-medium mb-1 text-amber-800">Recommended Action:</div>
            <p className="text-sm text-amber-700">
              {info.action} in your upcoming decisions to improve this metric.
            </p>
          </div>
        </div>
        
        <div className="flex p-4 bg-gray-50 border-t border-gray-200">
          <TouchFeedback className="flex-1 mr-2">
            <button 
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium"
              onClick={onClose}
            >
              I Understand
            </button>
          </TouchFeedback>
          
          <TouchFeedback className="flex-1">
            <button 
              className="w-full py-2 px-4 bg-coffee-dark hover:bg-coffee-darker text-white rounded-lg font-medium"
              onClick={() => {
                if (onAction) onAction();
                onClose();
              }}
            >
              Show Tips
            </button>
          </TouchFeedback>
        </div>
      </motion.div>
    </motion.div>
  );
}
