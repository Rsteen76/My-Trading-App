// In components/dashboard/SummaryStatsCard.jsx

import React, { useState, useRef } from "react";

function SummaryStatsCard({ summaryStats }) {
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  // Prepare all stats for collapsed view
  const allStats = [
    {
      label: "Total P/L",
      value: `${summaryStats.totalProfit >= 0 ? '+$' : '-$'}${Math.abs(summaryStats.totalProfit).toFixed(2)}`,
      textColor: summaryStats.totalProfit >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      label: "Win Rate",
      value: `${winRate}%`,
      textColor: "text-blue-600"
    },
    {
      label: "Avg Daily P/L",
      value: `${summaryStats.averageProfit >= 0 ? '+$' : '-$'}${Math.abs(summaryStats.averageProfit).toFixed(2)}`,
      textColor: summaryStats.averageProfit >= 0 ? "text-green-500" : "text-red-500"
    },
    {
      label: "Trading Days",
      value: summaryStats.totalDays,
      textColor: "text-blue-600"
    },
    {
      label: "Wins",
      value: winTrades,
      textColor: "text-green-500"
    },
    {
      label: "Losses",
      value: lossTrades,
      textColor: "text-red-500"
    },
    {
      label: "Break Even",
      value: summaryStats.breakEvenTrades || 0,
      textColor: "text-yellow-500"
    },
    {
      label: "Total Trades",
      value: summaryStats.totalTrades,
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
      
      {/* Expanded view */}
      {isExpanded ? (
        <>
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
          
          {/* Detailed stats */}
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

export default SummaryStatsCard;
