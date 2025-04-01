import { motion } from '../utils/animationUtils';

export default function ProgressTracker({ 
  shopLevel, 
  experience, 
  experienceRequired = 20, 
  levelCap = 5,
  isMobile = false
}) {
  // Calculate percentage progress to next level
  const expProgress = (experience % experienceRequired) / experienceRequired * 100;
  const isMaxLevel = shopLevel >= levelCap;

  return (
    <div className="bg-coffee-bg/40 p-2 rounded-lg border border-coffee-light/30">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium">Shop Level</span>
          <span className="ml-2 text-amber-500 font-bold">{shopLevel}</span>
          {isMaxLevel && <span className="text-xs text-gray-500 ml-1">(MAX)</span>}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
        <motion.div 
          className="bg-coffee-medium h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isMaxLevel ? '100%' : `${expProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Level up indicator */}
      {!isMaxLevel && expProgress > 80 && (
        <div className="text-center mt-1">
          <div className="text-[0.6rem] text-coffee-dark animate-pulse">Level up soon...</div>
        </div>
      )}
    </div>
  );
}
