import React from "react";

function CurrentStatsCard({ balance, contractsForTrade, tradesToday, tradesPerDay }) {
  return (
    <div className="max-w-5xl mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Current Balance</h2>
          <p className="text-4xl font-bold text-green-600">${balance.toFixed(2)}</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Contracts per Trade</h2>
          <p className="text-4xl font-bold">{contractsForTrade}</p>
        </div>

        <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Trades Remaining</h2>
          <p className="text-4xl font-bold">
            {tradesPerDay - tradesToday.filter((t) => t !== null).length}/{tradesPerDay}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurrentStatsCard;
