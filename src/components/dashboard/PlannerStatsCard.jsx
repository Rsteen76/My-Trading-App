import React, { useState } from "react";

function PlannerStatsCard({ settings }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!settings) return null;

  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-xl p-4 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Planner Stats</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-blue-500 hover:text-blue-700 text-sm"
        >
          {isCollapsed ? "Expand" : "Collapse"}
        </button>
      </div>
      {!isCollapsed && (
        <div className="mt-3">
          <table className="w-full text-xs border-t border-b border-gray-300">
            <tbody className="divide-y divide-gray-300">
              <tr>
                <td className="py-1 font-medium text-gray-600 pr-1">Mode:</td>
                <td className="py-1 text-right pr-4">{settings.mode}</td>
                
                <td className="py-1 border-l border-gray-400 shadow-sm pl-4 font-medium text-gray-600 pr-1">Trades/Day:</td>
                <td className="py-1 text-right pr-4">{settings.tradesPerDay || "N/A"}</td>
                
                <td className="py-1 border-l border-gray-400 shadow-sm pl-4 font-medium text-gray-600 pr-1">Win Rate:</td>
                <td className="py-1 text-right">{settings.winRate}%</td>
              </tr>
              <tr>
                <td className="py-1 font-medium text-gray-600 pr-1">Risk:</td>
                <td className="py-1 text-right pr-4">{settings.riskPercent}%</td>
                
                <td className="py-1 border-l border-gray-400 shadow-sm pl-4 font-medium text-gray-600 pr-1">SL Points:</td>
                <td className="py-1 text-right pr-4">{settings.stopLossPoints}</td>
                
                <td className="py-1 border-l border-gray-400 shadow-sm pl-4 font-medium text-gray-600 pr-1">Target:</td>
                <td className="py-1 text-right">{settings.target} pts</td>
              </tr>
              <tr>
                <td className="py-1 font-medium text-gray-600 pr-1">$ Per Point:</td>
                <td className="py-1 text-right pr-4">${settings.dollarValueOfPoints}</td>
                
                <td className="py-1 border-l border-gray-400 shadow-sm pl-4 font-medium text-gray-600 pr-1">Loss Limit:</td>
                <td className="py-1 text-right pr-4">{settings.fixedStopLoss || "N/A"}</td>
                
                <td className="py-1 border-l border-gray-400 shadow-sm pl-4 font-medium text-gray-600 pr-1">Initial Balance:</td>
                <td className="py-1 text-right">${settings.initialBalance}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PlannerStatsCard;
