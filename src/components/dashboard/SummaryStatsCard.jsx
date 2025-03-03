// src/components/dashboard/SummaryStatsCard.jsx
import React, { useState, useEffect } from "react";
import HistoricalChart from "./HistoricalChart";

function SummaryStatsCard({ summaryStats }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!summaryStats) {
    return (
      <div className="bg-white text-gray-900 p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <p>No data to display.</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p>
            Total Profit:{" "}
            <span className="font-bold">
              ${summaryStats.totalProfit.toFixed(2)}
            </span>
          </p>
          <p>
            Average Profit per Day:{" "}
            <span className="font-bold">
              ${summaryStats.averageProfit.toFixed(2)}
            </span>
          </p>
        </div>
        <div>
          <p>
            Total Trades:{" "}
            <span className="font-bold">{summaryStats.totalTrades}</span>
          </p>
          <p>
            Break-Even Trades:{" "}
            <span className="font-bold">{summaryStats.breakEvenTrades}</span>
          </p>
          <p>
            Loss Trades:{" "}
            <span className="font-bold">{summaryStats.lossTrades}</span>
          </p>
          <p>
            Total Days:{" "}
            <span className="font-bold">{summaryStats.totalDays}</span>
          </p>
        </div>
      </div>
      {/* Historical Data Chart */}
      <div className="border-t border-gray-300 pt-4">
        {/* Toggle Details */}
        <div className="flex justify-between items-center mb-4">
          <h4
            className={`font-semibold text-blue-500 cursor-pointer ${
              hovered ? "underline" : ""
            }`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setOpen(!open)}
          >
            {open ? "Hide Trade Details" : "Show Trade Details"}
          </h4>
          {open && summaryStats.totalTrades > 0 && (
            <div>
              <HistoricalChart historicalData={[]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SummaryStatsCard;
