import { useState } from 'react';
import { motion } from '../utils/animationUtils';

export default function StaffManagement({ 
  staff = 3, 
  money = 100, 
  onUpdateStaff, 
  onClose 
}) {
  const [currentStaff, setCurrentStaff] = useState(staff);
  const [selectedStaffType, setSelectedStaffType] = useState(null);
  
  const staffTypes = [
    { 
      id: 'barista', 
      title: 'Barista',
      description: 'Expert in coffee preparation',
      hourlyCost: 12,
      impact: {
        operations: 10,
        popularity: 5,
        sustainability: 0
      },
      icon: '☕' 
    },
    {
      id: 'manager',
      title: 'Manager',
      description: 'Improves operational efficiency',
      hourlyCost: 18,
      impact: {
        operations: 15,
        popularity: 2,
        sustainability: 5
      },
      icon: '📋'
    },
    {
      id: 'cleaner',
      title: 'Cleaner',
      description: 'Maintains shop hygiene',
      hourlyCost: 10,
      impact: {
        operations: 5,
        popularity: 3,
        sustainability: 8
      },
      icon: '🧹'
    },
    {
      id: 'greeter',
      title: 'Greeter',
      description: 'Welcomes customers and improves experience',
      hourlyCost: 11,
      impact: {
        operations: 2,
        popularity: 12,
        sustainability: 0
      },
      icon: '👋'
    }
  ];
  
  const handleHire = (type) => {
    if (canAffordStaff(type)) {
      setCurrentStaff(currentStaff + 1);
      onUpdateStaff({
        staff: currentStaff + 1,
        staffType: type,
        cost: -(type.hourlyCost * 8) // Daily cost
      });
    }
  };
  
  const handleFire = () => {
    if (currentStaff > 1) { // Always keep at least one staff member
      setCurrentStaff(currentStaff - 1);
      onUpdateStaff({
        staff: currentStaff - 1,
        staffType: null,
        cost: 0
      });
    }
  };
  
  const canAffordStaff = (type) => {
    return money >= type.hourlyCost * 8; // Can afford a day's salary
  };
  
  const getDailyCost = () => {
    return currentStaff * 12 * 8; // Average hourly cost * 8 hours
  };
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="bg-gradient-to-r from-coffee-medium to-coffee-dark text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Staff Management</h2>
            <p className="text-sm text-coffee-light">Current Staff: {currentStaff}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-coffee-dark hover:bg-coffee-darker rounded-full p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between p-3 bg-coffee-bg rounded-lg mb-4">
          <div>
            <p className="text-sm font-medium">Daily Staff Cost</p>
            <p className="text-lg font-bold text-coffee-dark">${getDailyCost()}</p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              onClick={handleFire}
              disabled={currentStaff <= 1}
              className={`p-2 rounded-full ${currentStaff <= 1 ? 'bg-gray-200 text-gray-400' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
              whileHover={currentStaff > 1 ? { scale: 1.05 } : {}}
              whileTap={currentStaff > 1 ? { scale: 0.95 } : {}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </motion.button>
          </div>
        </div>
        
        <h3 className="font-medium text-coffee-dark mb-2">Hire Staff</h3>
        <div className="space-y-3">
          {staffTypes.map(type => {
            const affordable = canAffordStaff(type);
            
            return (
              <motion.div
                key={type.id}
                className={`border rounded-lg p-3 ${affordable ? 'hover:border-coffee-medium cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                onClick={() => affordable && setSelectedStaffType(type)}
                whileHover={affordable ? { scale: 1.01 } : {}}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <h4 className="font-medium">{type.title}</h4>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">${type.hourlyCost}/hr</p>
                    <p className="text-xs text-gray-500">${type.hourlyCost * 8}/day</p>
                  </div>
                </div>
                
                {selectedStaffType?.id === type.id && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {Object.entries(type.impact).map(([stat, value]) => (
                        value > 0 && (
                          <div key={stat} className="text-center">
                            <p className="text-xs text-gray-500">{stat.charAt(0).toUpperCase() + stat.slice(1)}</p>
                            <p className="text-sm font-medium text-green-600">+{value}</p>
                          </div>
                        )
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <motion.button
                        onClick={() => handleHire(type)}
                        disabled={!affordable}
                        className="bg-coffee-dark text-white px-3 py-1 rounded text-sm"
                        whileHover={affordable ? { scale: 1.05 } : {}}
                        whileTap={affordable ? { scale: 0.95 } : {}}
                      >
                        Hire
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
