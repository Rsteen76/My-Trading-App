import React, { useState } from "react";

function PlannerStatsCard({ settings }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!settings) return null;

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow p-4 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Planner Stats</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-blue-500 hover:text-blue-700"
        >
          {isCollapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <p className="font-medium">Mode:</p>
            <p>{settings.mode}</p>
          </div>
          <div>
            <p className="font-medium">Trades Per Day:</p>
            <p>{settings.tradesPerDay || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Daily Loss Limit:</p>
            <p>{settings.fixedStopLoss || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Win Rate (%):</p>
            <p>{settings.winRate}</p>
          </div>
          <div>
            <p className="font-medium">Risk % (of Account):</p>
            <p>{settings.riskPercent}</p>
          </div>
          <div>
            <p className="font-medium">Stop Loss Points:</p>
            <p>{settings.stopLossPoints}</p>
          </div>
          <div>
            <p className="font-medium">Target (Points):</p>
            <p>{settings.target}</p>
          </div>
          <div>
            <p className="font-medium">Dollar Value of Points:</p>
            <p>{settings.dollarValueOfPoints}</p>
          </div>
          <div>
            <p className="font-medium">Initial Account Balance:</p>
            <p>{settings.initialBalance}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlannerStatsCard;
