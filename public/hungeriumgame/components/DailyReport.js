import { motion } from '../utils/animationUtils';

export default function DailyReport({ 
  dayNumber, 
  income, 
  expenses, 
  customerCount, 
  popularItems = [],
  onClose
}) {
  const netProfit = income - expenses;
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Day {dayNumber} Report</h2>
          <button 
            onClick={onClose}
            className="bg-amber-800 hover:bg-amber-900 rounded-full p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-coffee-bg rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-xl font-bold text-coffee-dark">${income.toFixed(2)}</p>
          </div>
          
          <div className="p-3 bg-coffee-bg rounded-lg text-center">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-xl font-bold text-coffee-dark">${expenses.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="p-3 bg-coffee-bg rounded-lg text-center mb-4">
          <p className="text-sm text-gray-600">Net Profit</p>
          <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netProfit.toFixed(2)}
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium text-coffee-dark mb-2">Customer Overview</h3>
          <div className="p-3 bg-coffee-bg rounded-lg">
            <div className="flex justify-between items-center">
              <p>Total Customers</p>
              <p className="font-bold">{customerCount}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p>Average Spend</p>
              <p className="font-bold">${(income / customerCount).toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {popularItems.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-coffee-dark mb-2">Popular Items</h3>
            <div className="p-3 bg-coffee-bg rounded-lg">
              {popularItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-1">
                  <p>{item.name}</p>
                  <p className="font-medium">{item.sales} sold</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-4">
          <motion.button
            onClick={onClose}
            className="bg-coffee-dark text-white px-4 py-2 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
