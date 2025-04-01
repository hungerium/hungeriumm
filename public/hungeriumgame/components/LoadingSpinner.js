import { motion } from '../utils/animationUtils';

export default function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  // Define size classes
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div 
        className={`${sizeClasses[size]} rounded-full border-4 border-coffee-light`}
        style={{ 
          borderTopColor: '#59331d'
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {message && <p className="mt-3 text-coffee-dark text-sm">{message}</p>}
    </div>
  );
}
