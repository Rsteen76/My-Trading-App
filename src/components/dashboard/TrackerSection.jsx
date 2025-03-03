// src/components/dashboard/TrackerSection.jsx
import React, { useState, useEffect } from "react";

function TrackerSection({
  tradesToday,
  onTradeOutcome,
  onNextDay,
  onPreviousDay,
  settings,
  stopLossRemaining,
  currentDate
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isStopLossHit, setIsStopLossHit] = useState(false);
  const tradeOutcomes = ["win", "loss", "breakEven"];

  useEffect(() => {
    // Check if stop loss has been hit
    setIsStopLossHit(stopLossRemaining <= 0);
  }, [stopLossRemaining]);

  // Calculate stop loss percentage used
  const stopLossPercentage = settings && settings.mode === "fixedStop" && settings.maxDailyLoss 
    ? Math.max(0, 100 - (stopLossRemaining / settings.maxDailyLoss * 100)) 
    : 0;

  // Format date options
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  // Check if new trades are allowed
  const canEnterTrades = !(isStopLossHit && settings?.mode === "fixedStop");

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-8">
      {/* Date navigation header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Trades</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onPreviousDay}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Previous day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="text-base sm:text-lg font-medium text-gray-700">
            {currentDate.toLocaleDateString(undefined, dateOptions)}
          </span>
          
          <button
            onClick={onNextDay}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Next day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Stop Loss Progress Bar */}
      {settings && settings.mode === "fixedStop" && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Stop Loss: ${stopLossRemaining.toFixed(2)} remaining</span>
            <span>{stopLossPercentage.toFixed(1)}% used</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${isStopLossHit ? 'bg-red-600' : 'bg-amber-500'}`}
              style={{ width: `${stopLossPercentage}%` }}
            ></div>
          </div>
          {isStopLossHit && (
            <div className="text-red-600 font-bold text-sm mt-1">
              Stop Loss Hit - Cannot Enter More Trades
            </div>
          )}
        </div>
      )}

      {/* Toggle button for mobile view */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-bold text-sm w-full flex justify-between items-center"
        >
          <span>{isCollapsed ? "Show Trades" : "Hide Trades"}</span>
          <span>{isCollapsed ? "+" : "-"}</span>
        </button>
        
        {/* Mobile summary stats when collapsed */}
        {isCollapsed && tradesToday.length > 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded">
            <div className="text-sm">
              <span className="font-semibold">Trades:</span> {tradesToday.length}
            </div>
          </div>
        )}
      </div>

      {/* Desktop view - Table */}
      <div className="hidden sm:block overflow-x-auto">
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
                    <>
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
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {trade.note}
                        </p>
                      )}
                    </>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {trade === null && (
                    <div className="flex justify-center space-x-2">
                      {tradeOutcomes.map((outcome) => (
                        <button
                          key={outcome}
                          onClick={() => onTradeOutcome(index, outcome)}
                          className={`text-white py-1 px-3 rounded text-sm ${
                            outcome === "win"
                              ? "bg-green-500 hover:bg-green-600"
                              : outcome === "loss"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-yellow-500 hover:bg-yellow-600"
                          } ${!canEnterTrades ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!canEnterTrades}
                          title={!canEnterTrades ? "Stop loss hit - cannot enter trade" : `Mark trade as ${outcome}`}
                        >
                          {outcome.charAt(0).toUpperCase() + outcome.slice(1)}
                        </button>
                      ))}
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
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center bg-gray-200 text-gray-800 font-bold rounded-full w-7 h-7">
                  {index + 1}
                </span>
              </div>

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
              <div className="grid grid-cols-3 gap-2 mt-2">
                {tradeOutcomes.map((outcome) => (
                  <button
                    key={outcome}
                    onClick={() => onTradeOutcome(index, outcome)}
                    className={`text-white py-1.5 px-0 rounded text-xs font-medium ${
                      outcome === "win"
                        ? "bg-green-500 hover:bg-green-600"
                        : outcome === "loss"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    } ${!canEnterTrades ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!canEnterTrades}
                  >
                    {outcome.charAt(0).toUpperCase() + outcome.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modified condition - show "Creating trades..." message when in fixed trades mode but no trades yet */}
      {tradesToday.length === 0 && settings?.mode === "fixedTrades" && (
        <div className="text-center py-8 text-blue-500 animate-pulse">
          Creating trades based on your settings...
        </div>
      )}

      {/* Only show "No trades" message if not in fixed trades mode */}
      {tradesToday.length === 0 && (!settings || settings.mode !== "fixedTrades") && (
        <div className="text-center py-8 text-gray-500">
          No trades available for today.
        </div>
      )}
    </div>
  );
}

export default TrackerSection;
