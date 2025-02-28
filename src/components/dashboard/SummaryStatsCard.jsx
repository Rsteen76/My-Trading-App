// In components/dashboard/SummaryStatsCard.jsx

import React, { useState } from "react";

function SummaryStatsCard({ summaryStats }) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default

  if (!summaryStats) return null;

  // Calculate win rate percentage
  const winTrades = summaryStats.totalTrades - summaryStats.breakEvenTrades - summaryStats.lossTrades || 0;
  const lossTrades = summaryStats.lossTrades || 0;
  const winRate = summaryStats.totalTrades > 0 
    ? ((winTrades / summaryStats.totalTrades) * 100).toFixed(1) 
    : "0.0";
    
  // Calculate average trades per day
  const avgTradesPerDay = summaryStats.totalDays > 0
    ? (summaryStats.totalTrades / summaryStats.totalDays).toFixed(1)
    : "0.0";

  // Stat item component for consistent styling
  const StatItem = ({ label, value, textColor = "text-gray-800" }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
      <div className="text-sm text-gray-500 font-medium mb-1">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold ${textColor}`}>{value}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Summary Statistics</h2>
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {/* Always visible summary - key metrics */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <StatItem 
          label="Total P/L" 
          value={`${summaryStats.totalProfit >= 0 ? '+$' : '-$'}${Math.abs(summaryStats.totalProfit).toFixed(2)}`}
          textColor={summaryStats.totalProfit >= 0 ? "text-green-500" : "text-red-500"}
        />
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 font-medium mb-2">Win Rate</div>
          <div className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-gray-800 mr-4">{winRate}%</span>
            <div className="flex-grow bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Collapsible detailed stats */}
      {isExpanded && (
        <div className="grid grid-cols-1 gap-6 mt-4">
          {/* Profit & Loss Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Profit & Loss</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <StatItem 
                label="Avg Daily P/L" 
                value={`${summaryStats.averageProfit >= 0 ? '+$' : '-$'}${Math.abs(summaryStats.averageProfit).toFixed(2)}`}
                textColor={summaryStats.averageProfit >= 0 ? "text-green-500" : "text-red-500"}
              />
              <StatItem 
                label="Trading Days" 
                value={summaryStats.totalDays}
                textColor="text-blue-600"
              />
            </div>
          </div>
          
          {/* Trade Statistics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Trade Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatItem 
                label="Wins" 
                value={winTrades}
                textColor="text-green-500"
              />
              <StatItem 
                label="Losses" 
                value={lossTrades}
                textColor="text-red-500"
              />
              <StatItem 
                label="Break Even" 
                value={summaryStats.breakEvenTrades || 0}
                textColor="text-yellow-500"
              />
              <StatItem 
                label="Total Trades" 
                value={summaryStats.totalTrades}
                textColor="text-blue-600"
              />
              <StatItem 
                label="Avg Trades/Day" 
                value={avgTradesPerDay}
                textColor="text-blue-600"
              />
              <StatItem 
                label="Avg Win Rate" 
                value={`${winRate}%`}
                textColor="text-blue-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryStatsCard;
