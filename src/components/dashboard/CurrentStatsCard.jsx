// In components/dashboard/CurrentStatsCard.jsx

import React, { useState, useRef } from "react";

function CurrentStatsCard({
  balance,
  contractsForTrade,
  tradesToday,
  tradesPerDay,
  stopLossRemaining,
  isFixedStop
}) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  // Prepare all stats for collapsed view
  const allStats = [
    {
      label: "Account Balance",
      value: `$${balance.toFixed(2)}`,
      textColor: "text-blue-600"
    },
    {
      label: "Today's P/L",
      value: `${dayProfit >= 0 ? '+$' : '-$'}${Math.abs(dayProfit).toFixed(2)}`,
      textColor: dayProfit >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      label: "Contracts Per Trade",
      value: contractsForTrade,
      textColor: "text-blue-600"
    },
    isFixedStop ? {
      label: "Stop Loss Remaining",
      value: `$${stopLossRemaining.toFixed(2)}`,
      textColor: stopLossRemaining > 0 ? "text-blue-600" : "text-red-500"
    } : {
      label: "Trades Remaining",
      value: `${tradesPerDay - completedTrades.length} / ${tradesPerDay}`,
      textColor: "text-blue-600"
    },
    {
      label: "Wins Today",
      value: winTrades,
      textColor: "text-green-500"
    },
    {
      label: "Losses Today",
      value: lossTrades,
      textColor: "text-red-500"
    },
    {
      label: "Break Even",
      value: breakEvenTrades,
      textColor: "text-yellow-500"
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      textColor: "text-blue-600"
    }
  ];

  // Calculate total pages
  React.useEffect(() => {
    setTotalPages(Math.ceil(allStats.length / 2));
  }, [allStats.length]);

  // Handle page navigation
  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Stat item component for consistent styling
  const StatItem = ({ label, value, textColor = "text-gray-800" }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm flex-1 min-w-0">
      <div className="text-sm text-gray-500 font-medium mb-1">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold ${textColor} truncate`}>{value}</div>
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
      
      {/* Expanded view */}
      {isExpanded ? (
        <>
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
          
          {/* Detailed stats */}
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
        </>
      ) : (
        /* Collapsed view with navigation below cards */
        <div className="mt-4">
          {/* Cards */}
          <div className="grid grid-cols-2 gap-4">
            {allStats.slice(currentPage * 2, currentPage * 2 + 2).map((stat, index) => (
              <StatItem 
                key={currentPage * 2 + index}
                label={stat.label}
                value={stat.value}
                textColor={stat.textColor}
              />
            ))}
          </div>
          
          {/* Navigation controls below cards */}
          <div className="flex items-center justify-center mt-3 space-x-2">
            {/* Left arrow - only show if not on first page */}
            {currentPage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPage(currentPage - 1);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Previous page"
              >
                ◀
              </button>
            )}
            
            {/* Page indicator dots */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPage(index);
                  }}
                  className={`h-2 w-2 rounded-full ${
                    currentPage === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Right arrow - only show if not on last page */}
            {currentPage < totalPages - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPage(currentPage + 1);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Next page"
              >
                ▶
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentStatsCard;
