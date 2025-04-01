import { useState, useEffect } from 'react';

export default function AchievementNotification({ achievement, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for fade out animation
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div 
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded shadow-lg
        transition-all duration-500 transform bg-yellow-100 border border-yellow-500
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
        max-w-sm w-full
      `}
    >
      <div className="flex items-center">
        <div className="text-3xl mr-3">{achievement.icon}</div>
        <div>
          <h3 className="font-bold text-yellow-800">{achievement.title}</h3>
          <p className="text-sm text-yellow-700">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
