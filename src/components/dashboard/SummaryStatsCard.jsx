// In components/dashboard/SummaryStatsCard.jsx

import React from "react";

function SummaryStatsCard({ summaryStats }) {
  if (!summaryStats) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Summary Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-gray-500 font-medium">Total Profit/Loss</h3>
          <p className={`text-2xl font-bold ${
            summaryStats.totalProfit >= 0 ? "text-green-500" : "text-red-500"
          }`}>
            ${summaryStats.totalProfit.toFixed(2)}
          </p>
        </div>
        
        <div>
          <h3 className="text-gray-500 font-medium">Average Daily P/L</h3>
          <p className={`text-2xl font-bold ${
            summaryStats.averageProfit >= 0 ? "text-green-500" : "text-red-500"
          }`}>
            ${summaryStats.averageProfit.toFixed(2)}
          </p>
        </div>
        
        <div>
          <h3 className="text-gray-500 font-medium">Total Trades</h3>
          <p className="text-2xl font-bold">{summaryStats.totalTrades}</p>
        </div>
        
        <div>
          <h3 className="text-gray-500 font-medium">Break Even Trades</h3>
          <p className="text-2xl font-bold text-yellow-500">
            {summaryStats.breakEvenTrades || 0}
          </p>
        </div>
        
        <div>
          <h3 className="text-gray-500 font-medium">Trading Days</h3>
          <p className="text-2xl font-bold">{summaryStats.totalDays}</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryStatsCard;
