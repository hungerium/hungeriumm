import { useState } from 'react';
import { motion } from '../utils/animationUtils';
import { ENDGAME } from '../game/balanceConfig';
import TouchFeedback from './TouchFeedback';

export default function EndgameModal({ 
  isOpen, 
  onClose, 
  progress, 
  goals,
  onClaimReward 
}) {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  if (!isOpen) return null;
  
  // Calculate overall progress
  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;
  const progressPercentage = Math.round((completedGoals / totalGoals) * 100);
  const allCompleted = completedGoals === totalGoals;
  
  // Calculate total reward
  const totalReward = ENDGAME.GOALS.reduce((sum, goal) => {
    const matchingGoal = goals.find(g => g.id === goal.id);
    return matchingGoal && matchingGoal.completed ? sum + goal.reward : sum;
  }, 0);
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        className="bg-white rounded-xl overflow-hidden shadow-xl max-w-lg w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Coffee Empire Challenge
            </h2>
            <TouchFeedback onTap={onClose}>
              <button className="rounded-full p-1 hover:bg-black/20">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </TouchFeedback>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          <TouchFeedback>
            <button 
              className={`px-4 py-2 font-medium text-sm ${selectedTab === 'overview' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('overview')}
            >
              Overview
            </button>
          </TouchFeedback>
          <TouchFeedback>
            <button 
              className={`px-4 py-2 font-medium text-sm ${selectedTab === 'goals' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('goals')}
            >
              Goals
            </button>
          </TouchFeedback>
          <TouchFeedback>
            <button 
              className={`px-4 py-2 font-medium text-sm ${selectedTab === 'rewards' ? 'border-b-2 border-amber-600 text-amber-700' : 'text-gray-500'}`}
              onClick={() => setSelectedTab('rewards')}
            >
              Rewards
            </button>
          </TouchFeedback>
        </div>
        
        {/* Tab content */}
        <div className="p-4">
          {selectedTab === 'overview' && (
            <div>
              <div className="mb-4 text-center">
                <div className="text-lg font-medium mb-1">Your Progress</div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {completedGoals} of {totalGoals} goals completed ({progressPercentage}%)
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-amber-600 mr-2">🏆</span>
                  <span className="font-medium">Endgame Challenge</span>
                </div>
                <p className="text-sm text-gray-700">
                  Build a successful coffee empire! Complete all the goals to prove your mastery
                  of coffee shop management and earn substantial COFFY token rewards.
                </p>
              </div>
              
              {allCompleted ? (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200 mb-4 text-center">
                  <div className="text-xl font-bold text-green-700 mb-2">🎉 Congratulations! 🎉</div>
                  <p className="text-sm text-gray-700 mb-3">
                    You've successfully completed all Coffee Empire challenges!
                  </p>
                  <div className="text-center">
                    <TouchFeedback>
                      <button 
                        onClick={() => onClaimReward(totalReward)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                      >
                        Claim {totalReward} COFFY Tokens
                      </button>
                    </TouchFeedback>
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-600">
                  Complete all goals to earn the final reward!
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'goals' && (
            <div className="space-y-3">
              {goals.map((goal, index) => {
                const goalConfig = ENDGAME.GOALS.find(g => g.id === goal.id);
                return (
                  <div 
                    key={goal.id} 
                    className={`p-3 rounded-lg border ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${goal.completed ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                          {goal.completed ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-xs text-gray-600">{goal.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {goal.currentValue} / {goal.targetValue}
                        </div>
                        {goalConfig && (
                          <div className="text-xs text-amber-600">
                            +{goalConfig.reward} COFFY
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${goal.completed ? 'bg-green-600' : 'bg-amber-500'}`}
                        style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedTab === 'rewards' && (
            <div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 mb-4">
                <h3 className="font-medium mb-1">Total Rewards Available</h3>
                <div className="text-2xl font-bold text-amber-600 mb-2">
                  {ENDGAME.GOALS.reduce((sum, goal) => sum + goal.reward, 0)} COFFY
                </div>
                <p className="text-sm text-gray-700">
                  You can claim rewards for individual completed goals, or 
                  complete all goals for a bonus multiplier!
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Goal Rewards</h3>
                <div className="space-y-2">
                  {ENDGAME.GOALS.map(goal => {
                    const goalProgress = goals.find(g => g.id === goal.id);
                    const isCompleted = goalProgress?.completed || false;
                    
                    return (
                      <div key={goal.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className="text-sm">{goal.title}</span>
                        </div>
                        <div className={`text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                          {goal.reward} COFFY
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h3 className="font-medium mb-1">Completion Bonus</h3>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Complete all goals</span>
                  <span className="text-sm font-medium text-amber-600">+500 COFFY</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <TouchFeedback>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium mr-2"
            >
              Close
            </button>
          </TouchFeedback>
          
          {allCompleted && (
            <TouchFeedback>
              <button 
                onClick={() => onClaimReward(totalReward)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium"
              >
                Claim Reward
              </button>
            </TouchFeedback>
          )}
        </div>
      </motion.div>
    </div>
  );
}
