import React, { useState } from "react";

function TrackerSection({ tradesToday, onTradeOutcome, onNextDay, settings }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">Today's Trades</h2>
        <button
          onClick={onNextDay}
          className="bg-blue-500 hover:bg-blue-600 text-white py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg font-bold text-sm sm:text-base w-full sm:w-auto"
        >
          Next Day
        </button>
      </div>

      {/* Toggle button for mobile view */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-bold text-sm w-full"
        >
          {isCollapsed ? "Show Stats" : "Hide Stats"}
        </button>
      </div>

      {/* Desktop view - Table */}
      <div className={`hidden sm:block overflow-x-auto ${isCollapsed ? "hidden" : ""}`}>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700 w-16">
                #
              </th>
              <th className="py-3 px-4 text-left font-semibold text-sm text-gray-700">
                Outcome
              </th>
              <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700">
                P/L
              </th>
              <th className="py-3 px-4 text-center font-semibold text-sm text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tradesToday.map((trade, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  <span className="inline-block bg-gray-200 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {trade !== null && (
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        trade.outcome === "win"
                          ? "bg-green-100 text-green-800"
                          : trade.outcome === "breakEven"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {trade.outcome === "win"
                        ? "Win"
                        : trade.outcome === "breakEven"
                        ? "Break Even"
                        : "Loss"}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {trade !== null && (
                    <span
                      className={`font-medium ${
                        trade.outcome === "win"
                          ? "text-green-600"
                          : trade.outcome === "breakEven"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {trade.outcome === "win"
                        ? `+$${trade.profit}`
                        : trade.outcome === "breakEven"
                        ? "$0.00"
                        : `-$${trade.loss}`}
                    </span>
                  )}
                  {trade?.note && (
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      {trade.note}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {trade === null && (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onTradeOutcome(index, "win")}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Win
                      </button>
                      <button
                        onClick={() => onTradeOutcome(index, "loss")}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Loss
                      </button>
                      <button
                        onClick={() => onTradeOutcome(index, "breakEven")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm"
                      >
                        B/E
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Card layout */}
      <div className={`sm:hidden space-y-4 ${isCollapsed ? "hidden" : ""}`}>
        {tradesToday.map((trade, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="inline-flex items-center justify-center bg-gray-200 text-gray-800 font-bold rounded-full w-7 h-7">
                {index + 1}
              </span>

              {trade !== null ? (
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    trade.outcome === "win"
                      ? "bg-green-100 text-green-800"
                      : trade.outcome === "breakEven"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {trade.outcome === "win"
                    ? "Win"
                    : trade.outcome === "breakEven"
                    ? "Break Even"
                    : "Loss"}
                </span>
              ) : (
                <span className="text-xs text-gray-500 font-medium">
                  Pending
                </span>
              )}
            </div>

            {trade !== null && (
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-medium ${
                    trade.outcome === "win"
                      ? "text-green-600"
                      : trade.outcome === "breakEven"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {trade.outcome === "win"
                    ? `+$${trade.profit}`
                    : trade.outcome === "breakEven"
                    ? "$0.00"
                    : `-$${trade.loss}`}
                </span>
                {trade?.note && (
                  <p className="text-xs text-gray-500 mt-1">{trade.note}</p>
                )}
              </div>
            )}

            {trade === null && (
              <div className="flex justify-between items-center mt-2">
                <button
                  onClick={() => onTradeOutcome(index, "win")}
                  className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-2 rounded text-xs font-medium"
                >
                  Win
                </button>
                <button
                  onClick={() => onTradeOutcome(index, "loss")}
                  className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-2 rounded text-xs font-medium"
                >
                  Loss
                </button>
                <button
                  onClick={() => onTradeOutcome(index, "breakEven")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-2 rounded text-xs font-medium"
                >
                  B/E
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {tradesToday.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No trades available for today.
        </div>
      )}
    </div>
  );
}

export default TrackerSection;
