import React from "react";

function SummaryStatsCard({ summaryStats }) {
  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-xl p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Summary Stats</h2>
      {summaryStats ? (
        <div className="space-y-3 text-lg">
          <div className="flex justify-between">
            <span>Total Profit:</span>
            <span className="font-bold text-green-600">
              ${summaryStats.totalProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Average Profit:</span>
            <span className="font-bold">
              ${summaryStats.averageProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Total Trades:</span>
            <span className="font-bold">{summaryStats.totalTrades}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Days:</span>
            <span className="font-bold">{summaryStats.totalDays}</span>
          </div>
        </div>
      ) : (
        <p className="text-center">No summary available yet.</p>
      )}
    </div>
  );
}

export default SummaryStatsCard;
