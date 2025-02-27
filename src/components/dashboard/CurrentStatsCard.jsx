import React from "react";

function CurrentStatsCard({
  balance,
  contractsForTrade,
  tradesToday,
  tradesPerDay,
  stopLossRemaining,
  isFixedStop,
}) {
  // Calculate the number of trades used and remaining (only relevant in trades mode)
  const tradesUsed = tradesToday ? tradesToday.filter((t) => t !== null).length : 0;
  const tradesRemaining = tradesPerDay - tradesUsed;

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Left Card: Current Balance */}
      <div className="bg-white text-gray-900 rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
        <p className="text-4xl font-bold text-green-600">${balance.toFixed(2)}</p>
      </div>

      {/* Middle Card: Contracts per Trade (always calculated the same) */}
      <div className="bg-white text-gray-900 rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Contracts per Trade</h2>
        <p className="text-4xl font-bold">{contractsForTrade}</p>
      </div>

      {/* Right Card: Mode-specific */}
      {isFixedStop ? (
        // Fixed Stop mode: Show Stop Loss Remaining (in dollars)
        <div className="bg-white text-gray-900 rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Stop Loss Remaining</h2>
          <p className="text-4xl font-bold">
            ${stopLossRemaining ? stopLossRemaining.toFixed(2) : "0.00"}
          </p>
        </div>
      ) : (
        // Trades mode: Show Trades Remaining
        <div className="bg-white text-gray-900 rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Trades Remaining</h2>
          <p className="text-4xl font-bold">
            {tradesRemaining}/{tradesPerDay}
          </p>
        </div>
      )}
    </div>
  );
}

export default CurrentStatsCard;
