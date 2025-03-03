// src/components/dashboard/SummaryStatsCard.jsx
import React, { useState } from "react";

function SummaryStatsCard({ summaryStats }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!summaryStats) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-5 animate-pulse">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historical Summary</h2>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with toggle button */}
      <div className="px-5 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Historical Summary</h2>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Stats Grid - Collapsible */}
      {!isCollapsed && (
        <div className="p-5 border-t">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Total Profit */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Total Profit</span>
              <span className={`text-2xl font-bold ${summaryStats.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summaryStats.totalProfit)}
              </span>
            </div>
            
            {/* Average Daily P/L */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Avg. Daily P/L</span>
              <span className={`text-2xl font-bold ${summaryStats.averageProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summaryStats.averageProfit)}
              </span>
            </div>
            
            {/* Trading Days */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Trading Days</span>
              <span className="text-2xl font-bold text-gray-800">{summaryStats.totalDays}</span>
            </div>
            
            {/* Win Trades */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Win Trades</span>
              <span className="text-2xl font-bold text-green-600">
                {summaryStats.totalTrades - summaryStats.lossTrades - summaryStats.breakEvenTrades}
              </span>
            </div>
            
            {/* Loss Trades */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Loss Trades</span>
              <span className="text-2xl font-bold text-red-600">{summaryStats.lossTrades}</span>
            </div>
            
            {/* Break Even Trades */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Break Even</span>
              <span className="text-2xl font-bold text-yellow-600">{summaryStats.breakEvenTrades}</span>
            </div>
            
            {/* Win Rate */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Win Rate</span>
              <span className="text-2xl font-bold text-blue-600">
                {summaryStats.totalTrades > 0 
                  ? `${Math.round((summaryStats.totalTrades - summaryStats.lossTrades - summaryStats.breakEvenTrades) / summaryStats.totalTrades * 100)}%`
                  : '0%'
                }
              </span>
            </div>
            
            {/* Total Trades */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Total Trades</span>
              <span className="text-2xl font-bold text-gray-800">{summaryStats.totalTrades}</span>
            </div>
            
            {/* Average Trades/Day */}
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Avg. Trades/Day</span>
              <span className="text-2xl font-bold text-gray-800">
                {summaryStats.totalDays > 0 
                  ? (summaryStats.totalTrades / summaryStats.totalDays).toFixed(1)
                  : '0'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryStatsCard;
