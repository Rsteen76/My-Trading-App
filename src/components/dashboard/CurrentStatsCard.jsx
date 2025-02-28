// In components/dashboard/CurrentStatsCard.jsx

import React, { useState } from "react";

function CurrentStatsCard({
  balance,
  contractsForTrade,
  tradesToday,
  tradesPerDay,
  stopLossRemaining,
  isFixedStop
}) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default

  // Calculate day stats
  const completedTrades = tradesToday.filter(trade => trade !== null);
  const winTrades = completedTrades.filter(trade => trade?.outcome === "win").length;
  const lossTrades = completedTrades.filter(trade => trade?.outcome === "loss").length;
  const breakEvenTrades = completedTrades.filter(trade => trade?.outcome === "breakEven").length;
  
  // Calculate day profit
  const dayProfit = completedTrades.reduce((sum, trade) => {
    if (!trade) return sum;
    if (trade.profit) return sum + trade.profit;
    if (trade.loss) return sum - trade.loss;
    return sum;
  }, 0);

  // Calculate win rate
  const totalCompletedTrades = winTrades + lossTrades + breakEvenTrades;
  const winRate = totalCompletedTrades > 0 
    ? ((winTrades / totalCompletedTrades) * 100).toFixed(1) 
    : "0.0";

  // Stat item component for consistent styling
  const StatItem = ({ label, value, textColor = "text-gray-800" }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
      <div className="text-sm text-gray-500 font-medium mb-1">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold ${textColor}`}>{value}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Current Day Stats</h2>
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl">
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {/* Always visible summary - key metrics */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <StatItem 
          label="Account Balance" 
          value={`$${balance.toFixed(2)}`}
          textColor="text-blue-600"
        />
        <StatItem 
          label="Today's P/L" 
          value={`${dayProfit >= 0 ? '+$' : '-$'}${Math.abs(dayProfit).toFixed(2)}`}
          textColor={dayProfit >= 0 ? "text-green-500" : "text-red-500"}
        />
      </div>
      
      {/* Collapsible detailed stats */}
      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300">
          <StatItem 
            label="Contracts Per Trade" 
            value={contractsForTrade}
            textColor="text-blue-600"
          />
          {isFixedStop ? (
            <StatItem 
              label="Stop Loss Remaining" 
              value={`$${stopLossRemaining.toFixed(2)}`}
              textColor={stopLossRemaining > 0 ? "text-blue-600" : "text-red-500"}
            />
          ) : (
            <StatItem 
              label="Trades Remaining" 
              value={`${tradesPerDay - completedTrades.length} / ${tradesPerDay}`}
              textColor="text-blue-600"
            />
          )}
          <StatItem 
            label="Wins Today" 
            value={winTrades}
            textColor="text-green-500"
          />
          <StatItem 
            label="Losses Today" 
            value={lossTrades}
            textColor="text-red-500"
          />
          
          <StatItem 
            label="Break Even" 
            value={breakEvenTrades}
            textColor="text-yellow-500"
          />
          <StatItem 
            label="Total Trades" 
            value={totalCompletedTrades}
            textColor="text-blue-600"
          />
          <div className="col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
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
      )}
    </div>
  );
}

export default CurrentStatsCard;
