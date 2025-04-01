import { useState, useEffect, useMemo } from 'react';
import { motion } from '../utils/animationUtils';

// Constants
const AVERAGE_CUSTOMER_SPEND = 4.5;
const STAFF_DAILY_COST = 5;
const EQUIPMENT_DAILY_COST_FACTOR = 2;

export default function SimulationDashboard({
  money,
  popularity,
  operations,
  sustainability,
  customerLoyalty,
  staff,
  daysPassed,
  equipmentQuality,
  isMobile = false
}) {
  const [graphData, setGraphData] = useState([]);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Calculate metrics using useMemo to avoid unnecessary recalculations
  const metrics = useMemo(() => {
    const dailyCustomers = Math.round(popularity * 0.5);
    const dailyRevenue = Math.round(dailyCustomers * AVERAGE_CUSTOMER_SPEND);
    const staffCosts = staff * STAFF_DAILY_COST;
    const equipmentCosts = Math.ceil(equipmentQuality * EQUIPMENT_DAILY_COST_FACTOR);
    const dailyCosts = staffCosts + equipmentCosts;
    
    return {
      dailyCustomers,
      dailyRevenue,
      dailyCosts,
      staffCosts,
      equipmentCosts,
      profit: dailyRevenue - dailyCosts,
      profitMargin: dailyRevenue === 0 ? 0 : Math.round((dailyRevenue - dailyCosts) / dailyRevenue * 100)
    };
  }, [popularity, staff, equipmentQuality]);
  
  // Generate simulated historical data for graphs
  useEffect(() => {
    const generateHistoricalData = () => {
      const newData = [];
      let baseValue = money * 0.5;
      const daysToShow = 14;
      
      for (let i = 0; i < daysToShow; i++) {
        // Add some randomness to historical data
        let variance = Math.random() * (money * 0.3) - (money * 0.15);
        let dayValue = Math.max(1, baseValue + variance);
        
        newData.push({
          day: Math.max(1, daysPassed - daysToShow + i),
          value: Math.round(dayValue)
        });
        
        baseValue = dayValue;
      }
      
      // Add current day
      newData.push({
        day: daysPassed,
        value: money
      });
      
      return newData;
    };
    
    setGraphData(generateHistoricalData());
  }, [money, daysPassed]);

  // Status indicators for business metrics
  const getStatusIndicator = (value) => {
    if (value > 70) return 'bg-green-500';
    if (value > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Business health assessment
  const getBusinessHealth = () => {
    if (metrics.profit > 10) return { status: 'Strong', color: 'text-green-600' };
    if (metrics.profit > 0) return { status: 'Stable', color: 'text-yellow-600' };
    return { status: 'At Risk', color: 'text-red-600' };
  };
  
  const businessHealth = getBusinessHealth();
  
  // Component for chart bars
  const ChartBar = ({ height, value, day, isLast, index }) => (
    <div className="flex flex-col items-center justify-end h-full flex-1">
      <motion.div 
        className={`w-4 bg-coffee-medium/60 rounded-t flex items-center justify-center ${isLast ? 'bg-coffee-dark/80' : ''}`}
        style={{ height: `${height}%` }}
        initial={{ height: 0 }}
        animate={{ height: `${height}%` }}
        transition={{ duration: 0.7, delay: index * 0.1 }}
      >
        {isLast && (
          <div className="absolute -top-6 text-xs font-medium">${value}</div>
        )}
      </motion.div>
      <div className="text-[0.6rem] text-gray-400 mt-1">
        Day {day}
      </div>
    </div>
  );
  
  // Component for progress bar
  const ProgressBar = ({ label, value, color }) => (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
        <div className={`${color} h-1 rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
  
  // Component for stat box
  const StatBox = ({ label, value, unit = '' }) => (
    <div className="bg-gray-50 p-2 rounded">
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="font-semibold">{value}{unit}</div>
    </div>
  );

  // Render different tab contents
  const renderSummaryTab = () => (
    <div className="p-2 sm:p-3">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-2">
        <div className={`p-2 rounded ${metrics.profit > 0 ? 'bg-green-50' : metrics.profit < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="text-gray-500">Daily Profit</div>
          <div className="font-semibold flex items-center">
            ${metrics.profit}
            {metrics.profit > 0 ? (
              <span className="text-green-500 ml-1 text-xs">↑</span>
            ) : metrics.profit < 0 ? (
              <span className="text-red-500 ml-1 text-xs">↓</span>
            ) : null}
          </div>
        </div>
        
        <div className="p-2 rounded bg-gray-50">
          <div className="text-gray-500">Customers</div>
          <div className="font-semibold">{metrics.dailyCustomers}/day</div>
        </div>
      </div>
      
      {/* Mini graph */}
      <div className="h-20 mt-3 relative">
        <div className="text-xs text-gray-500 mb-1">Revenue Trend:</div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200"></div>
        <div className="absolute inset-y-0 left-0 w-px bg-gray-200"></div>
        
        <div className="absolute inset-0 flex items-end px-px">
          {graphData.slice(-7).map((point, i, arr) => {
            const max = Math.max(...arr.map(d => d.value));
            const height = Math.max(4, (point.value / max) * 100);
            const isLast = i === arr.length - 1;
            const prevValue = i > 0 ? arr[i-1].value : point.value;
            const barColor = isLast ? 'bg-coffee-dark' : 
                        point.value > prevValue ? 'bg-green-400' : 'bg-red-400';
            
            return (
              <div key={i} className="flex flex-col items-center justify-end h-full flex-1">
                <motion.div 
                  className={`w-1 rounded-t ${barColor}`}
                  style={{ height: `${height}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="text-xs">
          <span className="text-gray-500">Daily Revenue:</span>
          <span className="font-semibold ml-1">${metrics.dailyRevenue}</span>
        </div>
        <div className="text-xs text-right">
          <span className="text-gray-500">Daily Costs:</span>
          <span className="font-semibold ml-1">${metrics.dailyCosts}</span>
        </div>
      </div>
    </div>
  );
  
  const renderChartsTab = () => {
    const last7Days = graphData.slice(-7);
    const maxValue = Math.max(...last7Days.map(d => d.value));
    
    return (
      <div className="p-2 sm:p-3">
        <div className="text-xs text-center text-gray-500 mb-2">
          Business Performance (Last 7 Days)
        </div>
        
        <div className="h-28 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200"></div>
          <div className="absolute inset-y-0 left-0 w-px bg-gray-200"></div>
          
          <div className="absolute top-0 left-0 text-[0.6rem] text-gray-400">
            ${maxValue}
          </div>
          
          <div className="absolute bottom-0 left-0 text-[0.6rem] text-gray-400">
            $0
          </div>
          
          <div className="absolute inset-0 flex items-end px-4 pt-4">
            {last7Days.map((point, i) => {
              const height = Math.max(4, (point.value / maxValue) * 100);
              return (
                <ChartBar 
                  key={i}
                  height={height}
                  value={point.value}
                  day={point.day}
                  isLast={i === last7Days.length - 1}
                  index={i}
                />
              );
            })}
          </div>
        </div>
        
        <div className="mt-3">
          <div className="text-xs text-center text-gray-500 mb-2">
            Performance Metrics
          </div>
          
          <div className="space-y-2">
            <ProgressBar label="Popularity" value={popularity} color="bg-amber-400" />
            <ProgressBar label="Operations" value={operations} color="bg-blue-400" />
            <ProgressBar label="Sustainability" value={sustainability} color="bg-green-400" />
            <ProgressBar label="Customer Loyalty" value={customerLoyalty} color="bg-purple-400" />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStatsTab = () => (
    <div className="p-2 sm:p-3">
      <div className="grid grid-cols-2 gap-2">
        <StatBox label="Staff Members" value={staff} />
        <StatBox label="Equipment Quality" value={`${equipmentQuality}/10`} />
        <StatBox label="Daily Staff Cost" value={`$${metrics.staffCosts}`} />
        <StatBox label="Daily Operating Cost" value={`$${metrics.equipmentCosts}`} />
      </div>
      
      <div className="mt-3">
        <div className="text-xs text-gray-500 mb-2">Business Summary</div>
        
        <div className="bg-gray-50 p-2 rounded space-y-1">
          <div className="flex justify-between">
            <span className="text-xs">Total Days:</span>
            <span className="font-medium">{daysPassed}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs">Avg. Customer Spend:</span>
            <span className="font-medium">${AVERAGE_CUSTOMER_SPEND.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs">Profit Margin:</span>
            <span className="font-medium">{metrics.profitMargin}%</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-xs">Business Health:</span>
            <span className={`font-medium ${businessHealth.color}`}>
              {businessHealth.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div 
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-md overflow-hidden ${isMobile ? 'text-xs' : 'text-sm'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-coffee-medium/30 to-coffee-light/30 p-2 flex justify-between items-center border-b border-coffee-light">
        <h3 className="font-medium text-coffee-dark flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Business Dashboard
        </h3>
        <div className="text-xs text-coffee-dark/70">Day {daysPassed}</div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200">
        {['summary', 'charts', 'stats'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-3 text-xs font-medium ${activeTab === tab ? 'bg-coffee-bg text-coffee-dark' : 'text-gray-500'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      {activeTab === 'summary' && renderSummaryTab()}
      {activeTab === 'charts' && renderChartsTab()}
      {activeTab === 'stats' && renderStatsTab()}
      
      {/* Status indicators footer */}
      <div className="p-2 border-t border-gray-200 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {[
          { label: 'Operations', value: operations },
          { label: 'Sustainability', value: sustainability },
          { label: 'Loyalty', value: customerLoyalty }
        ].map((item) => (
          <div key={item.label} className="flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusIndicator(item.value)}`}></span>
            <span className="text-xs text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}