import React from "react";

function CurrentStatsCard({ 
  balance, 
  contractsForTrade, 
  tradesToday, 
  tradesPerDay, 
  stopLossRemaining, 
  isFixedStop 
}) {
  // Calculate stats including break-even trades
  const completedTrades = tradesToday.filter(trade => trade !== null);
  const winningTrades = completedTrades.filter(trade => trade.outcome === "win");
  const losingTrades = completedTrades.filter(trade => trade.outcome === "loss");
  const breakEvenTrades = completedTrades.filter(trade => trade.outcome === "breakEven");
  
  // Only count wins and losses for win rate (exclude break-even)
  const winLossTotal = winningTrades.length + losingTrades.length;
  const winRate = winLossTotal > 0 
    ? Math.round((winningTrades.length / winLossTotal) * 100) 
    : 0;
    
  // Calculate today's P/L
  const todaysPL = completedTrades.reduce((total, trade) => {
    if (trade.outcome === "win") return total + trade.profit;
    if (trade.outcome === "loss") return total - trade.loss;
    return total; // break even
  }, 0);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Today's Trading Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Account Status */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-2">Account Balance</h3>
            <p className="text-3xl font-bold text-blue-600">${balance.toFixed(2)}</p>
            
            <div className="mt-5 w-full pt-4 border-t border-gray-200">
              <h4 className="text-gray-500 font-medium text-sm mb-1 text-center">Today's P/L</h4>
              <p className={`text-xl font-bold text-center ${todaysPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {todaysPL >= 0 ? '+$' : '-$'}{Math.abs(todaysPL).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Trade Setup */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
          <div className="flex flex-col items-center">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-2">Next Trade</h3>
            <div className="flex items-baseline">
              <p className="text-3xl font-bold text-indigo-600">{contractsForTrade}</p>
              <span className="text-sm text-gray-500 ml-1">contracts</span>
            </div>
            
            <div className="mt-5 w-full pt-4 border-t border-gray-200">
              {isFixedStop ? (
                <div className="text-center">
                  <h4 className="text-gray-500 font-medium text-sm mb-1">Stop Loss Remaining</h4>
                  <p className="text-xl font-bold text-red-500">${stopLossRemaining.toFixed(2)}</p>
                </div>
              ) : (
                <div className="text-center">
                  <h4 className="text-gray-500 font-medium text-sm mb-1">Trades Today</h4>
                  <div className="flex items-center justify-center">
                    <p className="text-xl font-bold">{completedTrades.length} <span className="text-gray-400">/</span> {tradesPerDay}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(completedTrades.length / tradesPerDay) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Performance */}
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider mb-3 text-center">Today's Performance</h3>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col items-center">
              <span className="text-green-500 font-bold text-2xl">{winningTrades.length}</span>
              <span className="text-xs text-gray-500">Wins</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-red-500 font-bold text-2xl">{losingTrades.length}</span>
              <span className="text-xs text-gray-500">Losses</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-yellow-500 font-bold text-2xl">{breakEvenTrades.length}</span>
              <span className="text-xs text-gray-500">B/E</span>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-gray-200">
            <div className="flex justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">Win Rate</span>
              <span className="text-xs font-medium text-gray-700">{winRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${winRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentStatsCard;
